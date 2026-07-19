'use client'

import { useTranslations } from 'next-intl'

interface FloorPlanSVGProps {
  title: string
}

// Schematic floor plan rendered as a labelled line drawing — the same visual language
// a real listing's floor plan uses, and a natural fit for the "Blueprint & Brass"
// identity (§1). Steel/ink strokes with dimension marks and room labels on a stone
// ground.
//
// Accessibility: role="img" + a <title> referenced by aria-labelledby so screen
// readers announce it as a floor plan naming the property (§13).
export function FloorPlanSVG({ title }: FloorPlanSVGProps) {
  const t = useTranslations('detail.floorPlan')
  const titleId = 'floorplan-title'

  return (
    <figure className="space-y-2">
      <svg
        role="img"
        aria-labelledby={titleId}
        viewBox="0 0 400 260"
        className="w-full rounded-xl bg-stone-dark/40 ring-1 ring-stone-dark"
        preserveAspectRatio="xMidYMid meet"
      >
        <title id={titleId}>{t('alt', { title })}</title>

        {/* Sheet border */}
        <rect
          x="12"
          y="12"
          width="376"
          height="236"
          fill="none"
          stroke="#3E5A70"
          strokeWidth="1"
          strokeDasharray="4 3"
          opacity="0.6"
        />

        {/* Outer walls */}
        <rect
          x="40"
          y="40"
          width="320"
          height="180"
          fill="#EEEAE2"
          stroke="#10161D"
          strokeWidth="2.5"
        />

        {/* Internal partitions */}
        <line x1="200" y1="40" x2="200" y2="220" stroke="#3E5A70" strokeWidth="1.5" />
        <line x1="200" y1="130" x2="360" y2="130" stroke="#3E5A70" strokeWidth="1.5" />
        <line x1="40" y1="150" x2="200" y2="150" stroke="#3E5A70" strokeWidth="1.5" />

        {/* Door swings */}
        <path d="M120 150 A20 20 0 0 1 140 170" fill="none" stroke="#5B7A94" strokeWidth="1" />
        <path d="M200 90 A18 18 0 0 0 218 108" fill="none" stroke="#5B7A94" strokeWidth="1" />

        {/* Room labels */}
        <g
          fill="#3E5A70"
          fontSize="9"
          fontFamily="'IBM Plex Mono', monospace"
          textAnchor="middle"
        >
          <text x="120" y="95">{t('rooms.living')}</text>
          <text x="120" y="188">{t('rooms.bedroom')}</text>
          <text x="280" y="88">{t('rooms.kitchen')}</text>
          <text x="280" y="180">{t('rooms.bath')}</text>
        </g>

        {/* Dimension marks (top) */}
        <line x1="40" y1="28" x2="360" y2="28" stroke="#7C5A2A" strokeWidth="0.75" />
        <line x1="40" y1="24" x2="40" y2="32" stroke="#7C5A2A" strokeWidth="0.75" />
        <line x1="360" y1="24" x2="360" y2="32" stroke="#7C5A2A" strokeWidth="0.75" />

        {/* Crosshair reticle — the signature Blueprint motif (§1) */}
        <g stroke="#A9793C" strokeWidth="0.75" opacity="0.8">
          <circle cx="330" cy="185" r="10" fill="none" />
          <line x1="330" y1="170" x2="330" y2="200" />
          <line x1="315" y1="185" x2="345" y2="185" />
        </g>
      </svg>
      <figcaption className="font-data text-xs text-ink-light">
        {t('caption')}
      </figcaption>
    </figure>
  )
}
