'use client'

import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

interface OutputStatProps {
  label: string
  // Pre-formatted numeric value (AED / % / count) — rendered in font-data (§1).
  value: string
  // Emphasise the headline figure (monthly payment, yield).
  primary?: boolean
  // While debouncing, show a skeleton instead of the value (§11: skeleton, not spinner).
  pending?: boolean
}

// A single calculator output row. The "Estimate" tag is the enforcement of §14 item 9
// ("every output labelled 'Estimate' … not just once") — it rides on EVERY figure rather
// than sitting once at the bottom, so no output can be mistaken for a live bank rate.
export function OutputStat({
  label,
  value,
  primary = false,
  pending = false,
}: OutputStatProps) {
  const t = useTranslations('calculator')

  return (
    <div
      className={cn(
        'rounded-lg p-4',
        primary ? 'bg-ink text-stone' : 'bg-stone ring-1 ring-stone-dark',
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p
          className={cn(
            'text-xs uppercase tracking-wider',
            primary ? 'text-stone/70' : 'text-ink-light',
          )}
        >
          {label}
        </p>
        <span
          className={cn(
            'rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide',
            primary ? 'bg-white/15 text-stone' : 'bg-brass-dark/10 text-brass-dark',
          )}
        >
          {t('estimateTag')}
        </span>
      </div>

      {pending ? (
        <div
          aria-hidden="true"
          className={cn(
            'mt-2 h-7 w-32 animate-pulse rounded motion-reduce:animate-none',
            primary ? 'bg-white/20' : 'bg-stone-dark',
          )}
        />
      ) : (
        <p
          className={cn(
            'mt-1 font-data font-medium',
            primary ? 'text-2xl' : 'text-lg text-ink',
          )}
        >
          {value}
        </p>
      )}
    </div>
  )
}
