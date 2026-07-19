import type { Property } from '@/types'

// Static listings data (spec §4). UAE-accurate specs and realistic AED pricing.
// Each listing carries an ordered `images` gallery of locally-hosted, optimized
// photographs (served via next/image) — the first image is the card thumbnail and the
// full set drives the detail-page gallery. This exact Property shape is the intended
// production CMS schema so the migration path stays trivial.
export const properties: Property[] = [
  {
    id: 'p1',
    slug: 'downtown-dubai-1br-boulevard',
    title: '1BR Boulevard View',
    type: 'Apartment',
    purpose: 'Buy',
    status: 'Ready',
    area: 'Downtown Dubai',
    emirate: 'Dubai',
    developer: 'Palmara Developments',
    priceAED: 1850000,
    sizeSqft: 780,
    beds: 1,
    baths: 2,
    floor: 22,
    amenities: ['Infinity pool', 'Gym', 'Concierge', 'Burj Khalifa view'],
    description:
      'A quiet corner unit above the Boulevard, with direct sightlines to the Fountain. Floor-to-ceiling glazing frames the skyline, and the layout keeps the living space clear of through-traffic — a genuine one-bedroom, not a converted studio.',
    highlights: ['Fountain view balcony', 'Vacant on transfer', 'Chiller-free'],
    grossYieldEstimate: 6.2,
    agentId: 'a1',
    featured: true,
    images: [
      { src: '/images/library/tower-dusk.jpg', room: 'exterior' },
      { src: '/images/library/living-skyline.jpg', room: 'living' },
      { src: '/images/library/kitchen-sleek.jpg', room: 'kitchen' },
      { src: '/images/library/bedroom-white.jpg', room: 'bedroom' },
      { src: '/images/library/view-city-skyline.jpg', room: 'view' },
      { src: '/images/library/bathroom-vanity.jpg', room: 'bathroom' },
    ],
  },
  {
    id: 'p2',
    slug: 'palm-jumeirah-signature-villa',
    title: 'Signature Frond Villa',
    type: 'Villa',
    purpose: 'Buy',
    status: 'Ready',
    area: 'Palm Jumeirah',
    emirate: 'Dubai',
    developer: 'Vantage Coastal Group',
    priceAED: 15200000,
    sizeSqft: 6100,
    beds: 5,
    baths: 6,
    amenities: ['Private beach', 'Pool', "Maid's room", 'Boat mooring'],
    description:
      'Frond-tip privacy with an open Gulf horizon and a private mooring. The ground floor opens fully to the pool deck and beach, and the upper floor is arranged around a primary suite with its own sea-facing terrace.',
    highlights: [
      'Private beach frontage',
      'Renovated 2025',
      'Maid & driver quarters',
    ],
    grossYieldEstimate: 4.1,
    agentId: 'a2',
    featured: true,
    images: [
      { src: '/images/library/villa-pool-exterior.jpg', room: 'exterior' },
      { src: '/images/library/living-warm.jpg', room: 'living' },
      { src: '/images/library/kitchen-island.jpg', room: 'kitchen' },
      { src: '/images/library/bedroom-suite.jpg', room: 'bedroom' },
      { src: '/images/library/pool-deck.jpg', room: 'pool' },
      { src: '/images/library/view-sea.jpg', room: 'view' },
    ],
  },
  {
    id: 'p3',
    slug: 'dubai-hills-off-plan-townhouse',
    title: 'Parkside Townhouse (Off-Plan)',
    type: 'Townhouse',
    purpose: 'Buy',
    status: 'OffPlan',
    area: 'Dubai Hills Estate',
    emirate: 'Dubai',
    developer: 'Skyline Estates Group',
    priceAED: 2650000,
    sizeSqft: 2400,
    beds: 3,
    baths: 4,
    handoverQuarter: 'Q4 2027',
    amenities: ['Community park', 'Pool', 'Retail podium'],
    description:
      'A three-bedroom townhouse fronting the central park, on a post-handover plan. The ground floor runs kitchen-to-garden in a single span, and the community is built around the golf course and its retail spine.',
    highlights: [
      '60/40 payment plan',
      'Golf course community',
      'Post-handover option',
    ],
    grossYieldEstimate: 5.8,
    agentId: 'a1',
    images: [
      { src: '/images/library/house-facade.jpg', room: 'exterior' },
      { src: '/images/library/living-open.jpg', room: 'living' },
      { src: '/images/library/kitchen-fitted.jpg', room: 'kitchen' },
      { src: '/images/library/bedroom-styled.jpg', room: 'bedroom' },
      { src: '/images/library/bathroom-modern.jpg', room: 'bathroom' },
      { src: '/images/library/terrace-outdoor.jpg', room: 'terrace' },
    ],
  },
  {
    id: 'p4',
    slug: 'business-bay-studio-canal',
    title: 'Canal-Facing Studio',
    type: 'Apartment',
    purpose: 'Rent',
    status: 'Ready',
    area: 'Business Bay',
    emirate: 'Dubai',
    developer: 'Palmara Developments',
    priceAED: 95000,
    sizeSqft: 480,
    beds: 0,
    baths: 1,
    floor: 14,
    amenities: ['Canal walk access', 'Gym', 'Covered parking'],
    description:
      'A studio built for the canal-side lifestyle, walking distance to the boardwalk. Efficient rather than compact — a full kitchen, a genuine sleeping zone, and a balcony that catches the water rather than the podium.',
    highlights: ['Furnished option available', 'Metro-adjacent', 'Chiller-free'],
    agentId: 'a3',
    images: [
      { src: '/images/library/living-bright.jpg', room: 'living' },
      { src: '/images/library/kitchen-pendant.jpg', room: 'kitchen' },
      { src: '/images/library/bathroom-clean.jpg', room: 'bathroom' },
      { src: '/images/library/view-city-skyline.jpg', room: 'view' },
    ],
  },
  {
    id: 'p5',
    slug: 'arabian-ranches-family-villa',
    title: '4BR Courtyard Villa',
    type: 'Villa',
    purpose: 'Buy',
    status: 'Ready',
    area: 'Arabian Ranches',
    emirate: 'Dubai',
    developer: 'Vantage Coastal Group',
    priceAED: 4400000,
    sizeSqft: 3800,
    beds: 4,
    baths: 5,
    amenities: ['Private garden', 'Community pool', 'Golf course', 'Schools nearby'],
    description:
      'A courtyard-style family villa in a gated community walking distance to two schools. The plan wraps the living spaces around a central courtyard, and the garden is mature rather than newly turfed.',
    highlights: [
      'Walking distance to Ranches Primary',
      'Landscaped garden',
      'Gated community',
    ],
    grossYieldEstimate: 5.1,
    agentId: 'a2',
    featured: true,
    images: [
      { src: '/images/library/villa-landscaped.jpg', room: 'exterior' },
      { src: '/images/library/living-lounge.jpg', room: 'living' },
      { src: '/images/library/kitchen-contemporary.jpg', room: 'kitchen' },
      { src: '/images/library/bedroom-warm.jpg', room: 'bedroom' },
      { src: '/images/library/bathroom-mirror.jpg', room: 'bathroom' },
      { src: '/images/library/pool-deck.jpg', room: 'pool' },
    ],
  },
  {
    id: 'p6',
    slug: 'yas-island-waterfront-apartment',
    title: '2BR Waterfront Apartment',
    type: 'Apartment',
    purpose: 'Buy',
    status: 'Ready',
    area: 'Yas Island',
    emirate: 'Abu Dhabi',
    developer: 'Skyline Estates Group',
    priceAED: 2100000,
    sizeSqft: 1350,
    beds: 2,
    baths: 3,
    floor: 8,
    amenities: ['Marina walk', 'Pool', 'Gym', 'Retail podium'],
    description:
      'A waterfront apartment steps from the marina walk and Yas Mall. The two bedrooms sit on opposite sides of the living space for privacy, and the balcony faces the water rather than the internal road.',
    highlights: [
      'Marina views',
      'Near Ferrari World & Yas Marina Circuit',
      'Rented until 2027',
    ],
    grossYieldEstimate: 6.7,
    agentId: 'a3',
    images: [
      { src: '/images/library/living-styled.jpg', room: 'living' },
      { src: '/images/library/kitchen-fitted.jpg', room: 'kitchen' },
      { src: '/images/library/bedroom-wood.jpg', room: 'bedroom' },
      { src: '/images/library/bathroom-modern.jpg', room: 'bathroom' },
      { src: '/images/library/view-sea.jpg', room: 'view' },
    ],
  },
  {
    id: 'p7',
    slug: 'saadiyat-island-beach-penthouse',
    title: 'Beachfront Penthouse',
    type: 'Penthouse',
    purpose: 'Buy',
    status: 'Ready',
    area: 'Saadiyat Island',
    emirate: 'Abu Dhabi',
    developer: 'Vantage Coastal Group',
    priceAED: 9800000,
    sizeSqft: 4200,
    beds: 4,
    baths: 5,
    floor: 12,
    amenities: ['Private beach club', 'Rooftop terrace', 'Museum district access'],
    description:
      'A duplex penthouse minutes from the Saadiyat cultural district and beach club. The upper level is given over to a single primary suite and a full sea-facing terrace, with the living floor below opening onto its own balcony run.',
    highlights: ['Full sea-facing terrace', 'Near Louvre Abu Dhabi', 'Duplex layout'],
    grossYieldEstimate: 4.6,
    agentId: 'a2',
    images: [
      { src: '/images/library/view-sea.jpg', room: 'view' },
      { src: '/images/library/living-sunlit.jpg', room: 'living' },
      { src: '/images/library/kitchen-island.jpg', room: 'kitchen' },
      { src: '/images/library/bedroom-suite.jpg', room: 'bedroom' },
      { src: '/images/library/bathroom-vanity.jpg', room: 'bathroom' },
      { src: '/images/library/terrace-outdoor.jpg', room: 'terrace' },
    ],
  },
  {
    id: 'p8',
    slug: 'al-reem-island-1br-offplan',
    title: 'Reem Central 1BR (Off-Plan)',
    type: 'Apartment',
    purpose: 'Buy',
    status: 'OffPlan',
    area: 'Al Reem Island',
    emirate: 'Abu Dhabi',
    developer: 'Skyline Estates Group',
    priceAED: 1150000,
    sizeSqft: 720,
    beds: 1,
    baths: 2,
    handoverQuarter: 'Q2 2028',
    amenities: ['Infinity pool', 'Padel court', 'Co-working lounge'],
    description:
      'An entry-level investment unit in a rapidly maturing island community. The layout favours a rentable one-bedroom over an oversized studio, and the building leads with amenity space aimed at younger tenants.',
    highlights: [
      '1% monthly payment plan',
      'Sea corridor glimpse',
      'High rental demand area',
    ],
    grossYieldEstimate: 7.1,
    agentId: 'a1',
    images: [
      { src: '/images/library/living-coffee.jpg', room: 'living' },
      { src: '/images/library/kitchen-contemporary.jpg', room: 'kitchen' },
      { src: '/images/library/bedroom-cozy.jpg', room: 'bedroom' },
      { src: '/images/library/bathroom-clean.jpg', room: 'bathroom' },
      { src: '/images/library/pool-deck.jpg', room: 'pool' },
    ],
  },
]

// Lookups used by featured rails (§7) and the property detail page (§9, Phase 3).
export function getPropertyBySlug(slug: string): Property | undefined {
  return properties.find((property) => property.slug === slug)
}

export function getFeaturedProperties(): Property[] {
  return properties.filter((property) => property.featured)
}

// Similar-properties rail for the detail page (§9): client-computable, deterministic.
// Ranking preference — same area first (strongest signal for a UAE buyer), then same
// type, then any other listing to backfill — always excluding the property itself, and
// capped at `limit` (3 per §9). Pure so the detail view can call it without an effect.
export function getSimilarProperties(
  current: Property,
  limit = 3,
): Property[] {
  const others = properties.filter((p) => p.id !== current.id)

  const rank = (p: Property): number => {
    if (p.area === current.area) return 0
    if (p.type === current.type) return 1
    return 2
  }

  return others
    .map((property, index) => ({ property, index, score: rank(property) }))
    // Stable sort by score, falling back to original order so results are deterministic.
    .sort((a, b) => a.score - b.score || a.index - b.index)
    .slice(0, limit)
    .map((entry) => entry.property)
}
