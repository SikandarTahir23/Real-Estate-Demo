'use client'

import { useId, useState } from 'react'
import { useTranslations } from 'next-intl'
import { buildWhatsAppLink } from '@/lib/whatsapp'

interface ViewingRequestProps {
  propertyTitle: string
}

// Primary CTA: "Request a Viewing" → WhatsApp deep link pre-filled with the property
// title and an optional preferred date (§9). Deliberately NOT a booking calendar —
// that capability is reserved for the next portfolio project (§14 item 14); a simple
// preferred-date text field feeding the message is enough here.
//
// Controlled input, no <form> tag — the same pattern used across the portfolio
// (§14 item 10). The date is optional; the link works with or without it.
export function ViewingRequest({ propertyTitle }: ViewingRequestProps) {
  const t = useTranslations('detail.viewing')
  const [preferredDate, setPreferredDate] = useState('')
  const fieldId = useId()

  // Per-context message (§12). When no date is given we send the shorter variant so we
  // never ship a dangling "My preferred date is ." sentence.
  const message = preferredDate
    ? t('messageWithDate', { title: propertyTitle, date: preferredDate })
    : t('messageNoDate', { title: propertyTitle })

  return (
    <div className="rounded-xl bg-ink p-5 text-stone ring-1 ring-white/10">
      <h2 className="font-display text-lg font-semibold">{t('title')}</h2>
      <p className="mt-1 text-sm text-stone/70">{t('subtitle')}</p>

      <div className="mt-4 space-y-1.5">
        <label htmlFor={fieldId} className="block text-sm text-stone/90">
          {t('dateLabel')}
        </label>
        <input
          id={fieldId}
          type="date"
          value={preferredDate}
          onChange={(e) => setPreferredDate(e.target.value)}
          className="w-full rounded-md border border-white/15 bg-white/5 px-3 py-2 font-data text-sm text-stone placeholder:text-stone/40 [color-scheme:dark]"
        />
      </div>

      <a
        href={buildWhatsAppLink(message)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-brass-dark px-4 py-3 text-base font-medium text-white transition-colors duration-150 hover:bg-brass-dark/90 motion-reduce:transition-none"
      >
        {t('cta')}
      </a>
    </div>
  )
}
