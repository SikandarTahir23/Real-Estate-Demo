'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import type { Property } from '@/types'
import { PropertyCard } from '@/components/ui/PropertyCard'
import {
  FilterBar,
  defaultFilters,
  deriveAreas,
  filterProperties,
  type PropertyFilters,
} from '@/components/ui/FilterBar'

interface ListingsViewProps {
  properties: Property[]
}

// Client island for /listings: owns filter state, derives the filtered set, and
// renders the grid. Filtering is pure and synchronous (§14 item 2) so results update
// in the same frame as a filter change — no skeleton needed here (skeletons are for
// the in-flight matcher/calculator work, §11).
export function ListingsView({ properties }: ListingsViewProps) {
  const t = useTranslations('listings')
  const [filters, setFilters] = useState<PropertyFilters>(defaultFilters)

  const areas = useMemo(() => deriveAreas(properties), [properties])
  const results = useMemo(
    () => filterProperties(properties, filters),
    [properties, filters],
  )

  const isFiltered = useMemo(
    () => JSON.stringify(filters) !== JSON.stringify(defaultFilters),
    [filters],
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <header className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {t('title')}
        </h1>
        <p className="mt-3 text-base text-ink-mid">{t('subtitle')}</p>
      </header>

      <div className="mt-8">
        <FilterBar
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(defaultFilters)}
          areas={areas}
          isFiltered={isFiltered}
        />
      </div>

      {/* Result count uses ICU pluralization via next-intl — the concrete payoff of
          the i18n upgrade (§14 item 4), and aria-live so the count change is announced
          to screen readers when filtering (§13). */}
      <p
        aria-live="polite"
        className="mt-6 font-data text-sm text-ink-mid"
      >
        {t('resultCount', { count: results.length })}
      </p>

      {results.length > 0 ? (
        <ul className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((property, index) => (
            <li key={property.id}>
              <PropertyCard property={property} index={index} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-stone-dark bg-white/50 p-10 text-center">
          <p className="font-display text-lg font-semibold text-ink">
            {t('emptyTitle')}
          </p>
          <p className="mt-2 text-sm text-ink-mid">{t('emptyBody')}</p>
          <button
            type="button"
            onClick={() => setFilters(defaultFilters)}
            className="mt-4 rounded-md px-3 py-1.5 text-sm font-medium text-brass-dark transition-colors duration-150 hover:bg-brass-dark/10 motion-reduce:transition-none"
          >
            {t('clearFilters')}
          </button>
        </div>
      )}
    </div>
  )
}
