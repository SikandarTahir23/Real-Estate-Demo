'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type { Property } from '@/types'
import { PropertyCard } from '@/components/ui/PropertyCard'

interface FeaturedSectionProps {
  properties: Property[]
}

// Featured Listings section (spec §7): the properties flagged featured: true. Reuses
// PropertyCard so the card treatment stays identical to /listings (composition over
// duplication). The server home page resolves the featured set and passes it in.
export function FeaturedSection({ properties }: FeaturedSectionProps) {
  const t = useTranslations('home.featured')

  return (
    <section
      aria-labelledby="featured-heading"
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl">
          <h2
            id="featured-heading"
            className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl"
          >
            {t('title')}
          </h2>
          <p className="mt-2 text-base text-ink-mid">{t('subtitle')}</p>
        </div>
        <Link
          href="/listings"
          className="text-sm font-medium text-brass-dark transition-colors duration-150 hover:text-ink motion-reduce:transition-none"
        >
          {t('viewAll')} →
        </Link>
      </div>

      <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property, index) => (
          <li key={property.id}>
            <PropertyCard property={property} index={index} />
          </li>
        ))}
      </ul>
    </section>
  )
}
