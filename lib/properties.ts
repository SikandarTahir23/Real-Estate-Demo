import type { Property } from '@/types'

// Static listings data (spec §4). Populated verbatim from the specification's 8-listing
// minimum with UAE-accurate specs and realistic AED pricing. Developer names are
// fictional (§10). Static-array-over-CMS is the documented Phase-scale trade-off
// (§14 item 1): zero infra for the demo, and this exact Property shape is the intended
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
    thumbColor: 'from-slate-800 to-steel-dark',
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
    thumbColor: 'from-brass-dark to-brass',
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
    thumbColor: 'from-emerald-800 to-steel',
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
    thumbColor: 'from-steel-dark to-ink',
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
    thumbColor: 'from-brass to-stone-dark',
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
    thumbColor: 'from-steel to-emerald-800',
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
    thumbColor: 'from-ink to-steel-dark',
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
    thumbColor: 'from-brass-light to-steel',
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
