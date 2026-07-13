'use client'

import { useCallback, useRef, useState } from 'react'
import type { MatcherResponse } from '@/types'

// Matcher hook (spec §2, §5): owns the query lifecycle — submit, loading (drives the
// skeleton state, never a spinner — §11), results, fallback flag, and error. An
// AbortController cancels an in-flight request when a new one is submitted, so rapid
// resubmits can't render stale results out of order.

type MatcherStatus = 'idle' | 'loading' | 'success' | 'error'

interface UseMatcherResult {
  status: MatcherStatus
  data: MatcherResponse | null
  error: boolean
  submit: (query: string) => void
  reset: () => void
}

export function useMatcher(): UseMatcherResult {
  const [status, setStatus] = useState<MatcherStatus>('idle')
  const [data, setData] = useState<MatcherResponse | null>(null)
  const controllerRef = useRef<AbortController | null>(null)

  const submit = useCallback((query: string) => {
    const trimmed = query.trim()
    if (!trimmed) return

    // Cancel any in-flight request before starting a new one.
    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller

    setStatus('loading')

    fetch('/api/matcher', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query: trimmed }),
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Matcher request failed: ${res.status}`)
        return (await res.json()) as MatcherResponse
      })
      .then((json) => {
        // Ignore a response that a newer submit has already superseded.
        if (controller.signal.aborted) return
        setData(json)
        setStatus('success')
      })
      .catch((err: unknown) => {
        // An abort is expected control flow, not a user-facing error.
        if (err instanceof DOMException && err.name === 'AbortError') return
        setStatus('error')
      })
  }, [])

  const reset = useCallback(() => {
    controllerRef.current?.abort()
    setData(null)
    setStatus('idle')
  }, [])

  return { status, data, error: status === 'error', submit, reset }
}
