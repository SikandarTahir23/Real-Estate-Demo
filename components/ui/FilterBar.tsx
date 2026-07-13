'use client'

import { useId } from 'react'
import { useTranslations } from 'next-intl'
import type {
  Property,
  PropertyPurpose,
  PropertyStatus,
  PropertyType,
} from '@/types'

// Client-side filtering model (spec §7, §14 item 2: client-side is appropriate at
// 8-listing demo scale — documented limitation, not an oversight). Every field uses
// 'all' as the unset sentinel so the controlled <select> values stay strings and the
// default view is fully unfiltered.
export interface PropertyFilters {
  type: PropertyType | 'all'
  area: string | 'all'
  priceBracket: PriceBracketId | 'all'
  minBeds: number // 0 = any
  status: PropertyStatus | 'all'
  purpose: PropertyPurpose | 'all'
}

export const defaultFilters: PropertyFilters = {
  type: 'all',
  area: 'all',
  priceBracket: 'all',
  minBeds: 0,
  status: 'all',
  purpose: 'all',
}

// Price brackets in AED. Bounds are inclusive-min / exclusive-max; `max: null` means
// open-ended. A bracket dropdown keeps §7's "Price range" a single control rather than
// a dual-thumb slider, which would be overkill at demo scale.
type PriceBracketId = 'lt1m' | '1to3m' | '3to6m' | '6to10m' | 'gte10m'

interface PriceBracket {
  id: PriceBracketId
  min: number
  max: number | null
}

export const priceBrackets: PriceBracket[] = [
  { id: 'lt1m', min: 0, max: 1_000_000 },
  { id: '1to3m', min: 1_000_000, max: 3_000_000 },
  { id: '3to6m', min: 3_000_000, max: 6_000_000 },
  { id: '6to10m', min: 6_000_000, max: 10_000_000 },
  { id: 'gte10m', min: 10_000_000, max: null },
]

const PROPERTY_TYPES: PropertyType[] = [
  'Apartment',
  'Villa',
  'Townhouse',
  'Penthouse',
]
const STATUSES: PropertyStatus[] = ['Ready', 'OffPlan']
const PURPOSES: PropertyPurpose[] = ['Buy', 'Rent']
const BEDS_OPTIONS = [1, 2, 3, 4] as const

// Pure, deterministic filter — kept out of the component so it can be unit-tested and
// reused (e.g. by the similar-properties rail later). Empty result is a valid state
// the view handles with an empty-state message.
export function filterProperties(
  items: Property[],
  filters: PropertyFilters,
): Property[] {
  const bracket =
    filters.priceBracket === 'all'
      ? null
      : priceBrackets.find((b) => b.id === filters.priceBracket) ?? null

  return items.filter((property) => {
    if (filters.type !== 'all' && property.type !== filters.type) return false
    if (filters.area !== 'all' && property.area !== filters.area) return false
    if (filters.status !== 'all' && property.status !== filters.status) return false
    if (filters.purpose !== 'all' && property.purpose !== filters.purpose) return false
    if (filters.minBeds > 0 && property.beds < filters.minBeds) return false
    if (bracket) {
      if (property.priceAED < bracket.min) return false
      if (bracket.max !== null && property.priceAED >= bracket.max) return false
    }
    return true
  })
}

// Distinct areas derived from the data, so the Location dropdown never drifts out of
// sync with the listings (§7 "Location" filter).
export function deriveAreas(items: Property[]): string[] {
  return Array.from(new Set(items.map((p) => p.area))).sort((a, b) =>
    a.localeCompare(b),
  )
}

interface FilterBarProps {
  filters: PropertyFilters
  onChange: (filters: PropertyFilters) => void
  onReset: () => void
  areas: string[]
  isFiltered: boolean
}

// Shared control chrome — token-colored focus ring is inherited from the global
// :focus-visible rule (§13); the border/bg keep selects legible on the stone page.
const selectClasses =
  'w-full rounded-md border border-stone-dark bg-white px-3 py-2 text-sm text-ink ' +
  'transition-colors duration-150 hover:border-steel-dark motion-reduce:transition-none'

