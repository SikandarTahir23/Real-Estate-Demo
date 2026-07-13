'use client'

import { useFormatter, useTranslations } from 'next-intl'
import type { Property } from '@/types'

interface SpecBlockProps {
  property: Property
}

// Full spec block (§9): price, price/sqft (computed), size, beds, baths, floor, status,
// and handover quarter when off-plan. Every value is numeric and rendered in font-data
// (IBM Plex Mono) — the signature data face used exclusively for numbers (§1). AED and
// number formatting go through next-intl so they localize and stay LTR-embedded in RTL
// (§8). Presented as a <dl> so each label/value pair is programmatically associated (§13).
export function SpecBlock({ property }: SpecBlockProps) {
  const t = useTranslations('detail.spec')
  const tStatus = useTranslations('status')
  const format = useFormatter()

  const pricePerSqft = property.priceAED / property.sizeSqft

  const money = (value: number) =>
    format.number(value, {
      style: 'currency',
      currency: 'AED',
      maximumFractionDigits: 0,
    })

  // Each row: [label, value]. font-data lives on the <dd> so only numeric values use
  // the mono face; labels stay in the body face.
  const rows: Array<{ key: string; label: string; value: string }> = [
    { key: 'price', label: t('price'), value: money(property.priceAED) },
    {
      key: 'pricePerSqft',
      label: t('pricePerSqft'),
      value: t('perSqftValue', { value: money(pricePerSqft) }),
    },
    {
      key: 'size',
      label: t('size'),
      value: t('sqftValue', { value: format.number(property.sizeSqft) }),
    },
    {
      key: 'beds',
      label: t('beds'),
      value:
        property.beds === 0
          ? t('studio')
          : format.number(property.beds),
    },
    { key: 'baths', label: t('baths'), value: format.number(property.baths) },
    { key: 'status', label: t('status'), value: tStatus(property.status) },
  ]

  if (property.floor !== undefined) {
    rows.push({
      key: 'floor',
      label: t('floor'),
      value: format.number(property.floor),
    })
  }

  if (property.status === 'OffPlan' && property.handoverQuarter) {
    rows.push({
      key: 'handover',
      label: t('handover'),
      value: property.handoverQuarter,
    })
  }

  if (property.grossYieldEstimate !== undefined) {
    rows.push({
      key: 'yield',
      label: t('grossYield'),
      // Investor-facing estimate — labelled "est." in copy, never implied as guaranteed.
      value: t('yieldValue', {
        value: format.number(property.grossYieldEstimate, {
          maximumFractionDigits: 1,
        }),
      }),
    })
  }

  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
      {rows.map((row) => (
        <div key={row.key} className="space-y-0.5">
          <dt className="text-xs uppercase tracking-wider text-ink-light">
            {row.label}
          </dt>
          <dd className="font-data text-base text-ink">{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}
