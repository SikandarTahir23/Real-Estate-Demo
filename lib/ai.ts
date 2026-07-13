// Reusable server-side AI client for all chat/reply generation.
//
// Default provider is xAI's Grok, which exposes an OpenAI-compatible
// /chat/completions endpoint — so this single client speaks that format and the
// provider is swappable purely through environment variables (no code change to
// point at OpenAI, Together, Groq-the-inference-host, a local proxy, etc.):
//
//   AI_API_KEY        preferred generic key; falls back to GROK_API_KEY
//   AI_BASE_URL       default https://api.x.ai/v1
//   AI_MODEL          default grok-2-latest
//   AI_PROVIDER       label only, for diagnostics (default "grok")
//
// Secrets are read from the environment at call time and never hardcoded. This
// module is server-only: it must never be imported into a Client Component (the
// key would leak into the bundle). The two callers are the /api/matcher and
// /api/chat route handlers, both of which run on the server.
//
// Every network call has bounded retries with exponential backoff, and a missing
// or invalid key surfaces as a typed error the routes can catch to run their
// graceful fallbacks — the app never hard-crashes because the LLM is down.

// ── Configuration (env-driven, resolved lazily so build never needs a key) ──

const DEFAULT_BASE_URL = 'https://api.x.ai/v1'
// grok-3 is a current, valid xAI model id (the retired grok-2-* names now 404).
// Override with AI_MODEL to use grok-4 or a newer id without touching code.
const DEFAULT_MODEL = 'grok-3'
const DEFAULT_PROVIDER = 'grok'

export interface AIConfig {
  apiKey: string
  baseUrl: string
  model: string
  provider: string
}

/** True when an API key is present. Routes check this to pick fast-path vs fallback. */
export function isAIConfigured(): boolean {
  return Boolean(process.env.AI_API_KEY || process.env.GROK_API_KEY)
}

/** Human-readable provider label for logs/among diagnostics. Never includes the key. */
export function aiProviderLabel(): string {
  return process.env.AI_PROVIDER?.trim() || DEFAULT_PROVIDER
}

// Distinct error type so callers can tell "not configured" apart from a transient
// network/API failure if they ever want to; both currently trigger the same fallback.
export class AIConfigError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AIConfigError'
  }
}

export class AIRequestError extends Error {
  readonly status?: number
  constructor(message: string, status?: number) {
    super(message)
    this.name = 'AIRequestError'
    this.status = status
  }
}

function resolveConfig(): AIConfig {
  const apiKey = process.env.AI_API_KEY || process.env.GROK_API_KEY || ''
  if (!apiKey) {
    throw new AIConfigError(
      'No AI API key set (expected AI_API_KEY or GROK_API_KEY).',
    )
  }
  return {
    apiKey,
    baseUrl: (process.env.AI_BASE_URL?.trim() || DEFAULT_BASE_URL).replace(/\/$/, ''),
    model: process.env.AI_MODEL?.trim() || DEFAULT_MODEL,
    provider: aiProviderLabel(),
  }
}

// ── OpenAI-compatible chat types (subset we use) ──

export type ChatRole = 'system' | 'user' | 'assistant' | 'tool'

export interface ChatMessage {
  role: ChatRole
  content: string
  // Present on assistant messages that call tools, and echoed back on tool results.
  tool_call_id?: string
  tool_calls?: ToolCall[]
}

export interface ToolDefinition {
  type: 'function'
  function: {
    name: string
    description: string
    parameters: Record<string, unknown> // JSON Schema
  }
}

export interface ToolCall {
  id: string
  type: 'function'
  function: { name: string; arguments: string } // arguments is a JSON string
}

interface ChatCompletionChoice {
  message?: {
    role?: string
    content?: string | null
    tool_calls?: ToolCall[]
  }
  finish_reason?: string
}

interface ChatCompletionResponse {
  choices?: ChatCompletionChoice[]
}

export interface ChatOptions {
  messages: ChatMessage[]
  tools?: ToolDefinition[]
  // 'auto' lets the model choose; forcing a specific function name yields structured
  // extraction (used by the matcher). Mirrors OpenAI's tool_choice contract.
  toolChoice?: 'auto' | 'none' | { type: 'function'; function: { name: string } }
  temperature?: number
  maxTokens?: number
  signal?: AbortSignal
}

// ── Retry policy ──

const MAX_RETRIES = 2 // → up to 3 attempts total
const BASE_DELAY_MS = 400

// Retry only on transient conditions: network errors, 429, and 5xx. A 400/401/403
// is a permanent client error (bad key, malformed request) — retrying wastes time.
function isRetriableStatus(status: number): boolean {
  return status === 429 || status >= 500
}

function backoffDelay(attempt: number): number {
  // 400ms, 800ms — deterministic exponential backoff (no jitter needed server-side).
  return BASE_DELAY_MS * 2 ** attempt
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new DOMException('Aborted', 'AbortError'))
    const id = setTimeout(resolve, ms)
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(id)
        reject(new DOMException('Aborted', 'AbortError'))
      },
      { once: true },
    )
  })
}

