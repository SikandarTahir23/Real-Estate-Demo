'use client'

import { useMemo, useState } from 'react'
import { useFormatter, useTranslations } from 'next-intl'
import {
  dldTransferFeeEstimate,
  downPaymentAmount,
  loanAmount,
  monthlyPayment,
  totalInterest,
} from '@/lib/mortgage-math'
import { RangeField } from '@/components/calculator/RangeField'
import { OutputStat } from '@/components/calculator/OutputStat'
import { useDebouncedValue } from '@/components/calculator/useDebouncedValue'

interface MortgageCalculatorProps {
  // Auto-filled when arriving from a property detail page via ?price= (§6, §9).
  initialPrice: number
}

// Sensible UAE-oriented defaults; 20% is the common minimum down payment for a first
// residential purchase, 4.25% a plausible illustrative rate, 25-year tenure.
const DEFAULTS = { downPaymentPct: 20, annualRatePct: 4.25, tenureYears: 25 }

const PRICE = { min: 300_000, max: 30_000_000, step: 50_000 }
const DOWN = { min: 10, max: 80, step: 1 }
const RATE = { min: 0, max: 10, step: 0.05 }
const TENURE = { min: 5, max: 30, step: 1 }

// Mortgage calculator (§6). Pure client-side math via lib/mortgage-math — no API call.
// Inputs are debounced 100ms (§11) so dragging a slider doesn't thrash the output; the
// debounce `pending` flag shows a brief skeleton, never a spinner. Every figure carries
// an "Estimate" tag (§14 item 9). All money is font-data + AED via next-intl (§1, §6).
export function MortgageCalculator({ initialPrice }: MortgageCalculatorProps) {
  const t = useTranslations('calculator.mortgage')
  const format = useFormatter()

  const [price, setPrice] = useState(initialPrice)
  const [downPaymentPct, setDownPaymentPct] = useState(DEFAULTS.downPaymentPct)
  const [annualRatePct, setAnnualRatePct] = useState(DEFAULTS.annualRatePct)
  const [tenureYears, setTenureYears] = useState(DEFAULTS.tenureYears)

  // Debounce the whole input tuple together so one pending flag covers any change.
  const { debounced, pending } = useDebouncedValue(
    { price, downPaymentPct, annualRatePct, tenureYears },
    100,
  )

  const results = useMemo(() => {
    const { price: p, downPaymentPct: d, annualRatePct: r, tenureYears: y } = debounced
    return {
      monthly: monthlyPayment(p, d, r, y),
      downPayment: downPaymentAmount(p, d),
      loan: loanAmount(p, d),
      interest: totalInterest(p, d, r, y),
      dldFee: dldTransferFeeEstimate(p),
    }
  }, [debounced])

  const money = (value: number) =>
    format.number(value, {
      style: 'currency',
      currency: 'AED',
      maximumFractionDigits: 0,
    })

  return (
    <section aria-labelledby="mortgage-heading" className="space-y-6">
      <div className="space-y-1">
        <h2
          id="mortgage-heading"
          className="font-display text-xl font-semibold text-ink"
        >
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
            label={t('downPayment')}
            value={downPaymentPct}
            min={DOWN.min}
            max={DOWN.max}
            step={DOWN.step}
            onChange={setDownPaymentPct}
            formattedValue={t('percentValue', { value: downPaymentPct })}
          />
          <RangeField
            label={t('rate')}
            value={annualRatePct}
            min={RATE.min}
            max={RATE.max}
            step={RATE.step}
            onChange={setAnnualRatePct}
            formattedValue={t('percentValue', {
              value: format.number(annualRatePct, { maximumFractionDigits: 2 }),
            })}
          />
          <RangeField
            label={t('tenure')}
            value={tenureYears}
            min={TENURE.min}
            max={TENURE.max}
            step={TENURE.step}
            onChange={setTenureYears}
            formattedValue={t('yearsValue', { count: tenureYears })}
          />
        </div>

        {/* Outputs */}
        <div className="space-y-3" aria-live="polite">
          <OutputStat
            label={t('monthlyPayment')}
            value={money(results.monthly)}
            primary
            pending={pending}
          />
          <div className="grid grid-cols-2 gap-3">
            <OutputStat
              label={t('downPaymentAmount')}
              value={money(results.downPayment)}
              pending={pending}
            />
            <OutputStat
              label={t('loanAmount')}
              value={money(results.loan)}
              pending={pending}
            />
          </div>
          <OutputStat
            label={t('totalInterest')}
            value={money(results.interest)}
            pending={pending}
          />
          <OutputStat
            label={t('dldFee')}
            value={money(results.dldFee)}
            pending={pending}
          />
        </div>
      </div>
    </section>
  )
}
