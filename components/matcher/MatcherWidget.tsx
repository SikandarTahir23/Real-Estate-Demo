'use client'

import { useId, useState } from 'react'
import { useTranslations } from 'next-intl'
import type { MatchCriteria } from '@/types'
import { useMatcher } from '@/components/matcher/useMatcher'
import { MatchResultCard } from '@/components/matcher/MatchResultCard'

// The matcher input + results panel (spec §2, §5, §7). This is the thesis of the site,
// so it leads the hero. Controlled input, no <form> tag (§14 item 10). While the request
// is in flight it shows skeleton cards, never a spinner (§11); results fade in with the
// 200ms fade-in animation (§11 crossfade budget).

const SKELETON_COUNT = 3

// A couple of example queries seed the two demonstrable cases from §5 (a villa/buy query
// and a rental/studio query) so a reviewer can trigger real tool-use extraction in one tap.
const EXAMPLE_KEYS = ['villa', 'studio'] as const

export function MatcherWidget() {
  const t = useTranslations('matcher')
  const { status, data, error, submit } = useMatcher()
  const [query, setQuery] = useState('')
  const inputId = useId()
  const resultsId = useId()

  const isLoading = status === 'loading'

  const handleSubmit = () => submit(query)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }
  const handleExample = (text: string) => {
    setQuery(text)
    submit(text)
  }

  return (
    <div className="rounded-2xl bg-white/95 p-4 shadow-xl ring-1 ring-white/20 backdrop-blur sm:p-5">
      <label
        htmlFor={inputId}
        className="block font-display text-sm font-semibold text-ink"
      >
        {t('label')}
      </label>
      <p className="mt-0.5 text-xs text-ink-light">{t('hint')}</p>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          id={inputId}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('placeholder')}
          aria-controls={resultsId}
          className="min-w-0 flex-1 rounded-md border border-stone-dark bg-white px-3 py-2.5 text-sm text-ink placeholder:text-ink-light"
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || query.trim().length === 0}
          className="inline-flex items-center justify-center rounded-md bg-brass-dark px-5 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-brass-dark/90 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none"
        >
          {isLoading ? t('searching') : t('search')}
        </button>
      </div>

      {/* Example query chips (§5: two distinct demonstrable cases) */}
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="text-xs text-ink-light">{t('tryLabel')}</span>
        {EXAMPLE_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => handleExample(t(`examples.${key}`))}
            className="rounded-full bg-stone px-3 py-1 text-xs text-ink-mid ring-1 ring-stone-dark transition-colors duration-150 hover:bg-stone-dark motion-reduce:transition-none"
          >
            {t(`examples.${key}`)}
          </button>
        ))}
      </div>

      {/* Results region. aria-live so the outcome is announced; aria-busy during load. */}
      <div
        id={resultsId}
        aria-live="polite"
        aria-busy={isLoading}
        className="mt-4"
      >
        {isLoading && <MatcherSkeleton />}

        {!isLoading && error && (
          <p className="rounded-md bg-stone px-3 py-2 text-sm text-ink-mid">
            {t('error')}
          </p>
        )}

        {!isLoading && status === 'success' && data && (
          <div className="space-y-3">
            {data.fallback && (
              // Subtle best-guess note on the resilience path (§5) — informative, not an error.
              <p className="rounded-md bg-steel/10 px-3 py-2 text-xs text-steel-dark">
                {t('fallbackNote')}
              </p>
            )}

            <CriteriaSummary criteria={data.criteria} />

            {data.results.length > 0 ? (
              <ul className="space-y-3">
                {data.results.map((result, index) => (
                  <li key={result.property.id}>
                    <MatchResultCard result={result} index={index} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-md bg-stone px-3 py-2 text-sm text-ink-mid">
                {t('noResults')}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Static skeleton cards (§11: skeletons, never spinners). Pure CSS pulse — no JS,
// respects reduced motion via the global rule.
function MatcherSkeleton() {
  return (
    <ul className="space-y-3" aria-hidden="true">
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <li
          key={i}
          className="flex gap-4 rounded-xl bg-white p-3 ring-1 ring-stone-dark"
        >
          <div className="h-24 w-28 shrink-0 animate-pulse rounded-lg bg-stone-dark motion-reduce:animate-none" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-3 w-24 animate-pulse rounded bg-stone-dark motion-reduce:animate-none" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-stone-dark motion-reduce:animate-none" />
            <div className="h-3 w-full animate-pulse rounded bg-stone-dark motion-reduce:animate-none" />
          </div>
        </li>
      ))}
    </ul>
  )
}

// Compact echo of the extracted criteria so the structured-extraction pattern is
// visible to the user — the whole point of this AI approach vs. open chat (§14 item 3).
function CriteriaSummary({ criteria }: { criteria: MatchCriteria }) {
  const t = useTranslations('matcher')
  const tType = useTranslations('propertyType')
  const tPurpose = useTranslations('purpose')

  const chips: string[] = []
  if (criteria.propertyType) chips.push(tType(criteria.propertyType))
  if (criteria.purpose) chips.push(tPurpose(criteria.purpose))
  if (criteria.minBeds) chips.push(t('chipBeds', { count: criteria.minBeds }))
  if (criteria.area) chips.push(criteria.area)
  // Budget chip in millions — only when it reads cleanly (≥ 1M); sub-million budgets
  // (e.g. rentals) skip the chip rather than render a misleading "Under 0M".
  if (criteria.maxBudgetAED && criteria.maxBudgetAED >= 1_000_000) {
    chips.push(
      t('chipUnder', { value: (criteria.maxBudgetAED / 1_000_000).toFixed(1) }),
    )
  }
  criteria.mustHaves?.forEach((m) => chips.push(m))

  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-xs text-ink-light">{t('understood')}</span>
      {chips.map((chip) => (
        <span
          key={chip}
          className="rounded-full bg-brass-dark/10 px-2.5 py-0.5 font-data text-xs text-brass-dark"
        >
          {chip}
        </span>
      ))}
    </div>
  )
}
