'use client'

import { useTranslations } from 'next-intl'

// Trust band (spec §2): a 3-column ink strip of trust stats. The copy avoids naming a
// specific regulator or registration number the company cannot substantiate, staying
// descriptive ("Locally licensed & regulated"). The copy lives in i18n.
//
// Stat figures are rendered in font-data (§1) since they are numeric/data.
const STAT_KEYS = ['transactions', 'represented', 'regulated'] as const

export function TrustBand() {
  const t = useTranslations('home.trust')

  return (
    <section aria-label={t('label')} className="bg-ink text-stone">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <dl className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
          {STAT_KEYS.map((key) => (
            <div key={key} className="space-y-1">
              <dt className="font-data text-3xl font-medium text-brass-light">
                {t(`stats.${key}.value`)}
              </dt>
              <dd className="text-sm text-stone/70">{t(`stats.${key}.label`)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
