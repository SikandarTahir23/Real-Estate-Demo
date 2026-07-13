import type { MatchCriteria, Property, PropertyType } from '@/types'
import { properties as allProperties } from '@/lib/properties'

// Deterministic, NON-LLM scoring and ranking (spec §5 step 4, §14 item 3).
// This is the single most important trade-off in the matcher: the LLM only parses the
// buyer's intent into MatchCriteria; THIS code decides which properties match and in
// what order. The model never picks a home — that keeps results explainable, cheap,
// and reproducible.

export interface ScoredProperty {
  property: Property
  score: number
  // Which criteria actually contributed — used to ground the fallback "why it fits"
  // sentence without inventing anything (§5 step 5).
  reasons: MatchReason[]
}

export type MatchReason =
  | 'type'
  | 'purpose'
  | 'area'
  | 'beds'
  | 'budget'
  | 'amenities'

// Weights are tuned so a strong single signal (right area, in budget) ranks a property
// well, while matching several criteria compounds. Budget proximity is graded, not
// pass/fail, so a slightly-over-budget home still surfaces rather than vanishing.
const WEIGHTS = {
  type: 30,
  purpose: 20,
  area: 25,
  beds: 20,
  budgetInRange: 25,
  budgetNear: 12,
  amenityEach: 6,
  amenityMax: 18,
} as const

function scoreProperty(
  property: Property,
  criteria: MatchCriteria,
): ScoredProperty {
  let score = 0
  const reasons: MatchReason[] = []

  if (criteria.propertyType && property.type === criteria.propertyType) {
    score += WEIGHTS.type
    reasons.push('type')
  }

  if (criteria.purpose && property.purpose === criteria.purpose) {
    score += WEIGHTS.purpose
    reasons.push('purpose')
  }

  if (criteria.area && areaMatches(property.area, criteria.area)) {
    score += WEIGHTS.area
    reasons.push('area')
  }

  if (criteria.minBeds !== undefined && property.beds >= criteria.minBeds) {
    score += WEIGHTS.beds
    reasons.push('beds')
  }

  // Budget: full points inside [min,max], partial points when close (within 20% of the
  // nearer bound), zero when far off. Graded so ranking degrades gracefully.
  const budgetScore = scoreBudget(property.priceAED, criteria)
  if (budgetScore > 0) {
    score += budgetScore
    reasons.push('budget')
  }

  // Amenity / must-have overlap — substring match against amenities, highlights, and
  // description so "good schools", "pool", "sea view" etc. all have something to hit.
  const overlap = countMustHaveOverlap(property, criteria.mustHaves)
  if (overlap > 0) {
    score += Math.min(overlap * WEIGHTS.amenityEach, WEIGHTS.amenityMax)
    reasons.push('amenities')
  }

  return { property, score, reasons }
}

function areaMatches(propertyArea: string, criteriaArea: string): boolean {
  const a = propertyArea.toLowerCase()
  const b = criteriaArea.toLowerCase().trim()
  if (!b) return false
  return a.includes(b) || b.includes(a)
}

function scoreBudget(priceAED: number, criteria: MatchCriteria): number {
  const { minBudgetAED, maxBudgetAED } = criteria
  if (minBudgetAED === undefined && maxBudgetAED === undefined) return 0

  const min = minBudgetAED ?? 0
  const max = maxBudgetAED ?? Number.POSITIVE_INFINITY

  if (priceAED >= min && priceAED <= max) return WEIGHTS.budgetInRange

  // Distance to the nearer bound, as a fraction of that bound.
  const nearerBound = priceAED < min ? min : max
  if (!Number.isFinite(nearerBound) || nearerBound === 0) return 0
  const distance = Math.abs(priceAED - nearerBound) / nearerBound
  return distance <= 0.2 ? WEIGHTS.budgetNear : 0
}

function countMustHaveOverlap(
  property: Property,
  mustHaves: string[] | undefined,
): number {
  if (!mustHaves || mustHaves.length === 0) return 0
  const haystack = [
    ...property.amenities,
    ...property.highlights,
    property.description,
  ]
    .join(' ')
    .toLowerCase()

  return mustHaves.filter((want) => {
    const needle = want.toLowerCase().trim()
    return needle.length > 0 && haystack.includes(needle)
  }).length
}

