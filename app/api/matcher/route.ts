import { NextResponse } from 'next/server'
import type { MatchCriteria, MatcherResponse, MatchResult } from '@/types'
import { extractCriteria, generateExplanations } from '@/lib/matcher-api'
import {
  buildWhyItFits,
  guessCriteria,
  rankProperties,
  type ScoredProperty,
} from '@/lib/matcher-logic'

// POST /api/matcher — the AI Property Matcher pipeline (§5).
//
// Full path:  query → LLM function-call extraction → deterministic ranking → LLM
//             grounded explanations → { criteria, results, fallback: false }
// Fallback:   if the key is missing or ANY LLM call throws, we still return HTTP 200
//             with keyword-guessed criteria, deterministically-ranked results, and
//             deterministic explanations, flagged fallback: true (§5 resilience). The
//             widget then shows a subtle "best-guess" note instead of breaking.
//
// The LLM only ever parses intent; ranking is always the deterministic function, on
// both paths — the model never picks properties (§14 item 3).

export const runtime = 'nodejs'

function buildResults(
  scored: ScoredProperty[],
  explanations: Map<string, string> | null,
  criteria: MatchCriteria,
): MatchResult[] {
  return scored.map((entry) => ({
    property: entry.property,
    whyItFits:
      explanations?.get(entry.property.id) ?? buildWhyItFits(entry, criteria),
  }))
}

export async function POST(request: Request): Promise<NextResponse<MatcherResponse>> {
  let query = ''
  try {
    const body = (await request.json()) as { query?: unknown }
    if (typeof body.query === 'string') query = body.query.trim()
  } catch {
    // Malformed body — treated as an empty query, which the ranker handles gracefully.
  }

  // ── Primary path: LLM extraction + grounded explanations ──
  try {
    if (!query) throw new Error('Empty query')

    const criteria = await extractCriteria(query)
    const scored = rankProperties(criteria, 3)

    // Grounded explanations are best-effort: if this second call fails we keep the
    // (successful) LLM-extracted criteria and ranking, and only the sentences fall back
    // to deterministic — so we do NOT flip the whole response to fallback: true.
    let explanations: Map<string, string> | null = null
    try {
      explanations = await generateExplanations(scored, criteria)
    } catch {
      explanations = null
    }

    return NextResponse.json({
      criteria,
      results: buildResults(scored, explanations, criteria),
      fallback: false,
    })
  } catch {
    // ── Fallback path: fully deterministic, never throws ──
    const criteria = guessCriteria(query)
    const scored = rankProperties(criteria, 3)
    return NextResponse.json({
      criteria,
      results: buildResults(scored, null, criteria),
      fallback: true,
    })
  }
}
