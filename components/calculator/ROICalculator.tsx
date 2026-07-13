'use client'

import { useMemo, useState } from 'react'
import { useFormatter, useTranslations } from 'next-intl'
import { grossRentalYield } from '@/lib/mortgage-math'
import { RangeField } from '@/components/calculator/RangeField'
import { OutputStat } from '@/components/calculator/OutputStat'
import { useDebouncedValue } from '@/components/calculator/useDebouncedValue'

interface ROICalculatorProps {
  // Shares the price arriving from a property detail page via ?price= (§6, §9).
  initialPrice: number
}

// Default annual rent seeded as a plausible ~6% of a mid-market price; the user adjusts.
const DEFAULT_ANNUAL_RENT = 120_000

const PRICE = { min: 300_000, max: 30_000_000, step: 50_000 }
const RENT = { min: 20_000, max: 2_000_000, step: 5_000 }

// ROI calculator (§6): price + annual rent → gross rental yield %. Pure client-side math,
// debounced 100ms with a skeleton on pending (§11). Yield and money render in font-data
// (§1); the yield carries an "Estimate" tag (§14 item 9).
export function ROICalculator({ initialPrice }: ROICalculatorProps) {
  const t = useTranslations('calculator.roi')
  const format = useFormatter()

  const [price, setPrice] = useState(initialPrice)
  const [annualRent, setAnnualRent] = useState(DEFAULT_ANNUAL_RENT)

  const { debounced, pending } = useDebouncedValue({ price, annualRent }, 100)

  const results = useMemo(() => {
    const { price: p, annualRent: rent } = debounced
    return {
      yield: grossRentalYield(rent, p),
      monthlyRent: rent / 12,
    }
  }, [debounced])

  const money = (value: number) =>
    format.number(value, {
      style: 'currency',
      currency: 'AED',
      maximumFractionDigits: 0,
    })

  return (
    <section aria-labelledby="roi-heading" className="space-y-6">
      <div className="space-y-1">
        <h2 id="roi-heading" className="font-display text-xl font-semibold text-ink">
          {t('title')}
        </h2>
        <p className="text-sm text-ink-mid">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-5">
          <RangeField
            label={t('price')}
            value={price}
            min={PRICE.min}
            max={PRICE.max}
            step={PRICE.step}
            onChange={setPrice}
            formattedValue={money(price)}
          />
          <RangeField
            label={t('annualRent')}
            value={annualRent}
            min={RENT.min}
            max={RENT.max}
            step={RENT.step}
            onChange={setAnnualRent}
            formattedValue={money(annualRent)}
          />
        </div>

        {/* Outputs */}
        <div className="space-y-3" aria-live="polite">
          <OutputStat
            label={t('grossYield')}
            value={t('percentValue', {
              value: format.number(results.yield, { maximumFractionDigits: 1 }),
            })}
            primary
            pending={pending}
          />
          <OutputStat
            label={t('monthlyRent')}
            value={money(results.monthlyRent)}
            pending={pending}
          />
        </div>
      </div>
    </section>
  )
}
