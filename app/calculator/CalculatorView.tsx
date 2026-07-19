'use client'

import { useTranslations } from 'next-intl'
import { MortgageCalculator } from '@/components/calculator/MortgageCalculator'
import { ROICalculator } from '@/components/calculator/ROICalculator'

interface CalculatorViewProps {
  initialPrice: number
  // True when the price was pre-filled from a property detail page (§6, §9) — shows a
  // small note so the pre-fill isn't mistaken for an arbitrary default.
  prefilled: boolean
}

// Client island for /calculator: holds the two interactive tools and the i18n-reactive
// copy. The server page owns metadata and query-param parsing (§14 item 13).
export function CalculatorView({ initialPrice, prefilled }: CalculatorViewProps) {
  const t = useTranslations('calculator')

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <header className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {t('title')}
        </h1>
        <p className="mt-3 text-base text-ink-mid">{t('intro')}</p>
        {prefilled && (
          <p className="mt-3 rounded-md bg-steel/10 px-3 py-2 text-sm text-steel-dark">
            {t('prefilledNote')}
          </p>
        )}
      </header>

      <div className="mt-8 space-y-8">
        <div className="rounded-xl bg-white p-5 ring-1 ring-stone-dark sm:p-6">
          <MortgageCalculator initialPrice={initialPrice} />
        </div>
        <div className="rounded-xl bg-white p-5 ring-1 ring-stone-dark sm:p-6">
          <ROICalculator initialPrice={initialPrice} />
        </div>
      </div>

      {/* Standing estimate disclaimer — reinforces the per-figure "Estimate" tags
          (§6, §14 item 9). Estimates for guidance, never presented as live bank rates. */}
      <p className="mt-8 text-xs leading-relaxed text-ink-light">
        {t('disclaimer')}
      </p>
    </div>
  )
}