export function FilterBar({
  filters,
  onChange,
  onReset,
  areas,
  isFiltered,
}: FilterBarProps) {
  const t = useTranslations('filters')
  const tType = useTranslations('propertyType')
  const tStatus = useTranslations('status')
  const tPurpose = useTranslations('purpose')
  const baseId = useId()

  const fieldId = (name: string) => `${baseId}-${name}`

  return (
    <section
      aria-label={t('title')}
      className="rounded-xl bg-white p-4 ring-1 ring-stone-dark sm:p-5"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Type */}
        <div className="space-y-1.5">
          <label
            htmlFor={fieldId('type')}
            className="block text-xs font-medium uppercase tracking-wider text-ink-mid"
          >
            {t('type')}
          </label>
          <select
            id={fieldId('type')}
            className={selectClasses}
            value={filters.type}
            onChange={(e) =>
              onChange({ ...filters, type: e.target.value as PropertyFilters['type'] })
            }
          >
            <option value="all">{t('anyType')}</option>
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>
                {tType(type)}
              </option>
            ))}
          </select>
        </div>

        {/* Location (area) */}
        <div className="space-y-1.5">
          <label
            htmlFor={fieldId('area')}
            className="block text-xs font-medium uppercase tracking-wider text-ink-mid"
          >
            {t('location')}
          </label>
          <select
            id={fieldId('area')}
            className={selectClasses}
            value={filters.area}
            onChange={(e) => onChange({ ...filters, area: e.target.value })}
          >
            <option value="all">{t('anyLocation')}</option>
            {areas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        {/* Price range */}
        <div className="space-y-1.5">
          <label
            htmlFor={fieldId('price')}
            className="block text-xs font-medium uppercase tracking-wider text-ink-mid"
          >
            {t('price')}
          </label>
          <select
            id={fieldId('price')}
            className={selectClasses}
            value={filters.priceBracket}
            onChange={(e) =>
              onChange({
                ...filters,
                priceBracket: e.target.value as PropertyFilters['priceBracket'],
              })
            }
          >
            <option value="all">{t('anyPrice')}</option>
            {priceBrackets.map((bracket) => (
              <option key={bracket.id} value={bracket.id}>
                {t(`priceBracket.${bracket.id}`)}
              </option>
            ))}
          </select>
        </div>

        {/* Beds (minimum) */}
        <div className="space-y-1.5">
          <label
            htmlFor={fieldId('beds')}
            className="block text-xs font-medium uppercase tracking-wider text-ink-mid"
          >
            {t('beds')}
          </label>
          <select
            id={fieldId('beds')}
            className={selectClasses}
            value={filters.minBeds}
            onChange={(e) =>
              onChange({ ...filters, minBeds: Number(e.target.value) })
            }
          >
            <option value={0}>{t('anyBeds')}</option>
            {BEDS_OPTIONS.map((beds) => (
              <option key={beds} value={beds}>
                {t('bedsMin', { count: beds })}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="space-y-1.5">
          <label
            htmlFor={fieldId('status')}
            className="block text-xs font-medium uppercase tracking-wider text-ink-mid"
          >
            {t('status')}
          </label>
          <select
            id={fieldId('status')}
            className={selectClasses}
            value={filters.status}
            onChange={(e) =>
              onChange({
                ...filters,
                status: e.target.value as PropertyFilters['status'],
              })
            }
          >
            <option value="all">{t('anyStatus')}</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {tStatus(status)}
              </option>
            ))}
          </select>
        </div>

        {/* Purpose */}
        <div className="space-y-1.5">
          <label
            htmlFor={fieldId('purpose')}
            className="block text-xs font-medium uppercase tracking-wider text-ink-mid"
          >
            {t('purpose')}
          </label>
          <select
            id={fieldId('purpose')}
            className={selectClasses}
            value={filters.purpose}
            onChange={(e) =>
              onChange({
                ...filters,
                purpose: e.target.value as PropertyFilters['purpose'],
              })
            }
          >
            <option value="all">{t('anyPurpose')}</option>
            {PURPOSES.map((purpose) => (
              <option key={purpose} value={purpose}>
                {tPurpose(purpose)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reset only appears when a filter is active — avoids an always-dead control. */}
      {isFiltered && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onReset}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-steel-dark transition-colors duration-150 hover:bg-steel-dark/10 motion-reduce:transition-none"
          >
            {t('reset')}
          </button>
        </div>
      )}
    </section>
  )
}
