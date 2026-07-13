'use client'

import { useTranslations } from 'next-intl'
import type { Agent } from '@/types'
import { AgentCard } from '@/components/detail/AgentCard'

interface AboutViewProps {
  agents: Agent[]
}

// About page view (spec §7): story, the three agent profiles, and the mandatory
// disclosure block (§10). Reuses AgentCard from the detail page (composition over
// duplication) — each renders with the general advisor WhatsApp message by default.
export function AboutView({ agents }: AboutViewProps) {
  const t = useTranslations('about')

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      {/* Story */}
      <header className="max-w-2xl">
        <p className="font-data text-sm uppercase tracking-widest text-brass-dark">
          {t('eyebrow')}
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {t('title')}
        </h1>
        <div className="mt-5 space-y-4 text-base leading-relaxed text-ink-mid">
          <p>{t('body1')}</p>
          <p>{t('body2')}</p>
        </div>
      </header>

      {/* Agents */}
      <section aria-labelledby="agents-heading" className="mt-14">
        <h2
          id="agents-heading"
          className="font-display text-2xl font-bold tracking-tight text-ink"
        >
          {t('agentsTitle')}
        </h2>
        <p className="mt-2 max-w-xl text-base text-ink-mid">{t('agentsSubtitle')}</p>
        <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <li key={agent.id}>
              <AgentCard agent={agent} />
            </li>
          ))}
        </ul>
      </section>

      {/* Mandatory disclosure block (§10). Rendered in ink-mid on the light page — well
          above the AA floor — and given prominence rather than buried, per §10's intent
          that the concept nature be stated plainly and first. */}
      <section
        aria-labelledby="disclosure-heading"
        className="mt-14 rounded-xl border border-stone-dark bg-white p-6"
      >
        <h2
          id="disclosure-heading"
          className="font-display text-lg font-semibold text-ink"
        >
          {t('disclosureTitle')}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-mid">
          {t('disclosureBody')}
        </p>
      </section>
    </div>
  )
}
