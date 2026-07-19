'use client'

import { useId, useState } from 'react'
import { useTranslations } from 'next-intl'
import { buildWhatsAppLink } from '@/lib/whatsapp'

// Contact lead form + details (spec §7). Controlled inputs with NO <form> tag — the same
// pattern used across the site (§14 item 10): validation states and aria-invalid are
// handled by hand. A valid submit shows a client-side success state and invites the user
// to continue on WhatsApp for a faster reply. A "message an advisor on WhatsApp" path is
// offered alongside, going through the single buildWhatsAppLink helper (§12).

interface FieldErrors {
  name?: boolean
  email?: boolean
  message?: boolean
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function ContactView() {
  const t = useTranslations('contact')
  const tWhatsapp = useTranslations('whatsapp')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitted, setSubmitted] = useState(false)

  const baseId = useId()
  const fieldId = (n: string) => `${baseId}-${n}`
  const errId = (n: string) => `${baseId}-${n}-error`

  const validate = (): FieldErrors => {
    const next: FieldErrors = {}
    if (name.trim().length < 2) next.name = true
    if (!EMAIL_RE.test(email.trim())) next.email = true
    if (message.trim().length < 10) next.message = true
    return next
  }

  const handleSubmit = () => {
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length === 0) {
      setSubmitted(true)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <header className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {t('title')}
        </h1>
        <p className="mt-3 text-base text-ink-mid">{t('subtitle')}</p>
      </header>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Lead form / success state */}
        <div>
          {submitted ? (
            <div
              role="status"
              className="rounded-xl border border-emerald/30 bg-emerald/10 p-6"
            >
              <p className="font-display text-lg font-semibold text-emerald">
                {t('successTitle')}
              </p>
              <p className="mt-2 text-sm text-ink-mid">{t('successBody')}</p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Name */}
              <div className="space-y-1.5">
                <label
                  htmlFor={fieldId('name')}
                  className="block text-sm font-medium text-ink-mid"
                >
                  {t('name')}
                </label>
                <input
                  id={fieldId('name')}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-invalid={errors.name ?? false}
                  aria-describedby={errors.name ? errId('name') : undefined}
                  className="w-full rounded-md border border-stone-dark bg-white px-3 py-2.5 text-sm text-ink aria-[invalid=true]:border-brass-dark"
                />
                {errors.name && (
                  <p id={errId('name')} className="text-xs text-brass-dark">
                    {t('errors.name')}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor={fieldId('email')}
                  className="block text-sm font-medium text-ink-mid"
                >
                  {t('email')}
                </label>
                <input
                  id={fieldId('email')}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={errors.email ?? false}
                  aria-describedby={errors.email ? errId('email') : undefined}
                  className="w-full rounded-md border border-stone-dark bg-white px-3 py-2.5 text-sm text-ink aria-[invalid=true]:border-brass-dark"
                />
                {errors.email && (
                  <p id={errId('email')} className="text-xs text-brass-dark">
                    {t('errors.email')}
                  </p>
                )}
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label
                  htmlFor={fieldId('message')}
                  className="block text-sm font-medium text-ink-mid"
                >
                  {t('message')}
                </label>
                <textarea
                  id={fieldId('message')}
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  aria-invalid={errors.message ?? false}
                  aria-describedby={errors.message ? errId('message') : undefined}
                  className="w-full rounded-md border border-stone-dark bg-white px-3 py-2.5 text-sm text-ink aria-[invalid=true]:border-brass-dark"
                />
                {errors.message && (
                  <p id={errId('message')} className="text-xs text-brass-dark">
                    {t('errors.message')}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex h-12 items-center justify-center rounded-md bg-brass-dark px-6 text-base font-medium text-white transition-colors duration-150 hover:bg-brass-dark/90 motion-reduce:transition-none"
              >
                {t('submit')}
              </button>
            </div>
          )}
        </div>

        {/* Contact details + map */}
        <div className="space-y-6">
          {/* WhatsApp / phone / email row */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <a
              href={buildWhatsAppLink(tWhatsapp('general'))}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-white p-4 text-center ring-1 ring-stone-dark transition-colors duration-150 hover:bg-stone motion-reduce:transition-none"
            >
              <span className="block text-xs uppercase tracking-wider text-ink-light">
                {t('channels.whatsapp')}
              </span>
              <span className="mt-1 block text-sm font-medium text-ink">
                {t('channels.whatsappValue')}
              </span>
            </a>
            <a
              href={`tel:${t('channels.phoneHref')}`}
              className="rounded-lg bg-white p-4 text-center ring-1 ring-stone-dark transition-colors duration-150 hover:bg-stone motion-reduce:transition-none"
            >
              <span className="block text-xs uppercase tracking-wider text-ink-light">
                {t('channels.phone')}
              </span>
              <span className="mt-1 block font-data text-sm font-medium text-ink">
                {t('channels.phoneValue')}
              </span>
            </a>
            <a
              href={`mailto:${t('channels.emailValue')}`}
              className="rounded-lg bg-white p-4 text-center ring-1 ring-stone-dark transition-colors duration-150 hover:bg-stone motion-reduce:transition-none"
            >
              <span className="block text-xs uppercase tracking-wider text-ink-light">
                {t('channels.email')}
              </span>
              <span className="mt-1 block break-all text-sm font-medium text-ink">
                {t('channels.emailValue')}
              </span>
            </a>
          </div>

          {/* Keyless single-location Maps embed (§14 item 8). No API key required. */}
          <div className="overflow-hidden rounded-xl ring-1 ring-stone-dark">
            <iframe
              title={t('mapTitle')}
              src="https://www.google.com/maps?q=Downtown%20Dubai&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-72 w-full border-0"
            />
          </div>
          <p className="text-xs text-ink-light">{t('mapNote')}</p>
        </div>
      </div>
    </div>
  )
}
