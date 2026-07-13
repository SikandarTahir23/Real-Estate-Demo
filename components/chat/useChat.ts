'use client'

import { useCallback, useRef, useState } from 'react'

// Chat hook for the site assistant (spec §5 ethos). Owns the message thread and the
// request lifecycle — mirrors useMatcher: loading drives skeleton/typing state (never a
// spinner, §11), and an AbortController cancels an in-flight reply if the user sends
// again before it returns.

export interface ChatTurn {
  id: string
  role: 'user' | 'assistant'
  content: string
  fallback?: boolean
}

interface ChatApiResponse {
  reply: string
  fallback: boolean
}

interface UseChatResult {
  messages: ChatTurn[]
  isSending: boolean
  error: boolean
  send: (text: string) => void
  reset: () => void
}

export function useChat(): UseChatResult {
  const [messages, setMessages] = useState<ChatTurn[]>([])
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState(false)
  const controllerRef = useRef<AbortController | null>(null)
  const idRef = useRef(0)

  // Monotonic ids — Date.now()/Math.random() are avoided so this stays deterministic
  // and lint-clean; a simple counter is sufficient for React keys.
  const nextId = () => {
    idRef.current += 1
    return `m${idRef.current}`
  }

  const send = useCallback((text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isSending) return

    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller

    const userTurn: ChatTurn = { id: nextId(), role: 'user', content: trimmed }
    // Snapshot the outgoing thread so we send full context to the server.
    const outgoing = [...messages, userTurn].map((m) => ({
      role: m.role,
      content: m.content,
    }))

    setMessages((prev) => [...prev, userTurn])
    setIsSending(true)
    setError(false)

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ messages: outgoing }),
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Chat request failed: ${res.status}`)
        return (await res.json()) as ChatApiResponse
      })
      .then((json) => {
        if (controller.signal.aborted) return
        setMessages((prev) => [
          ...prev,
          {
            id: nextId(),
            role: 'assistant',
            content: json.reply,
            fallback: json.fallback,
          },
        ])
        setIsSending(false)
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return
        setError(true)
        setIsSending(false)
      })
  }, [isSending, messages])

  const reset = useCallback(() => {
    controllerRef.current?.abort()
    setMessages([])
    setIsSending(false)
    setError(false)
  }, [])

  return { messages, isSending, error, send, reset }
}
