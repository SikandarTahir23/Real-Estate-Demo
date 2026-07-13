'use client'

import { useTranslations } from 'next-intl'
import type { PropertyStatus } from '@/types'
import { cn } from '@/lib/utils'

// Ready / Off-Plan status pill (spec §2, §4).
// Color roles follow §1: emerald is "'Available' status only — the one non-token
// semantic color", used here for Ready homes; steel is the documented "off-plan tags"
// accent. Both pairings put dark-enough text on a light tint to clear AA (§1.1):
// emerald-DEFAULT text on a stone base, steel-dark text on a stone base.
const statusClasses: Record<PropertyStatus, string> = {
  Ready: 'bg-emerald/10 text-emerald ring-1 ring-inset ring-emerald/30',
  OffPlan: 'bg-steel/10 text-steel-dark ring-1 ring-inset ring-steel/40',
}

interface StatusTagProps {
  status: PropertyStatus
  className?: string
}

export function StatusTag({ status, className }: StatusTagProps) {
  const t = useTranslations('status')

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        statusClasses[status],
        className,
      )}
    >
      {t(status)}
    </span>
  )
}
