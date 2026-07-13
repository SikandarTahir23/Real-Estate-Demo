import { NextResponse } from 'next/server'
import { chatReply, isAIConfigured, type ChatMessage } from '@/lib/ai'
import { properties } from '@/lib/properties'

// POST /api/chat — the site assistant, powered by Grok via lib/ai.ts (spec §5 ethos,
// §10 content authenticity).
//
// Resilience mirrors the matcher: if the key is missing or the model call fails, we
// still return HTTP 200 with a graceful canned reply and fallback: true, so the widget
// degrades to a "point you to WhatsApp" message rather than showing an error.
//
// The assistant is grounded on the real (illustrative) catalogue and constrained by a
// system prompt: it must not invent listings, must keep the concept-demo disclosure
// honest, and must never claim real regulatory credentials (§10).

export const runtime = 'nodejs'

const MAX_HISTORY = 10 // cap context we forward to the model
const MAX_MSG_LEN = 2000

interface ChatRequestBody {
  messages?: Array<{ role?: unknown; content?: unknown }>
}

interface ChatApiResponse {
  reply: string
  fallback: boolean
}

// Compact, factual catalogue so the assistant can talk about real inventory without a
// tool round-trip — cheap grounding for a small static dataset.
function catalogueSummary(): string {
  return properties
    .map(
      (p) =>
        `- ${p.title} (${p.type}, ${p.purpose}, ${p.status}) in ${p.area}, ${p.emirate}. ` +
        `AED ${p.priceAED.toLocaleString('en-US')}, ${p.beds} bed / ${p.baths} bath, ` +
        `${p.sizeSqft} sqft. slug: ${p.slug}`,
    )
    .join('\n')
}

const SYSTEM_PROMPT = [
  'You are the Meridian Estates assistant, a concise, helpful concierge for a UAE',
  'residential property portal (Dubai and Abu Dhabi).',
  '',
  'Rules:',
  '- Meridian Estates is a concept/demo portfolio project. If asked, be honest that',
  '  listings, pricing, advisors, and reviews are illustrative and not a real brokerage.',
  '- Only reference properties from the catalogue below. Never invent listings, prices,',
  '  amenities, or figures. If you are unsure, say so and offer to connect the user with',
  '  an advisor on WhatsApp.',
  '- Do NOT claim any real regulatory license or certification. The DLD 4% transfer fee',
  '  may be mentioned as a public Dubai rule, but never as a Meridian credential.',
  '- Keep replies short (2-4 sentences). You may suggest a listing by name and mention',
  '  that the user can open it from the Listings page, or use the on-site AI matcher and',
  '  mortgage calculator.',
  '- Do not give binding financial or legal advice; frame figures as estimates.',
  '',
  'Catalogue:',
  catalogueSummary(),
].join('\n')

// Deterministic, honest fallback when the model is unavailable (§5 resilience). No
// invented content — points the user at the real on-site tools and WhatsApp.
const FALLBACK_REPLY =
  "I'm having trouble reaching the assistant right now. You can browse listings, try the " +
  'AI matcher on the home page, or use the mortgage calculator — and an advisor is a tap ' +
  'away on WhatsApp whenever you need a person.'

function sanitiseHistory(input: ChatRequestBody['messages']): ChatMessage[] {
  if (!Array.isArray(input)) return []
  const cleaned: ChatMessage[] = []
  for (const m of input) {
    const role = m?.role
    const content = m?.content
    if (
      (role === 'user' || role === 'assistant') &&
      typeof content === 'string' &&
      content.trim().length > 0
    ) {
      cleaned.push({ role, content: content.slice(0, MAX_MSG_LEN) })
    }
  }
  // Only forward the most recent turns.
  return cleaned.slice(-MAX_HISTORY)
}

export async function POST(
  request: Request,
): Promise<NextResponse<ChatApiResponse>> {
  let history: ChatMessage[] = []
  try {
    const body = (await request.json()) as ChatRequestBody
    history = sanitiseHistory(body.messages)
  } catch {
    // Malformed body → treated as empty history; handled below.
  }

  // Nothing to answer, or no key configured → graceful fallback (still HTTP 200).
  if (history.length === 0 || !isAIConfigured()) {
    return NextResponse.json({ reply: FALLBACK_REPLY, fallback: true })
  }

  try {
    const reply = await chatReply(
      [{ role: 'system', content: SYSTEM_PROMPT }, ...history],
      { temperature: 0.5, maxTokens: 400 },
    )
    return NextResponse.json({ reply, fallback: false })
  } catch {
    return NextResponse.json({ reply: FALLBACK_REPLY, fallback: true })
  }
}