// ── Core call: one chat completion with bounded retries ──

/**
 * Low-level chat completion. Returns the raw first choice's message so callers can
 * read either `content` (prose) or `tool_calls` (structured extraction).
 * Throws AIConfigError (no key) or AIRequestError (exhausted retries / bad response).
 */
export async function chatCompletionRaw(
  options: ChatOptions,
): Promise<ChatCompletionChoice['message']> {
  const config = resolveConfig()

  const body: Record<string, unknown> = {
    model: config.model,
    messages: options.messages,
    temperature: options.temperature ?? 0.7,
  }
  if (options.maxTokens) body.max_tokens = options.maxTokens
  if (options.tools?.length) {
    body.tools = options.tools
    body.tool_choice = options.toolChoice ?? 'auto'
  }

  let lastError: Error = new AIRequestError('AI request failed')

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(`${config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify(body),
        signal: options.signal,
      })

      if (!res.ok) {
        const status = res.status
        // Read the error body best-effort for a useful message (never logged with key).
        const detail = await res.text().catch(() => '')
        const err = new AIRequestError(
          `AI API ${status}${detail ? `: ${detail.slice(0, 200)}` : ''}`,
          status,
        )
        if (isRetriableStatus(status) && attempt < MAX_RETRIES) {
          lastError = err
          await sleep(backoffDelay(attempt), options.signal)
          continue
        }
        throw err
      }

      const json = (await res.json()) as ChatCompletionResponse
      const message = json.choices?.[0]?.message
      if (!message) {
        throw new AIRequestError('AI response had no choices')
      }
      return message
    } catch (err) {
      // A caller-driven abort is control flow, not a retriable failure.
      if (err instanceof DOMException && err.name === 'AbortError') throw err
      if (err instanceof AIConfigError) throw err
      lastError = err instanceof Error ? err : new AIRequestError(String(err))
      // Network-level throw (fetch rejected): retry if attempts remain.
      if (attempt < MAX_RETRIES) {
        await sleep(backoffDelay(attempt), options.signal)
        continue
      }
    }
  }

  throw lastError
}

/**
 * Convenience wrapper for plain text replies (the chatbot). Returns the assistant's
 * message content as a trimmed string.
 */
export async function chatReply(
  messages: ChatMessage[],
  opts: { temperature?: number; maxTokens?: number; signal?: AbortSignal } = {},
): Promise<string> {
  const message = await chatCompletionRaw({ messages, ...opts })
  const content = message?.content ?? ''
  if (!content.trim()) {
    throw new AIRequestError('AI returned an empty reply')
  }
  return content.trim()
}

/**
 * Forced single-function tool call for structured extraction (the matcher). Returns
 * the parsed arguments object of the first tool call. Throws if the model didn't call
 * the tool or returned unparseable arguments.
 */
export async function callTool<T = unknown>(
  messages: ChatMessage[],
  tool: ToolDefinition,
  opts: { temperature?: number; signal?: AbortSignal } = {},
): Promise<T> {
  const message = await chatCompletionRaw({
    messages,
    tools: [tool],
    toolChoice: { type: 'function', function: { name: tool.function.name } },
    temperature: opts.temperature ?? 0,
    signal: opts.signal,
  })

  const call = message?.tool_calls?.find(
    (c) => c.function.name === tool.function.name,
  )
  if (!call) {
    throw new AIRequestError(`Model did not call ${tool.function.name}`)
  }
  try {
    return JSON.parse(call.function.arguments) as T
  } catch {
    throw new AIRequestError(
      `Could not parse arguments for ${tool.function.name}`,
    )
  }
}

// ── Connection verification ──

export interface VerifyResult {
  ok: boolean
  provider: string
  model: string
  baseUrl: string
  detail: string
}

/**
 * Sends a minimal live request to confirm the key and endpoint work. Never throws —
 * always resolves to a result object so a health check / setup script can report
 * cleanly whether the provider is reachable.
 */
export async function verifyConnection(): Promise<VerifyResult> {
  let config: AIConfig
  try {
    config = resolveConfig()
  } catch (err) {
    return {
      ok: false,
      provider: aiProviderLabel(),
      model: process.env.AI_MODEL?.trim() || DEFAULT_MODEL,
      baseUrl: process.env.AI_BASE_URL?.trim() || DEFAULT_BASE_URL,
      detail: err instanceof Error ? err.message : 'not configured',
    }
  }

  try {
    const reply = await chatReply(
      [
        { role: 'system', content: 'Reply with exactly the word: pong.' },
        { role: 'user', content: 'ping' },
      ],
      { temperature: 0, maxTokens: 5 },
    )
    return {
      ok: true,
      provider: config.provider,
      model: config.model,
      baseUrl: config.baseUrl,
      detail: `Live reply: ${reply}`,
    }
  } catch (err) {
    return {
      ok: false,
      provider: config.provider,
      model: config.model,
      baseUrl: config.baseUrl,
      detail: err instanceof Error ? err.message : 'request failed',
    }
  }
}
