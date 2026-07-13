// Seed Neon with the concept catalogue from lib/*.ts — 8 properties, 3 agents,
// 3 testimonials. Idempotent: every row is upserted by its stable id (p*/a*/t*),
// so running this repeatedly converges rather than duplicating.
//
// Data is inlined here (mirrored from lib/properties.ts, lib/agents.ts,
// lib/testimonials.ts) because those modules use the "@/..." path alias and TS
// types that a plain `node` process can't resolve without a build step. The
// values are copied verbatim; the app's static arrays remain the source of truth.
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const agents = [
  {
    id: 'a1',
    name: 'Layla Haddad',
    initials: 'LH',
    yearsExperience: 9,
    languages: ['English', 'Arabic', 'French'],
    speciality: 'Downtown & off-plan investments',
    whatsapp: '+971 50 000 0001',
  },
  {
    id: 'a2',
    name: 'Omar Farouk',
    initials: 'OF',
    yearsExperience: 14,
    languages: ['English', 'Arabic'],
    speciality: 'Prime villas & waterfront homes',
    whatsapp: '+971 50 000 0002',
  },
  {
    id: 'a3',
    name: 'Sana Kapoor',
    initials: 'SK',
    yearsExperience: 6,
    languages: ['English', 'Hindi', 'Urdu'],
    speciality: 'Rentals & first-time buyers',
    whatsapp: '+971 50 000 0003',
  },
]

const properties = [
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
    handoverQuarter: null,
    amenities: ['Infinity pool', 'Gym', 'Concierge', 'Burj Khalifa view'],
    description:
      'A quiet corner unit above the Boulevard, with direct sightlines to the Fountain. Floor-to-ceiling glazing frames the skyline, and the layout keeps the living space clear of through-traffic — a genuine one-bedroom, not a converted studio.',
    highlights: ['Fountain view balcony', 'Vacant on transfer', 'Chiller-free'],
    grossYieldEstimate: 6.2,
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
    floor: null,
    handoverQuarter: null,
    amenities: ['Private beach', 'Pool', "Maid's room", 'Boat mooring'],
    description:
      'Frond-tip privacy with an open Gulf horizon and a private mooring. The ground floor opens fully to the pool deck and beach, and the upper floor is arranged around a primary suite with its own sea-facing terrace.',
    highlights: [
      'Private beach frontage',
      'Renovated 2025',
      'Maid & driver quarters',
    ],
    grossYieldEstimate: 4.1,
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
    floor: null,
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
    featured: false,
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
    handoverQuarter: null,
    amenities: ['Canal walk access', 'Gym', 'Covered parking'],
    description:
      'A studio built for the canal-side lifestyle, walking distance to the boardwalk. Efficient rather than compact — a full kitchen, a genuine sleeping zone, and a balcony that catches the water rather than the podium.',
    highlights: ['Furnished option available', 'Metro-adjacent', 'Chiller-free'],
    grossYieldEstimate: null,
    featured: false,
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
    floor: null,
    handoverQuarter: null,
    amenities: [
      'Private garden',
      'Community pool',
      'Golf course',
      'Schools nearby',
    ],
    description:
      'A courtyard-style family villa in a gated community walking distance to two schools. The plan wraps the living spaces around a central courtyard, and the garden is mature rather than newly turfed.',
    highlights: [
      'Walking distance to Ranches Primary',
      'Landscaped garden',
      'Gated community',
    ],
    grossYieldEstimate: 5.1,
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
    handoverQuarter: null,
    amenities: ['Marina walk', 'Pool', 'Gym', 'Retail podium'],
    description:
      'A waterfront apartment steps from the marina walk and Yas Mall. The two bedrooms sit on opposite sides of the living space for privacy, and the balcony faces the water rather than the internal road.',
    highlights: [
      'Marina views',
      'Near Ferrari World & Yas Marina Circuit',
      'Rented until 2027',
    ],
    grossYieldEstimate: 6.7,
    featured: false,
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
    handoverQuarter: null,
    amenities: [
      'Private beach club',
      'Rooftop terrace',
      'Museum district access',
    ],
    description:
      'A duplex penthouse minutes from the Saadiyat cultural district and beach club. The upper level is given over to a single primary suite and a full sea-facing terrace, with the living floor below opening onto its own balcony run.',
    highlights: [
      'Full sea-facing terrace',
      'Near Louvre Abu Dhabi',
      'Duplex layout',
    ],
    grossYieldEstimate: 4.6,
    featured: false,
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
    floor: null,
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
    featured: false,
    thumbColor: 'from-brass-light to-steel',
  },
]

// lib/testimonials.ts stores month strings ("2026-02"); the DB column is a
// DateTime. Anchor each to the first of that month.
const testimonials = [
  {
    id: 't1',
    clientInitials: 'A.R.',
    clientOrigin: 'United Kingdom',
    rating: 5,
    quote:
      'The matcher understood exactly what we needed and shortlisted three homes that actually fit our budget and school run. We viewed two and offered on one.',
    propertyType: 'Villa',
    date: new Date('2026-02-01T00:00:00.000Z'),
  },
  {
    id: 't2',
    clientInitials: 'S.K.',
    clientOrigin: 'India',
    rating: 5,
    quote:
      'As an investor I care about numbers first. The yield estimates and the mortgage breakdown made it easy to compare units before I ever spoke to an advisor.',
    propertyType: 'Apartment',
    date: new Date('2026-01-01T00:00:00.000Z'),
  },
  {
    id: 't3',
    clientInitials: 'M.A.',
    clientOrigin: 'UAE',
    rating: 4,
    quote:
      'Clear listings, honest specs, and a straightforward WhatsApp handover to an advisor. No pressure, no inflated claims — refreshing for this market.',
    propertyType: 'Townhouse',
    date: new Date('2025-12-01T00:00:00.000Z'),
  },
]

async function main() {
  for (const a of agents) {
    await prisma.agent.upsert({ where: { id: a.id }, update: a, create: a })
  }
  for (const p of properties) {
    await prisma.property.upsert({ where: { id: p.id }, update: p, create: p })
  }
  for (const t of testimonials) {
    await prisma.testimonial.upsert({
      where: { id: t.id },
      update: t,
      create: t,
    })
  }

  const [ap, pp, tp] = await Promise.all([
    prisma.agent.count(),
    prisma.property.count(),
    prisma.testimonial.count(),
  ])
  console.log(`Seeded — agents: ${ap}, properties: ${pp}, testimonials: ${tp}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
