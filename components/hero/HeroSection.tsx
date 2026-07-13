'use client'

import { useTranslations } from 'next-intl'
import { BlueprintSVG } from '@/components/hero/BlueprintSVG'
import { MatcherWidget } from '@/components/matcher/MatcherWidget'

// Hero shell with the embedded matcher (spec §7: "the matcher is the thesis of the whole
// site — lead with it"). The BlueprintSVG bleeds into the ink background as the signature
// visual (§1). Two-column on desktop (copy + matcher), stacked on mobile. Hero content
// uses the 300ms fade-up (§11), the only page-load animation.
export function HeroSection() {
  const t = useTranslations('home.hero')

  return (
    <section className="relative overflow-hidden bg-ink text-stone">
      {/* Signature blueprint art, bleeding from the right edge. Hidden on small screens
          where the matcher takes full width. Decorative (aria-hidden inside). */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 items-center justify-end lg:flex">
        <BlueprintSVG className="h-[90%] w-auto opacity-70" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div className="animate-fade-up motion-reduce:animate-none">
            <p className="font-data text-sm uppercase tracking-widest text-brass-light">
              {t('eyebrow')}
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              {t('title')}
            </h1>
            <p className="mt-6 max-w-xl text-base text-stone/80 sm:text-lg">
              {t('subtitle')}
            </p>
          </div>

          {/* Matcher leads the hero (§7). */}
          <div className="animate-fade-up motion-reduce:animate-none lg:justify-self-end lg:pl-6">
            <div className="w-full max-w-md">
              <MatcherWidget />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
