'use client'

import { useTranslations } from 'next-intl'
import type { Testimonial } from '@/types'
import { TestimonialCard } from '@/components/ui/TestimonialCard'

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
}

// Client reviews section (spec §7 "one Testimonial", §10). Heading is the generic
// "Client Reviews" label — never attributed to a real review platform, no verification
// badge (§10). Accepts an array so the count is data-driven; the home page passes one.
export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const t = useTranslations('home.testimonials')

  if (testimonials.length === 0) return null

  return (
    <section
      aria-labelledby="reviews-heading"
      className="bg-stone-dark/40"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2
          id="reviews-heading"
          className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl"
        >
          {t('title')}
        </h2>
        <p className="mt-2 max-w-xl text-base text-ink-mid">{t('subtitle')}</p>

        <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <li key={testimonial.id}>
              <TestimonialCard testimonial={testimonial} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
