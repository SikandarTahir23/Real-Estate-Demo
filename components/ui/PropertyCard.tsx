'use client'

import Link from 'next/link'
import { useFormatter, useTranslations } from 'next-intl'
import type { Property } from '@/types'
import { StatusTag } from '@/components/ui/StatusTag'
import { cn } from '@/lib/utils'

interface PropertyCardProps {
  property: Property
  // Position in the grid — drives the capped stagger (§11: first 6 cards only,
  // 40ms increments; everything after renders immediately).
  index?: number
}

const STAGGER_CAP = 6
const STAGGER_STEP_MS = 40

export function PropertyCard({ property, index = 0 }: PropertyCardProps) {
  const t = useTranslations('property')
  const format = useFormatter()

  const staggerDelay = index < STAGGER_CAP ? index * STAGGER_STEP_MS : 0

  // AED formatting via next-intl (Intl.NumberFormat under the hood) — the reason for
  // the i18n upgrade (§8): figures localize correctly and Arabic numerals render in
  // RTL. All numeric specs use font-data (IBM Plex Mono), the signature data face (§1).
  const priceLabel = format.number(property.priceAED, {
    style: 'currency',
    currency: 'AED',
    maximumFractionDigits: 0,
  })

  return (
    <article
      style={{ animationDelay: `${staggerDelay}ms` }}
      className="group animate-fade-up motion-reduce:animate-none"
    >
      <Link
        href={`/listings/${property.slug}`}
        className={cn(
          'flex h-full flex-col overflow-hidden rounded-xl bg-white ring-1 ring-stone-dark',
          'transition-transform duration-150 hover:scale-[1.01] motion-reduce:transition-none',
        )}
      >
        {/* Decorative gradient placeholder standing in for photography (§5 item 5,
            §9). Marked aria-hidden — it carries no information a screen reader needs;
            the title and specs below do. */}
        <div
          aria-hidden="true"
          className={cn(
            'relative aspect-[4/3] bg-gradient-to-br',
            property.thumbColor,
          )}
        >
          <div className="absolute left-3 top-3">
            <StatusTag status={property.status} />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="space-y-1">
            <p className="font-data text-xs uppercase tracking-wider text-steel-dark">
              {property.area}
            </p>
            <h3 className="font-display text-lg font-semibold leading-snug text-ink">
              {property.title}
            </h3>
          </div>

          {/* Specs row — all numeric, all font-data so they scan as data (§1, §11).
              Beds is rendered as "Studio" when 0. */}
          <dl className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-mid">
            <div className="flex items-center gap-1">
              <dt className="sr-only">{t('beds')}</dt>
              <dd className="font-data">
                {property.beds === 0 ? t('studio') : t('bedsValue', { count: property.beds })}
              </dd>
            </div>
            <div className="flex items-center gap-1">
              <dt className="sr-only">{t('baths')}</dt>
              <dd className="font-data">{t('bathsValue', { count: property.baths })}</dd>
            </div>
            <div className="flex items-center gap-1">
              <dt className="sr-only">{t('size')}</dt>
              <dd className="font-data">
                {t('sqftValue', { value: format.number(property.sizeSqft) })}
              </dd>
            </div>
          </dl>

          <div className="mt-auto flex items-end justify-between gap-3 pt-2">
            <div>
              <p className="font-data text-lg font-medium text-ink">{priceLabel}</p>
              {property.purpose === 'Rent' && (
                <p className="text-xs text-ink-light">{t('perYear')}</p>
              )}
            </div>
            <span className="text-sm font-medium text-brass-dark group-hover:underline">
              {t('viewDetails')}
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
