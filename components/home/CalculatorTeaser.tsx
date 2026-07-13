'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'

// "Try the Mortgage Calculator" teaser card (spec §7). Links to the standalone
// calculator (no pre-filled price — that variant comes from a property detail page).
export function CalculatorTeaser() {
  const t = useTranslations('home.calculatorTeaser')

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-stone-dark/60 p-8 ring-1 ring-stone-dark sm:flex-row sm:items-center">
        <div className="max-w-xl">
          <h2 className="font-display text-xl font-semibold text-ink sm:text-2xl">
            {t('title')}
          </h2>
          <p className="mt-2 text-base text-ink-mid">{t('body')}</p>
        </div>
        <Button href="/calculator" size="lg">
          {t('cta')}
        </Button>
      </div>
    </section>
  )
}
