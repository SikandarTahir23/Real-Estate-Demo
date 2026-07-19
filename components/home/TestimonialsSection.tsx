'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import type { Testimonial } from '@/types'
import { TestimonialCard } from '@/components/ui/TestimonialCard'
import { cn } from '@/lib/utils'

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
}

// Client reviews section (spec §7 "one Testimonial", §10). Heading is the generic
// "Client Reviews" label — never attributed to a real review platform, no verification
// badge (§10). Cards live in a horizontal scroll-snap track driven by left/right
// arrows: every card stays in the DOM (good for a11y and SEO) while only a subset is
// visible. Arrows disable at each end; the track is also swipeable/scrollable directly.
export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const t = useTranslations('home.testimonials')
  const trackRef = useRef<HTMLUListElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  // Recompute arrow enabled-state from the current scroll position. A 1px slack
  // absorbs sub-pixel rounding so the "next" arrow doesn't linger enabled at the end.
  const updateArrows = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    const max = scrollWidth - clientWidth
    // Math.abs handles RTL, where scrollLeft is negative in most browsers.
    const pos = Math.abs(scrollLeft)
    setCanPrev(pos > 1)
    setCanNext(pos < max - 1)
  }, [])

  useEffect(() => {
    updateArrows()
    const el = trackRef.current
    if (!el) return
    el.addEventListener('scroll', updateArrows, { passive: true })
    window.addEventListener('resize', updateArrows)
    return () => {
      el.removeEventListener('scroll', updateArrows)
      window.removeEventListener('resize', updateArrows)
    }
  }, [updateArrows, testimonials.length])

  // Scroll by roughly one card (first child width + gap), direction-agnostic.
  const scrollByCards = (dir: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    const card = el.firstElementChild as HTMLElement | null
    const gap = 24 // matches gap-6
    const step = card ? card.offsetWidth + gap : el.clientWidth
    el.scrollBy({ left: step * dir, behavior: 'smooth' })
  }

  if (testimonials.length === 0) return null

  return (
    <section aria-labelledby="reviews-heading" className="bg-stone-dark/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2
              id="reviews-heading"
              className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl"
            >
              {t('title')}
            </h2>
            <p className="mt-2 max-w-xl text-base text-ink-mid">{t('subtitle')}</p>
          </div>

          {/* Arrow controls — hidden when everything already fits (both disabled). */}
          <div
            className={cn(
              'flex shrink-0 gap-2',
              !canPrev && !canNext && 'hidden',
            )}
          >
            <button
              type="button"
              aria-label={t('previous')}
              aria-controls="reviews-track"
              disabled={!canPrev}
              onClick={() => scrollByCards(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink ring-1 ring-stone-dark transition-colors duration-150 hover:bg-stone enabled:hover:ring-brass-dark disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none"
            >
              <span aria-hidden="true" className="rtl:rotate-180">
                ‹
              </span>
            </button>
            <button
              type="button"
              aria-label={t('next')}
              aria-controls="reviews-track"
              disabled={!canNext}
              onClick={() => scrollByCards(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink ring-1 ring-stone-dark transition-colors duration-150 hover:bg-stone enabled:hover:ring-brass-dark disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none"
            >
              <span aria-hidden="true" className="rtl:rotate-180">
                ›
              </span>
            </button>
          </div>
        </div>

        <ul
          ref={trackRef}
          id="reviews-track"
          className="mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {testimonials.map((testimonial) => (
            <li
              key={testimonial.id}
              className="w-[85%] shrink-0 snap-start sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
            >
              <TestimonialCard testimonial={testimonial} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
