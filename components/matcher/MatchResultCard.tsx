'use client'

import Link from 'next/link'
import { useFormatter, useTranslations } from 'next-intl'
import type { MatchResult } from '@/types'
import { StatusTag } from '@/components/ui/StatusTag'
// Note: numeric specs live on the detail page; here the price is the only figure shown.

interface MatchResultCardProps {
  result: MatchResult
  index: number
}

// A single matcher result (§2 MatchResultCard): the property plus the one-sentence
// "why this fits" produced by the pipeline (§5 step 5). Compact horizontal layout so
// three results sit comfortably inside the hero-embedded results panel. The stagger is
// capped by the parent (only 3 results here, well under the §11 six-card cap).
const STAGGER_STEP_MS = 40

export function MatchResultCard({ result, index }: MatchResultCardProps) {
  const tMatcher = useTranslations('matcher')
  const format = useFormatter()
  const { property } = result

  const price = format.number(property.priceAED, {
    style: 'currency',
    currency: 'AED',
    maximumFractionDigits: 0,
  })

  return (
    <article
      style={{ animationDelay: `${index * STAGGER_STEP_MS}ms` }}
      className="animate-fade-in motion-reduce:animate-none"
    >
      <Link
        href={`/listings/${property.slug}`}
        className="flex gap-4 rounded-xl bg-white p-3 ring-1 ring-stone-dark transition-transform duration-150 hover:scale-[1.01] motion-reduce:transition-none"
      >
        <div
          aria-hidden="true"
          className={`h-24 w-28 shrink-0 rounded-lg bg-gradient-to-br ${property.thumbColor}`}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <StatusTag status={property.status} />
            <span className="truncate font-data text-xs uppercase tracking-wider text-steel-dark">
              {property.area}
            </span>
          </div>
          <h4 className="truncate font-display text-base font-semibold text-ink">
            {property.title}
          </h4>
          {/* The generated explanation — the payoff of the matcher (§5). */}
          <p className="line-clamp-2 text-sm text-ink-mid">
            <span className="sr-only">{tMatcher('whyLabel')}: </span>
            {result.whyItFits}
          </p>
          <p className="mt-auto font-data text-sm font-medium text-ink">{price}</p>
        </div>
      </Link>
    </article>
  )
}
