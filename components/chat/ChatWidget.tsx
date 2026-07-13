'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useChat } from '@/components/chat/useChat'

// Floating AI chatbot (spec §5 ethos, §11 motion budget, §13 a11y). A launcher FAB
// toggles a chat panel. It sits ABOVE the WhatsApp FAB (bottom-5) at bottom-24 using the
// logical `end` inset so it mirrors correctly in RTL Arabic (§8). Powered by Grok through
// /api/chat, which degrades gracefully if the model is unavailable.
//
// Motion respects the §11 budget: the panel uses the 200ms fade-in, hover is 150ms, and
// everything is disabled under motion-reduce. Loading shows a typing indicator (dots),
// consistent with "skeletons, never spinners".

export function ChatWidget() {
  const t = useTranslations('chat')
  const { messages, isSending, error, send } = useChat()
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')

  const panelId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const logRef = useRef<HTMLDivElement>(null)

  // Focus the input when the panel opens (§13 keyboard/focus management).
  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  // Keep the newest message in view as the thread grows or the model replies.
  useEffect(() => {
    if (open && logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [open, messages, isSending])

  // Escape closes the panel — expected dialog behaviour.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const handleSend = () => {
    const text = draft.trim()
    if (!text) return
    send(text)
    setDraft('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Launcher — above the WhatsApp FAB (bottom-5), so bottom-24. */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t('close') : t('launcher')}
        aria-expanded={open}
        aria-controls={panelId}
        className="fixed bottom-24 end-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-brass-dark text-white shadow-lg ring-1 ring-white/20 transition-transform duration-150 hover:scale-105 motion-reduce:transition-none"
      >
        {open ? <CloseIcon /> : <ChatIcon />}
      </button>

      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label={t('title')}
          className="fixed bottom-40 end-5 z-50 flex h-[28rem] w-[calc(100vw-2.5rem)] max-w-sm animate-fade-in flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-ink/10 motion-reduce:animate-none"
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-ink px-4 py-3">
            <div>
              <p className="font-display text-sm font-semibold text-stone">
                {t('title')}
              </p>
              <p className="text-xs text-stone-dark">{t('subtitle')}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t('close')}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-stone-dark transition-colors duration-150 hover:bg-white/10 hover:text-stone motion-reduce:transition-none"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Message log */}
          <div
            ref={logRef}
            aria-live="polite"
            aria-busy={isSending}
            className="flex-1 space-y-3 overflow-y-auto bg-stone/40 px-4 py-4"
          >
            {messages.length === 0 && (
              <p className="rounded-lg bg-white px-3 py-2 text-sm text-ink-mid ring-1 ring-stone-dark">
                {t('greeting')}
              </p>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={
                  m.role === 'user' ? 'flex justify-end' : 'flex justify-start'
                }
              >
                <p
                  className={
                    m.role === 'user'
                      ? 'max-w-[85%] rounded-2xl rounded-ee-sm bg-brass-dark px-3 py-2 text-sm text-white'
                      : 'max-w-[85%] rounded-2xl rounded-es-sm bg-white px-3 py-2 text-sm text-ink ring-1 ring-stone-dark'
                  }
                >
                  {m.content}
                </p>
              </div>
            ))}

            {isSending && <TypingIndicator label={t('typing')} />}

            {error && (
              <p className="rounded-lg bg-white px-3 py-2 text-sm text-ink-mid ring-1 ring-stone-dark">
                {t('error')}
              </p>
            )}
          </div>

          {/* Composer */}
          <div className="flex items-center gap-2 border-t border-stone-dark bg-white px-3 py-3">
            <label htmlFor={`${panelId}-input`} className="sr-only">
              {t('inputLabel')}
            </label>
            <input
              id={`${panelId}-input`}
              ref={inputRef}
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('placeholder')}
              className="min-w-0 flex-1 rounded-md border border-stone-dark bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-light"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={isSending || draft.trim().length === 0}
              className="inline-flex shrink-0 items-center justify-center rounded-md bg-brass-dark px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-brass-dark/90 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none"
            >
              {t('send')}
            </button>
          </div>
        </div>
      )}
    </>
  )
}

// Animated three-dot typing indicator. Pure CSS; halts under motion-reduce.
function TypingIndicator({ label }: { label: string }) {
  return (
    <div className="flex justify-start">
      <span
        role="status"
        aria-label={label}
        className="inline-flex items-center gap-1 rounded-2xl rounded-es-sm bg-white px-3 py-2.5 ring-1 ring-stone-dark"
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{ animationDelay: `${i * 150}ms` }}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-light motion-reduce:animate-none"
          />
        ))}
      </span>
    </div>
  )
}

function ChatIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}
