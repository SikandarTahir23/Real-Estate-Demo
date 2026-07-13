// Shared TypeScript types — single source of truth for the domain model (spec §3).
// This exact shape is also the intended headless-CMS schema for production (§14 item 1).

export type PropertyType = 'Apartment' | 'Villa' | 'Townhouse' | 'Penthouse'
export type PropertyStatus = 'Ready' | 'OffPlan'
export type PropertyPurpose = 'Buy' | 'Rent'

export interface Property {
  id: string
  slug: string
  title: string
  type: PropertyType
  purpose: PropertyPurpose
  status: PropertyStatus
  area: string // e.g. 'Downtown Dubai', 'Yas Island'
  emirate: 'Dubai' | 'Abu Dhabi'
  developer: string // fictional — see §10
  priceAED: number
  sizeSqft: number
  beds: number
  baths: number
  floor?: number
  handoverQuarter?: string // e.g. 'Q3 2027', only for OffPlan
  amenities: string[]
  description: string
  highlights: string[]
  grossYieldEstimate?: number // percent, investor-facing content
  agentId: string
  featured?: boolean
  thumbColor: string // gradient class, decorative placeholder (§9)
}

export interface Agent {
  id: string
  name: string
  initials: string
  yearsExperience: number
  languages: string[]
  speciality: string
  whatsapp: string
}

export interface Testimonial {
  id: string
  clientInitials: string // initials only — see §10 disclosure rules
  clientOrigin: string
  rating: number
  quote: string
  propertyType: PropertyType
  date: string
}

export interface MatchCriteria {
  propertyType?: PropertyType
  purpose?: PropertyPurpose
  minBudgetAED?: number
  maxBudgetAED?: number
  minBeds?: number
  area?: string
  mustHaves?: string[]
}

export interface MatchResult {
  property: Property
  whyItFits: string // one-sentence, generated per match
}

// Response contract for POST /api/matcher (§5 step 6). `fallback` is true when the
// deterministic keyword path served the results because the LLM call was
// unavailable — the widget shows a subtle "best-guess matches" note, never an error.
export interface MatcherResponse {
  criteria: MatchCriteria
  results: MatchResult[]
  fallback: boolean
}
