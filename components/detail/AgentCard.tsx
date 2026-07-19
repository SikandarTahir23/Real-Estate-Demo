'use client'

import { useTranslations } from 'next-intl'
import type { Agent } from '@/types'
import { useLocale } from '@/components/providers/LocaleProvider'
import { buildWhatsAppLink } from '@/lib/whatsapp'

interface AgentCardProps {
  agent: Agent
  // Message seeded into the WhatsApp deep link. Defaults to a general advisor message;
  // the detail page passes a property-specific one.
  whatsappMessage?: string
}

// Agent card (§9): a monogram avatar (initials on a brand color block), name, years of
// experience, languages, and a direct WhatsApp button. Reusable — the About page (§7,
// Phase 6) renders three of these.
//
// The WhatsApp link is built via the single helper against NEXT_PUBLIC_WHATSAPP_NUMBER
// (§12); the agent's own `whatsapp` field is domain data, never turned into a raw link.
export function AgentCard({ agent, whatsappMessage }: AgentCardProps) {
  const t = useTranslations('detail.agent')
  const tWhatsapp = useTranslations('whatsapp')
  const { locale } = useLocale()
  const message = whatsappMessage ?? tWhatsapp('general')

  // Locale-aware list formatting for languages (Intl.ListFormat) — commas differ
  // between English and Arabic (§8).
  const languageList = new Intl.ListFormat(locale, {
    style: 'long',
    type: 'conjunction',
  }).format(agent.languages)

  return (
    <div className="rounded-xl bg-white p-5 ring-1 ring-stone-dark">
      <div className="flex items-center gap-4">
        <div
          aria-hidden="true"
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-ink to-steel-dark font-display text-lg font-semibold text-stone"
        >
          {agent.initials}
        </div>
        <div className="min-w-0">
          <p className="font-display text-base font-semibold text-ink">
            {agent.name}
          </p>
          <p className="text-sm text-ink-mid">{agent.speciality}</p>
        </div>
      </div>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-ink-light">{t('experience')}</dt>
          <dd className="font-data text-ink">
            {t('yearsValue', { count: agent.yearsExperience })}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-ink-light">{t('languages')}</dt>
          <dd className="text-right text-ink">{languageList}</dd>
        </div>
      </dl>

      <a
        href={buildWhatsAppLink(message)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-brass-dark px-4 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-brass-dark/90 motion-reduce:transition-none"
      >
        {t('whatsapp')}
      </a>
    </div>
  )
}
