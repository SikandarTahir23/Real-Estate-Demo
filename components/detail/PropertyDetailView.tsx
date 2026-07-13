'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type { Agent, Property } from '@/types'
import { PropertyCard } from '@/components/ui/PropertyCard'
import { StatusTag } from '@/components/ui/StatusTag'
import { PropertyGallery } from '@/components/detail/PropertyGallery'
import { FloorPlanSVG } from '@/components/detail/FloorPlanSVG'
import { SpecBlock } from '@/components/detail/SpecBlock'
import { AgentCard } from '@/components/detail/AgentCard'
import { ViewingRequest } from '@/components/detail/ViewingRequest'

interface PropertyDetailViewProps {
  property: Property
  agent: Agent | undefined
  similar: Property[]
}

// Client orchestrator for the property detail page (§9). The server page owns metadata
// + data lookup and passes plain data in; this island renders the i18n-reactive content
// and the interactive pieces (gallery selection, viewing request). No data fetching
// here — everything is resolved server-side (§14 item 13).
export function PropertyDetailView({
  property,
  agent,
  similar,
}: PropertyDetailViewProps) {
  const t = useTranslations('detail')

  // PropertyCard quick-enquire message (§12) reused as the agent card's seeded message,
  // grounded strictly in this property's real title — never invented details.
  const agentMessage = t('agent.propertyMessage', { title: property.title })

  // Calculator shortcut pre-filled with thi
  
  return (
    <article className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      {/* Breadcrumb + back link */}
      <nav aria-label={t('breadcrumb.label')} className="mb-6 text-sm">
        <Link
          href="/listings"
          className="text-steel-dark transition-colors duration-150 hover:text-ink motion-reduce:transition-none"
        >
          ← {t('breadcrumb.backToListings')}
        </Link>
      </nav>

      {/* Header */}
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <StatusTag status={property.status} />
            <p className="font-data text-xs uppercase tracking-wider text-steel-dark">
              {property.area} · {property.emirate}
            </p>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {property.title}
          </h1>
          <p className="text-sm text-ink-mid">
            {t('developerBy', { developer: property.developer })}
          </p>
        </div>
      </header>

      {/* Two-column: media + content on the left, sticky actions on the right */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-10 lg:col-span-2">
          <PropertyGallery title={property.title} thumbColor={property.thumbColor} />

          {/* Specs */}
          <section aria-labelledby="specs-heading" className="space-y-4">
            <h2
              id="specs-heading"
              className="font-display text-xl font-semibold text-ink"
            >
              {t('sections.specs')}
            </h2>
            <div className="rounded-xl bg-white p-5 ring-1 ring-stone-dark">
              <SpecBlock property={property} />
            </div>
          </section>

          {/* Description */}
          <section aria-labelledby="about-heading" className="space-y-3">
            <h2
              id="about-heading"
              className="font-display text-xl font-semibold text-ink"
            >
              {t('sections.about')}
            </h2>
            <p className="text-base leading-relaxed text-ink-mid">
              {property.description}
            </p>
          </section>

          {/* Highlights */}
          {property.highlights.length > 0 && (
            <section aria-labelledby="highlights-heading" className="space-y-3">
              <h2
                id="highlights-heading"
                className="font-display text-xl font-semibold text-ink"
              >
                {t('sections.highlights')}
              </h2>
              <ul className="space-y-2">
                {property.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2 text-ink-mid">
                    <span aria-hidden="true" className="mt-1 text-brass-dark">
                      ◈
                    </span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Amenities */}
          {property.amenities.length > 0 && (
            <section aria-labelledby="amenities-heading" className="space-y-3">
              <h2
                id="amenities-heading"
                className="font-display text-xl font-semibold text-ink"
              >
                {t('sections.amenities')}
              </h2>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {property.amenities.map((amenity) => (
                  <li
                    key={amenity}
                    className="rounded-md bg-white px-3 py-2 text-sm text-ink-mid ring-1 ring-stone-dark"
                  >
                    {amenity}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Floor plan — the honestly-schematic placeholder (§9) */}
          <section aria-labelledby="floorplan-heading" className="space-y-3">
            <h2
              id="floorplan-heading"
              className="font-display text-xl font-semibold text-ink"
            >
              {t('sections.floorPlan')}
            </h2>
            <FloorPlanSVG title={property.title} />
          </section>
        </div>

        {/* Right rail: viewing request, agent, calculator shortcut. Sticky on desktop. */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <ViewingRequest propertyTitle={property.title} />

          {agent && <AgentCard agent={agent} whatsappMessage={agentMessage} />}

          <Link
            href={calculatorHref}
            className="block rounded-xl border border-dashed border-steel-dark bg-white p-5 transition-colors duration-150 hover:bg-stone motion-reduce:transition-none"
          >
            <p className="font-display text-base font-semibold text-ink">
              {t('calculatorTeaser.title')}
            </p>
            <p className="mt-1 text-sm text-ink-mid">
              {t('calculatorTeaser.body')}
            </p>
            <span className="mt-3 inline-block text-sm font-medium text-brass-dark">
              {t('calculatorTeaser.cta')} →
            </span>
          </Link>
        </aside>
      </div>

      {/* Similar properties rail (§9): 3 cards from the same area or type */}
      {similar.length > 0 && (
        <section aria-labelledby="similar-heading" className="mt-14">
          <h2
            id="similar-heading"
            className="font-display text-2xl font-bold tracking-tight text-ink"
          >
            {t('sections.similar')}
          </h2>
          <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((item, index) => (
              <li key={item.id}>
                <PropertyCard property={item} index={index} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}
