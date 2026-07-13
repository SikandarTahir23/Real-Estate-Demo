'use client'

import { useTranslations } from 'next-intl'
import type { Testimonial } from '@/types'

interface TestimonialCardProps {
  testimonial: Testimonial
}

// Client review card (spec §2, §10). Star rating, quote, and reviewer initials + origin
// only — no surname, no third-party verification badge or platform logo (§10). The
// rating is exposed to assistive tech via an aria-label; the stars themselves are
// decorative (aria-hidden). The parent section carries the generic "Client Reviews"
// heading, never attributed to a real platform.
export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const t = useTranslations('home.testimonials')
  const tType = useTranslations('propertyType')
  const rounded = Math.round(testimonial.rating)

  return (
    <figure className="flex h-full flex-col rounded-xl bg-white p-6 ring-1 ring-stone-dark">
      <div
        className="flex items-center gap-0.5 text-brass-dark"
        role="img"
        aria-label={t('ratingLabel', { rating: testimonial.rating })}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} aria-hidden="true" className={i < rounded ? '' : 'text-stone-dark'}>
            ★
          </span>
        ))}
      </div>

      <blockquote className="mt-4 flex-1 text-base leading-relaxed text-ink-mid">
        “{testimonial.quote}”
      </blockquote>

      <figcaption className="mt-5 flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-ink to-steel-dark font-data text-xs font-medium text-stone"
        >
          {testimonial.clientInitials}
        </span>
        <span className="text-sm">
          <span className="font-medium text-ink">{testimonial.clientInitials}</span>
          <span className="text-ink-light"> · {testimonial.clientOrigin}</span>
          <span className="block text-xs text-ink-light">
            {tType(testimonial.propertyType)}
          </span>
        </span>
      </figcaption>
    </figure>
  )
}