// Rank the full catalogue against criteria. Returns the top `limit`, best first.
// When no criteria produce any signal (empty query), falls back to featured-first so
// the widget still shows something sensible rather than an arbitrary order.
export function rankProperties(
  criteria: MatchCriteria,
  limit = 3,
  pool: Property[] = allProperties,
): ScoredProperty[] {
  const scored = pool.map((property) => scoreProperty(property, criteria))
  const anySignal = scored.some((s) => s.score > 0)

  if (!anySignal) {
    return pool
      .map((property, index) => ({
        property,
        score: 0,
        reasons: [] as MatchReason[],
        index,
      }))
      .sort(
        (a, b) =>
          Number(Boolean(b.property.featured)) -
            Number(Boolean(a.property.featured)) || a.index - b.index,
      )
      .slice(0, limit)
      .map(({ property, score, reasons }) => ({ property, score, reasons }))
  }

  return scored
    .map((s, index) => ({ ...s, index }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map(({ property, score, reasons }) => ({ property, score, reasons }))
}

// Naive keyword-only criteria guess for the resilience fallback path (§5): used when
// the LLM extraction is unavailable so the widget still returns real matches instead
// of breaking. Intentionally simple — it is the safety net, not the primary path.
const TYPE_KEYWORDS: Array<[PropertyType, string[]]> = [
  ['Villa', ['villa', 'فيلا']],
  ['Penthouse', ['penthouse', 'بنتهاوس']],
  ['Townhouse', ['townhouse', 'town house', 'تاون']],
  ['Apartment', ['apartment', 'flat', 'studio', 'شقة', 'استوديو']],
]

export function guessCriteria(query: string): MatchCriteria {
  const text = query.toLowerCase()
  const criteria: MatchCriteria = {}

  for (const [type, keywords] of TYPE_KEYWORDS) {
    if (keywords.some((k) => text.includes(k))) {
      criteria.propertyType = type
      break
    }
  }

  if (/\b(rent|rental|إيجار|للايجار)\b/.test(text)) criteria.purpose = 'Rent'
  else if (/\b(buy|purchase|شراء|للبيع)\b/.test(text)) criteria.purpose = 'Buy'

  // Bedroom count: "3 bed", "3-bedroom", "3 غرف".
  const bedMatch = text.match(/(\d+)\s*(?:bed|bedroom|br|غرف)/)
  if (bedMatch) criteria.minBeds = Number(bedMatch[1])

  // Budget: numbers followed by m/million/k, or a plain "around 4.5 million".
  const budget = parseBudget(text)
  if (budget !== null) criteria.maxBudgetAED = budget

  // Must-haves: a few well-known amenity keywords worth matching on.
  const amenityKeywords = [
    'pool',
    'beach',
    'gym',
    'school',
    'view',
    'marina',
    'garden',
    'furnished',
  ]
  const mustHaves = amenityKeywords.filter((k) => text.includes(k))
  if (mustHaves.length > 0) criteria.mustHaves = mustHaves

  return criteria
}

// Deterministic "why it fits" sentence, grounded strictly in the property's real data
// and the criteria that actually scored (§5 step 5). Used on the fallback path and when
// the LLM explanation call fails, so a result is never shown without an explanation.
// The reasons come from scoring, so this can never claim a match that didn't happen.
export function buildWhyItFits(
  scored: ScoredProperty,
  criteria: MatchCriteria,
): string {
  const { property, reasons } = scored
  const parts: string[] = []

  if (reasons.includes('type')) parts.push(`a ${property.type.toLowerCase()}`)
  if (reasons.includes('area')) parts.push(`in ${property.area}`)
  if (reasons.includes('beds') && property.beds > 0) {
    parts.push(`with ${property.beds}+ bedrooms`)
  }
  if (reasons.includes('budget')) parts.push('within your budget')
  if (reasons.includes('amenities') && criteria.mustHaves?.length) {
    const matched = criteria.mustHaves
      .filter((want) =>
        [...property.amenities, ...property.highlights, property.description]
          .join(' ')
          .toLowerCase()
          .includes(want.toLowerCase()),
      )
      .slice(0, 2)
    if (matched.length > 0) parts.push(`offering ${matched.join(' and ')}`)
  }

  if (parts.length === 0) {
    return `${property.title} in ${property.area} is a strong all-round match.`
  }
  return `${property.title} is ${parts.join(', ')}.`
}

function parseBudget(text: string): number | null {
  const millionMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:m|million|مليون)/)
  if (millionMatch) return Math.round(Number(millionMatch[1]) * 1_000_000)
  const kMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:k|thousand|ألف|الف)/)
  if (kMatch) return Math.round(Number(kMatch[1]) * 1_000)
  return null
}
