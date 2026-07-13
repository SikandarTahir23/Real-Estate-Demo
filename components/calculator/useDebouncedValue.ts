'use client'

import { useEffect, useState } from 'react'

// Debounce hook for the calculators (spec §6, §11). The math is instant, but rapid
// slider drags are debounced 100ms so the output doesn't thrash — and the `pending`
// flag drives a brief skeleton on the output, never a spinner (§11). `pending` is true
// between an input change and the debounced value catching up.
export function useDebouncedValue<T>(value: T, delayMs = 100): {
  debounced: T
  pending: boolean
} {
  const [debounced, setDebounced] = useState<T>(value)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    if (value === debounced) return
    setPending(true)
    const id = setTimeout(() => {
      setDebounced(value)
      setPending(false)
    }, delayMs)
    return () => clearTimeout(id)
  }, [value, debounced, delayMs])

  return { debounced, pending }
}
