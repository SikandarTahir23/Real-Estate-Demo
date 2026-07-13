'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

interface PropertyGalleryProps {
  title: string
  // The property's decorative gradient (thumbColor) — reused as the base for each
  // illustrative view so the gallery stays on-brand and needs no external assets.
  thumbColor: string
}

// Illustrative gallery placeholders (§9): 4–6 views standing in for photography.
// SVG/illustration imagery over real photography is the documented §14 item 5 trade-off
// (zero licensing risk, no ambiguity about depicting a real building). Each view is a
// distinct gradient framing + a labelled room caption, clearly styled as illustrative.
// Rendered as CSS gradients rather than files in public/images so there is no layout
// shift and no need to enable dangerouslyAllowSVG in next.config (assumption noted in
// the phase summary).
const VIEW_KEYS = [
  'exterior',
  'living',
  'kitchen',
  'bedroom',
  'view',
  'amenities',
] as const

export function PropertyGallery({ title, thumbColor }: PropertyGalleryProps) {
  const t = useTranslations('detail.gallery')
  const [active, setActive] = useState(0)

  return (
    <section aria-label={t('label')} className="space-y-3">
      {/* Main stage. aria-hidden pattern removed here because the view is the primary
          visual content — it carries an accessible name via aria-label naming the room
          and stating it is an illustration. */}
      <div
        role="img"
        aria-label={t('viewAlt', { title, room: t(`views.${VIEW_KEYS[active]}`) })}
        className={cn(
          'relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-gradient-to-br ring-1 ring-stone-dark',
          thumbColor,
        )}
      >
        <span className="absolute bottom-3 left-3 rounded-md bg-ink/70 px-2.5 py-1 font-data text-xs text-stone">
          {t(`views.${VIEW_KEYS[active]}`)}
        </span>
        <span className="absolute right-3 top-3 rounded-md bg-ink/60 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider text-stone/90">
          {t('illustrative')}
        </span>
      </div>

      {/* Thumbnail selector — real buttons so keyboard/focus works for free (§13). */}
      <ul className="grid grid-cols-6 gap-2">
        {VIEW_KEYS.map((key, index) => (
          <li key={key}>
            <button
              type="button"
              aria-label={t(`views.${key}`)}
              aria-current={index === active}
              onClick={() => setActive(index)}
              className={cn(
                'block aspect-square w-full overflow-hidden rounded-md bg-gradient-to-br ring-1 transition-transform duration-150 hover:scale-[1.03] motion-reduce:transition-none',
                thumbColor,
                index === active ? 'ring-2 ring-brass-dark' : 'ring-stone-dark',
              )}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
