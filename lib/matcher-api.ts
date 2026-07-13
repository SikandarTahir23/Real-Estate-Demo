import type { MatchCriteria, Property } from '@/types'
import type { ScoredProperty } from '@/lib/matcher-logic'
import { callTool, type ToolDefinition } from '@/lib/ai'

// LLM wrapper for the matcher (spec §5), now backed by the shared Grok client in
// lib/ai.ts. The §5 architecture is unchanged by the provider swap (previously
// Anthropic, then Gemini, now Grok): both functions use FORCED tool-calling — a
// single tool pinned via tool_choice — so the model returns structured arguments,
// never prose. The LLM only parses intent; matcher-logic.ts still does all ranking.
// Only the transport lives here, and it's now the provider-agnostic lib/ai.ts.
//
//   1. extractCriteria      — parse a natural-language query into MatchCriteria (§5 step 3)
//   2. generateExplanations — one grounded "why it fits" sentence per top result (§5 step 5)
//
// Both functions THROW on any failure (missing key, non-200, malformed output) so the
// API route can catch and run the deterministic fallback path (§5 resilience).

// ── 1. Criteria extraction ────────────────────────────────────────────────────────

const EXTRACT_TOOL: ToolDefinition = {
  type: 'function',
  function: {
    name: 'extract_property_criteria',
    description:
      'Extract structured property search criteria from a natural-language buyer query.',
    parameters: {
      type: 'object',
      properties: {
        propertyType: {
          type: 'string',
          enum: ['Apartment', 'Villa', 'Townhouse', 'Penthouse'],
        },
        purpose: { type: 'string', enum: ['Buy', 'Rent'] },
        minBudgetAED: { type: 'number' },
        maxBudgetAED: { type: 'number' },
        minBeds: { type: 'number' },
        area: { type: 'string' },
        mustHaves: { type: 'array', items: { type: 'string' } },
      },
    },
  },
}

// Normalise the raw tool args into a typed MatchCriteria, dropping anything malformed
// so a partial extraction still produces usable criteria.
function normaliseCriteria(input: unknown): MatchCriteria {
  const raw = (input ?? {}) as Record<string, unknown>
  const criteria: MatchCriteria = {}

  const types = ['Apartment', 'Villa', 'Townhouse', 'Penthouse']
  if (typeof raw.propertyType === 'string' && types.includes(raw.propertyType)) {
    criteria.propertyType = raw.propertyType as MatchCriteria['propertyType']
  }
  if (raw.purpose === 'Buy' || raw.purpose === 'Rent') {
    criteria.purpose = raw.purpose
  }
  if (typeof raw.minBudgetAED === 'number' && raw.minBudgetAED > 0) {
    criteria.minBudgetAED = raw.minBudgetAED
  }
  if (typeof raw.maxBudgetAED === 'number' && raw.maxBudgetAED > 0) {
    criteria.maxBudgetAED = raw.maxBudgetAED
  }
  if (typeof raw.minBeds === 'number' && raw.minBeds >= 0) {
    criteria.minBeds = Math.round(raw.minBeds)
  }
  if (typeof raw.area === 'string' && raw.area.trim().length > 0) {
    criteria.area = raw.area.trim()
  }
  if (Array.isArray(raw.mustHaves)) {
    const cleaned = raw.mustHaves.filter(
      (item): item is string => typeof item === 'string' && item.trim().length > 0,
    )
    if (cleaned.length > 0) criteria.mustHaves = cleaned
  }

  return criteria
}

export async function extractCriteria(query: string): Promise<MatchCriteria> {
  const args = await callTool(
    [
      {
        role: 'system',
        content:
          'You extract structured UAE real-estate search criteria from a buyer query. ' +
          'Budgets are in AED. Only include fields the query actually implies.',
      },
      { role: 'user', content: `Query: "${query}"` },
    ],
    EXTRACT_TOOL,
  )

  return normaliseCriteria(args)
}

// ── 2. Grounded explanations ──────────────────────────────────────────────────────

const EXPLAIN_TOOL: ToolDefinition = {
  type: 'function',
  function: {
    name: 'explain_matches',
    description:
      'Provide one short, factual sentence per property explaining why it fits the buyer, ' +
      'using only the provided property facts. Never invent details.',
    parameters: {
      type: 'object',
      properties: {
        explanations: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              whyItFits: { type: 'string' },
            },
            required: ['id', 'whyItFits'],
          },
        },
      },
      required: ['explanations'],
    },
  },
}

// A compact, factual view of each candidate so the model has real data to ground on and
// no room to invent — only fields that exist on the Property.
function propertyFacts(property: Property) {
  return {
    id: property.id,
    title: property.title,
    type: property.type,
    purpose: property.purpose,
    status: property.status,
    area: property.area,
    emirate: property.emirate,
    priceAED: property.priceAED,
    beds: property.beds,
    baths: property.baths,
    sizeSqft: property.sizeSqft,
    amenities: property.amenities,
    highlights: property.highlights,
    ...(property.grossYieldEstimate !== undefined && {
      grossYieldEstimate: property.grossYieldEstimate,
    }),
    ...(property.handoverQuarter && { handoverQuarter: property.handoverQuarter }),
  }
}

// Returns a map of propertyId -> whyItFits. Throws on failure so the caller can fall
// back to the deterministic buildWhyItFits().
export async function generateExplanations(
  scored: ScoredProperty[],
  criteria: MatchCriteria,
): Promise<Map<string, string>> {
  const facts = scored.map((s) => propertyFacts(s.property))

  const args = await callTool<{
    explanations?: Array<{ id?: unknown; whyItFits?: unknown }>
  }>(
    [
      {
        role: 'system',
        content:
          'You explain why each property fits a buyer, using ONLY the facts given. ' +
          'Do not invent amenities, views, or numbers. One concise sentence (max ~20 ' +
          'words) per property, referenced by its id.',
      },
      {
        role: 'user',
        content:
          `A buyer searched with these criteria: ${JSON.stringify(criteria)}.\n` +
          `Matched properties as JSON facts:\n${JSON.stringify(facts)}`,
      },
    ],
    EXPLAIN_TOOL,
  )

  const map = new Map<string, string>()
  for (const item of args.explanations ?? []) {
    if (typeof item.id === 'string' && typeof item.whyItFits === 'string') {
      map.set(item.id, item.whyItFits.trim())
    }
  }
  if (map.size === 0) {
    throw new Error('explain_matches returned no usable explanations')
  }
  return map
}
