# Meridian Estates — Project Specification
> Use this file with Claude Code to scaffold, build, and iterate the full project.
> Every section is a self-contained instruction set. Work through phases in order.
> This is portfolio project #2 (after Dubai Adventures). It must prove capabilities the first
> project did not: heavier structured filtering, a second distinct AI pattern (structured
> extraction, not open chat), a real (non-stub) detail page, an interactive calculator, and
> proper i18n tooling.

---

## 0. Project Identity

| Field | Value |
|---|---|
| Project name | Meridian Estates |
| Tagline | Prime addresses across the Emirates |
| Type | Client demo → production-pattern real estate portal |
| Stack | Next.js 14 (App Router), TypeScript, Tailwind CSS, next-intl |
| AI layer | Structured Property Matcher — Anthropic Claude API tool-use (criteria extraction + ranked, explained results), **not** a RAG chatbot |
| Target market | UAE property buyers, renters, and investors (local + international), mobile-first |
| Demo goal | Win client; prove a second, distinct AI integration pattern, real data-heavy UX, and a genuinely interactive tool (calculator) beyond what Dubai Adventures showed |
| Portfolio role | Proves: dense structured filtering, tool-use AI, real detail pages, interactive financial tooling, proper i18n library |

---

## 1. Design System ("Blueprint & Brass")

> Before writing any component or page, load the frontend-design skill and apply these tokens exactly. Do not substitute with generic Tailwind defaults. This palette is **deliberately distinct** from Dubai Adventures' warm terracotta/desert-oasis system — real estate should feel precise, engineered, and metropolitan, not sun-warmed. Do not reuse the desert palette.

### Concept
Inspired by architectural drafting: blueprint linework, structural dimension marks, glass-tower reflections, and brass fixture hardware found in premium UAE developments. The signature visual is a technical isometric building outline — the opposite instinct of the tourism site's organic dune illustration.

### Color Tokens — extend in `tailwind.config.ts`

```ts
colors: {
  ink: {
    DEFAULT: '#10161D',   // primary dark surface, nav, footer, hero
    mid:     '#3A4552',   // secondary text on light surfaces
    light:   '#5A636F',   // tertiary text, captions — darkened from initial draft; see §1.1
  },
  brass: {
    DEFAULT: '#A9793C',   // primary accent — CTAs, active states, price highlights
    light:   '#C99A5B',
    dark:    '#7C5A2A',
  },
  steel: {
    DEFAULT: '#5B7A94',   // secondary accent — off-plan tags, links, glass/reflection motif
    light:   '#8CA7BC',
    dark:    '#3E5A70',
  },
  stone: {
    DEFAULT: '#EEEAE2',   // base background
    dark:    '#DFD9CC',   // card/section alternation
  },
  emerald: {
    DEFAULT: '#2F6E51',   // "Available" status only — the one non-token semantic color
  },
}
```

### §1.1 Color Contrast Audit (binding)

Every token pairing that touches body text, labels, or button text was checked against WCAG AA (4.5:1 for normal text, 3:1 for large text/UI components) before this palette was finalized — not left to be discovered during build. Two initial values failed the audit and were corrected above rather than shipped:

| Pairing | Ratio | Result | Rule |
|---|---|---|---|
| White text on `brass` DEFAULT (button fill) | 3.83:1 | **Fails** normal-text AA | Never fill a solid CTA button with DEFAULT `brass` + white text. Use **`brass-dark`** fill + white text instead (6.27:1 — passes) |
| `brass` DEFAULT as text color on `stone` | 3.19:1 | **Fails** AA | Never use DEFAULT `brass` for body copy, labels, or price text on light backgrounds. Use **`brass-dark`** (5.22:1 — passes) |
| `ink-light` (original `#6B7684`) on `stone` | 3.85:1 | **Fails** AA | Corrected to `#5A636F` above — now 5.07:1, passes. This is the footer-disclosure color; a disclosure that fails contrast is worse than no disclosure at all |
| `steel-dark` on `stone` | 6.03:1 | Passes | Safe for small text/links on light backgrounds |
| `ink-dark`/near-black on `brass` DEFAULT | ~5:1 | Passes | If `brass` DEFAULT must carry text (e.g. a large price badge), use dark text, not white |

**Binding role assignments that follow from this:**
- **Solid CTA buttons (Primary variant):** `brass-dark` fill, white text — this is the only combination approved for the primary Button component
- **Any brass or steel used as small text/label color on `stone` or white:** always the `-dark` variant, never DEFAULT or `-light`
- **DEFAULT and `-light` variants:** reserved for large decorative elements (18px+/bold headings where 3:1 suffices), icon fills, thin borders/dividers, and anything sitting on the dark `ink` surface, where the contrast direction flips in their favor
- Re-verify this table if any token hex is changed later — a single value swap can silently break a previously-passing pairing

### Typography — install via `next/font/google`

```ts
// app/layout.tsx
import { Space_Grotesk, Inter, IBM_Plex_Mono } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600'],
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-data',
  weight: ['400', '500'],
})
```

- Display headings: `font-display` (Space Grotesk) — H1/H2 only, tight tracking
- Body + UI copy: `font-body` (Inter)
- **Data face (signature structural device):** `font-data` (IBM Plex Mono) — used *exclusively* for numeric specs: price, sqft, beds/baths count, ROI %, monthly payment. This is content-driven, not decorative — it makes every number on the page instantly scannable as data, which is exactly how buyers scan real listings.

### Signature design element
`BlueprintSVG.tsx` — an isometric line-art building silhouette (tower + low-rise villa outline) with faint architectural dimension marks and a small crosshair reticle, rendered in `steel`/`ink` strokes at low opacity, bleeding into the hero background. One memorable visual; everything else stays disciplined around it — same restraint principle as the dune illustration, different world.

### Motion rules (binding — see also §11)
- Page-load: fade-up on hero content only, 300ms ease-out
- Listing cards: staggered fade-in on scroll, 40ms increment between cards, capped at first 6 visible — never stagger an entire 12-card grid, it reads as slow
- Card hover: `hover:scale-[1.01] transition-transform duration-150` (subtler than Dubai Adventures — a property card is a data object, not an adventure thumbnail)
- Matcher results: skeleton cards while the API call is in flight, never a spinner
- No parallax, no scroll-jacking, no auto-playing carousels
- Every animated element carries `motion-reduce:animate-none motion-reduce:transition-none`
- **Hard budget: no animation exceeds 350ms.** This is a standing project requirement, not a suggestion — see §11.

---

## 2. Project Structure

```
meridian-estates/
├── app/
│   ├── layout.tsx                  # Root layout: fonts, metadata, locale provider, floating widgets
│   ├── page.tsx                    # Landing: Hero+Matcher, Featured Listings, Trust band, Testimonial
│   ├── listings/
│   │   ├── page.tsx                # Full listings grid + filter bar
│   │   └── [slug]/
│   │       └── page.tsx            # Property detail page (real, not a stub — see §9)
│   ├── calculator/
│   │   └── page.tsx                # Mortgage + ROI calculator
│   ├── about/
│   │   └── page.tsx                # Story, agents, disclosure, trust content
│   └── contact/
│       └── page.tsx                # Lead form + Maps + contact info
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx               # Sticky nav, EN/AR toggle, "Enquire" CTA
│   │   └── Footer.tsx                # Footer incl. mandatory disclosure line (§10)
│   ├── ui/
│   │   ├── PropertyCard.tsx          # Card: thumb, status tag, specs (mono), price, CTA
│   │   ├── FilterBar.tsx             # Type / Location / Price range / Beds / Status / Purpose
│   │   ├── StatusTag.tsx             # Ready / Off-Plan / Rented pill
│   │   ├── TestimonialCard.tsx       # Star rating, quote, reviewer initials — generic "Client review" label, no third-party badge (§10)
│   │   ├── TrustBand.tsx             # 3-column ink strip: generic trust stats only (§10)
│   │   └── Button.tsx                # Primary (brass-dark fill, white text — see §1.1) + Secondary (steel-dark outline) variants
│   ├── hero/
│   │   ├── HeroSection.tsx           # Hero shell with embedded MatcherInput
│   │   └── BlueprintSVG.tsx          # Signature isometric line-art component
│   ├── matcher/
│   │   ├── MatcherWidget.tsx         # Input + results panel (§5)
│   │   ├── MatchResultCard.tsx       # Property + one-line "why this fits" from the API
│   │   └── useMatcher.ts             # Hook: manages query, API call, loading/skeleton state
│   ├── calculator/
│   │   ├── MortgageCalculator.tsx    # Price / down payment / rate / tenure → monthly payment
│   │   └── ROICalculator.tsx         # Price / annual rent → gross yield %
│   └── floating/
│       └── WhatsAppFAB.tsx           # Fixed bottom-right WhatsApp button
├── lib/
│   ├── properties.ts                 # Static data: all listings (type: Property)
│   ├── agents.ts                     # Static data: 3 agent profiles
│   ├── matcher-api.ts                # Claude API wrapper: tool-use criteria extraction + scoring
│   ├── matcher-logic.ts              # Deterministic scoring/ranking function (not LLM)
│   ├── mortgage-math.ts              # Pure functions: amortization + yield calculations
│   ├── whatsapp.ts                   # buildWhatsAppLink() helper
│   └── i18n/
│       ├── messages/en.json
│       └── messages/ar.json
├── types/
│   └── index.ts                      # Shared TypeScript types
├── public/
│   └── images/
│       ├── gallery/                  # Property gallery SVG placeholders
│       └── floorplans/               # Floor plan SVG placeholders
└── tailwind.config.ts
```

---

## 3. TypeScript Types (`types/index.ts`)

```ts
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
  area: string                  // e.g. 'Downtown Dubai', 'Yas Island'
  emirate: 'Dubai' | 'Abu Dhabi'
  developer: string             // fictional — see §10
  priceAED: number
  sizeSqft: number
  beds: number
  baths: number
  floor?: number
  handoverQuarter?: string      // e.g. 'Q3 2027', only for OffPlan
  amenities: string[]
  description: string
  highlights: string[]
  grossYieldEstimate?: number   // percent, investor-facing content
  agentId: string
  featured?: boolean
  thumbColor: string            // gradient class, decorative placeholder (§9)
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
  clientInitials: string        // initials only — see §10 disclosure rules
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
  whyItFits: string             // one-sentence, generated per match
}
```

---

## 4. Static Data (`lib/properties.ts`)

Populate with these 8 listings minimum. Realistic AED pricing and UAE-accurate specs:

```ts
export const properties: Property[] = [
  {
    id: 'p1', slug: 'downtown-dubai-1br-boulevard',
    title: '1BR Boulevard View', type: 'Apartment', purpose: 'Buy', status: 'Ready',
    area: 'Downtown Dubai', emirate: 'Dubai', developer: 'Palmara Developments',
    priceAED: 1850000, sizeSqft: 780, beds: 1, baths: 2, floor: 22,
    amenities: ['Infinity pool', 'Gym', 'Concierge', 'Burj Khalifa view'],
    description: 'A quiet corner unit above the Boulevard, with direct sightlines to the Fountain...',
    highlights: ['Fountain view balcony', 'Vacant on transfer', 'Chiller-free'],
    grossYieldEstimate: 6.2, agentId: 'a1', featured: true,
    thumbColor: 'from-slate-800 to-steel-dark',
  },
  {
    id: 'p2', slug: 'palm-jumeirah-signature-villa',
    title: 'Signature Frond Villa', type: 'Villa', purpose: 'Buy', status: 'Ready',
    area: 'Palm Jumeirah', emirate: 'Dubai', developer: 'Vantage Coastal Group',
    priceAED: 15200000, sizeSqft: 6100, beds: 5, baths: 6,
    amenities: ['Private beach', 'Pool', 'Maid\'s room', 'Boat mooring'],
    description: 'Frond-tip privacy with an open Gulf horizon and a private mooring...',
    highlights: ['Private beach frontage', 'Renovated 2025', 'Maid & driver quarters'],
    grossYieldEstimate: 4.1, agentId: 'a2', featured: true,
    thumbColor: 'from-brass-dark to-brass',
  },
  {
    id: 'p3', slug: 'dubai-hills-off-plan-townhouse',
    title: 'Parkside Townhouse (Off-Plan)', type: 'Townhouse', purpose: 'Buy', status: 'OffPlan',
    area: 'Dubai Hills Estate', emirate: 'Dubai', developer: 'Skyline Estates Group',
    priceAED: 2650000, sizeSqft: 2400, beds: 3, baths: 4, handoverQuarter: 'Q4 2027',
    amenities: ['Community park', 'Pool', 'Retail podium'],
    description: 'A three-bedroom townhouse fronting the central park, on a post-handover plan...',
    highlights: ['60/40 payment plan', 'Golf course community', 'Post-handover option'],
    grossYieldEstimate: 5.8, agentId: 'a1',
    thumbColor: 'from-emerald-800 to-steel',
  },
  {
    id: 'p4', slug: 'business-bay-studio-canal',
    title: 'Canal-Facing Studio', type: 'Apartment', purpose: 'Rent', status: 'Ready',
    area: 'Business Bay', emirate: 'Dubai', developer: 'Palmara Developments',
    priceAED: 95000, sizeSqft: 480, beds: 0, baths: 1, floor: 14,
    amenities: ['Canal walk access', 'Gym', 'Covered parking'],
    description: 'A studio built for the canal-side lifestyle, walking distance to the boardwalk...',
    highlights: ['Furnished option available', 'Metro-adjacent', 'Chiller-free'],
    agentId: 'a3',
    thumbColor: 'from-steel-dark to-ink',
  },
  {
    id: 'p5', slug: 'arabian-ranches-family-villa',
    title: '4BR Courtyard Villa', type: 'Villa', purpose: 'Buy', status: 'Ready',
    area: 'Arabian Ranches', emirate: 'Dubai', developer: 'Vantage Coastal Group',
    priceAED: 4400000, sizeSqft: 3800, beds: 4, baths: 5,
    amenities: ['Private garden', 'Community pool', 'Golf course', 'Schools nearby'],
    description: 'A courtyard-style family villa in a gated community walking distance to two schools...',
    highlights: ['Walking distance to Ranches Primary', 'Landscaped garden', 'Gated community'],
    grossYieldEstimate: 5.1, agentId: 'a2', featured: true,
    thumbColor: 'from-brass to-stone-dark',
  },
  {
    id: 'p6', slug: 'yas-island-waterfront-apartment',
    title: '2BR Waterfront Apartment', type: 'Apartment', purpose: 'Buy', status: 'Ready',
    area: 'Yas Island', emirate: 'Abu Dhabi', developer: 'Skyline Estates Group',
    priceAED: 2100000, sizeSqft: 1350, beds: 2, baths: 3, floor: 8,
    amenities: ['Marina walk', 'Pool', 'Gym', 'Retail podium'],
    description: 'A waterfront apartment steps from the marina walk and Yas Mall...',
    highlights: ['Marina views', 'Near Ferrari World & Yas Marina Circuit', 'Rented until 2027'],
    grossYieldEstimate: 6.7, agentId: 'a3',
    thumbColor: 'from-steel to-emerald-800',
  },
  {
    id: 'p7', slug: 'saadiyat-island-beach-penthouse',
    title: 'Beachfront Penthouse', type: 'Penthouse', purpose: 'Buy', status: 'Ready',
    area: 'Saadiyat Island', emirate: 'Abu Dhabi', developer: 'Vantage Coastal Group',
    priceAED: 9800000, sizeSqft: 4200, beds: 4, baths: 5, floor: 12,
    amenities: ['Private beach club', 'Rooftop terrace', 'Museum district access'],
    description: 'A duplex penthouse minutes from the Saadiyat cultural district and beach club...',
    highlights: ['Full sea-facing terrace', 'Near Louvre Abu Dhabi', 'Duplex layout'],
    grossYieldEstimate: 4.6, agentId: 'a2',
    thumbColor: 'from-ink to-steel-dark',
  },
  {
    id: 'p8', slug: 'al-reem-island-1br-offplan',
    title: 'Reem Central 1BR (Off-Plan)', type: 'Apartment', purpose: 'Buy', status: 'OffPlan',
    area: 'Al Reem Island', emirate: 'Abu Dhabi', developer: 'Skyline Estates Group',
    priceAED: 1150000, sizeSqft: 720, beds: 1, baths: 2, handoverQuarter: 'Q2 2028',
    amenities: ['Infinity pool', 'Padel court', 'Co-working lounge'],
    description: 'An entry-level investment unit in a rapidly maturing island community...',
    highlights: ['1% monthly payment plan', 'Sea corridor glimpse', 'High rental demand area'],
    grossYieldEstimate: 7.1, agentId: 'a1',
    thumbColor: 'from-brass-light to-steel',
  },
]
```

---

## 5. AI Property Matcher (`lib/matcher-api.ts`)

**This is the deliberate architectural departure from Dubai Adventures.** That project used open-ended RAG chat. This project proves a *structured extraction + deterministic ranking* pattern — closer to what a real product would ship, and a different skill signal entirely.

### Pipeline
1. User types a natural-language need into `MatcherInput` (e.g. *"3 bed villa near good schools, budget around 4.5 million"*)
2. POST to `/api/matcher`
3. Route calls Claude with a forced tool definition, `extract_property_criteria`, so the model returns **structured JSON only** for the criteria — not prose:

```ts
const tools = [{
  name: 'extract_property_criteria',
  description: 'Extract structured property search criteria from a natural-language buyer query.',
  input_schema: {
    type: 'object',
    properties: {
      propertyType: { type: 'string', enum: ['Apartment', 'Villa', 'Townhouse', 'Penthouse'] },
      purpose: { type: 'string', enum: ['Buy', 'Rent'] },
      minBudgetAED: { type: 'number' },
      maxBudgetAED: { type: 'number' },
      minBeds: { type: 'number' },
      area: { type: 'string' },
      mustHaves: { type: 'array', items: { type: 'string' } },
    },
  },
}]
```

4. The route passes the extracted `MatchCriteria` into `matcher-logic.ts` — a **deterministic, non-LLM** scoring function that ranks `properties` by criteria match (budget proximity, bed count, area match, amenity overlap). The LLM never picks the properties; it only parses intent. This is the single most important trade-off in this section — see §14 for the full reasoning.
5. For the top 3 results, one more short Claude call (or a follow-up turn in the same call) generates a one-sentence `whyItFits` per property, grounded strictly in that property's actual data — never invented details.
6. Response shape: `{ criteria: MatchCriteria, results: MatchResult[] }`

### Resilience (same demo-safety pattern as Dubai Adventures)
- If `ANTHROPIC_API_KEY` is missing or the call throws, the route still returns HTTP 200 with a graceful fallback: run `matcher-logic.ts` against a naive keyword-only criteria guess, and set `fallback: true` on the response so the widget can show a subtle "showing best-guess matches" note instead of breaking.
- **Before any client call:** verify the real key is live and test at least two distinct queries (a villa query and a rental/studio query) so the tool-use extraction is demonstrably working, not just the fallback path.

---

## 6. Mortgage & ROI Calculator (`lib/mortgage-math.ts`)

Pure client-side functions — no API call, fully deterministic, but genuinely interactive. This is the feature that speaks directly to investor-minded UAE buyers.

```ts
export function monthlyPayment(priceAED: number, downPaymentPct: number, annualRatePct: number, tenureYears: number): number {
  const principal = priceAED * (1 - downPaymentPct / 100)
  const monthlyRate = annualRatePct / 100 / 12
  const n = tenureYears * 12
  if (monthlyRate === 0) return principal / n
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
}

export function grossRentalYield(annualRentAED: number, priceAED: number): number {
  return (annualRentAED / priceAED) * 100
}

export function dldTransferFeeEstimate(priceAED: number): number {
  return priceAED * 0.04 // Dubai Land Department 4% transfer fee — public regulation, not a company claim
}
```

- UI: sliders/inputs for price (auto-filled if arriving from a property detail page), down payment %, interest rate %, tenure years — output updates live, debounced 100ms, no page reload
- All monetary output rendered in `font-data` (IBM Plex Mono), AED-formatted via `next-intl`'s number formatter
- Label every output "Estimate" — never implies these are live bank rates (see §14, item 9)

---

## 7. Pages

- **Home (`/`):** Hero with `BlueprintSVG` + `MatcherInput` inline (the matcher is the thesis of the whole site — lead with it), Featured Listings (3 cards, `featured: true`), TrustBand, one Testimonial, a "Try the Mortgage Calculator" teaser card.
- **Listings (`/listings`):** Full `FilterBar` (Type / Location / Price range / Beds / Status / Purpose, all client-side state) + grid of all 8 properties. Default: all, unfiltered.
- **Property Detail (`/listings/[slug]`):** **Real page, not a stub** (see §9) — gallery, floor plan, full specs in `font-data`, agent card, amenities list, similar-properties rail, "Request a Viewing" WhatsApp CTA, and a calculator shortcut pre-filled with this property's price.
- **Calculator (`/calculator`):** Standalone Mortgage + ROI tools, also linkable with a pre-filled price via query param.
- **About (`/about`):** Story, 3 agent profiles, the mandatory disclosure block (§10).
- **Contact (`/contact`):** Lead form (no `<form>` tag, same controlled-input pattern as Dubai Adventures), keyless Maps embed, WhatsApp/phone/email row.

---

## 8. i18n (EN/AR, `next-intl`)

Upgrading from Dubai Adventures' hand-rolled string map — this is a deliberate improvement, see §14 item 4.

- `lib/i18n/messages/en.json` and `ar.json` — full key parity required; no visible English fallback in AR mode
- Use `next-intl`'s `NextIntlClientProvider` in "no-routing" mode: locale held in React context + `localStorage`, not a `/en` `/ar` path split — keeps the demo simple while still getting real number/currency formatting
- **Currency formatting is the reason this upgrade matters:** AED figures must format correctly per locale (`Intl.NumberFormat` under the hood via `next-intl`), and Arabic numerals must render correctly in RTL context — this was not properly solvable with the tourism site's basic string map
- RTL layout: mirrored nav, filter bar, and card layout; `font-data` numerals stay LTR-embedded inside RTL text (standard practice — prices read left-to-right even in Arabic UI), verify this explicitly during QA
- If a translation is uncertain, use clear MSA rendering — never leave an English fallback visible

---

## 9. Property Detail Page — full build, not a stub

Dubai Adventures stubbed its experience detail pages as "coming soon" — acceptable there because the card + WhatsApp flow carried the conversion. **That pattern does not work for real estate:** buyers expect floor plans, full specs, and agent contact before they'll take a viewing seriously. A stub here would visibly undercut the whole demo's credibility. Build:

- Image gallery: 4–6 local SVG placeholders (same `blurDataURL` + explicit width/height pattern as Dubai Adventures §13.6), clearly styled as illustrative
- Floor plan: one SVG placeholder styled as a simple technical line drawing (ties back to the Blueprint concept — this one is *supposed* to look like a schematic, so the placeholder approach actually fits the content type honestly)
- Full spec block in `font-data`: price, price/sqft (computed), size, beds, baths, floor, status, handover quarter if off-plan
- Agent card: photo-color-block + initials (same pattern as Dubai Adventures guide cards), name, years experience, languages, direct WhatsApp button
- Similar properties rail: 3 cards from the same `area` or `type`, client-computed
- Primary CTA: "Request a Viewing" → WhatsApp deep link pre-filled with the property title (see §12) — **not** a full booking calendar. That capability is deliberately reserved for the next portfolio project (clinic booking site) so each demo proves a distinct skill instead of overlapping. A simple "preferred date" text field feeding into the WhatsApp message is enough here.

---

## 10. Content Authenticity & Disclosure (binding)

Directly addressing the lesson from Dubai Adventures: fictional trust content must be labeled, and must never borrow the name of a real regulator or platform as if it were a real credential.

- **Footer disclosure, every page:** *"Meridian Estates is a concept portfolio project built to demonstrate real estate web and AI patterns. Listings, pricing, agent profiles, and client reviews are illustrative and not affiliated with any real brokerage."* Rendered in `ink-light`, small but fully legible (AA contrast still required — a disclosure that fails contrast is worse than no disclosure).
- **TrustBand stats:** generic only — e.g. *"500+ Transactions Facilitated"*, *"AED 2B+ in Property Represented"*, *"Locally Licensed & Regulated"*. **Never** name a specific real regulatory body (no "RERA-certified," no real DLD registration numbers) as if Meridian Estates holds it — that crosses from "demo content" into "false regulatory claim." The DLD 4% transfer fee in §6 is fine because it states a public rule, not a claim about this company.
- **Testimonials:** initials + origin only, no invented surnames, no claimed third-party verification badge (no fake "Google Reviews verified" or platform logo). Label the section "Client Reviews" — generic, not attributed to a specific real platform.
- **Developer names** (`Palmara Developments`, `Vantage Coastal Group`, `Skyline Estates Group`): fictional, plausible-sounding, deliberately not matching any real UAE developer name.
- When pitching this to the UAE company, say the sentence out loud before they ask: *"This is a concept build — all listings and reviews are illustrative."* One sentence, said first, reads as more professional than being asked.

---

## 11. Animation & Performance Budget (binding — standing project requirement)

Per project-wide standing instruction: **every demo site must include animation, and animation must never cost perceived speed.** This section is the enforcement mechanism, not a suggestion.

- Hard ceiling: **no single animation exceeds 350ms.** Page-load fade-up: 300ms. Card hover: 150ms. Matcher skeleton-to-result swap: 200ms crossfade.
- Card grid stagger capped at the first 6 visible cards, 40ms increments — beyond 6, all remaining cards render immediately, not staggered. Staggering a full 8–12 card grid reads as slow, not polished.
- Matcher and calculator both use **skeleton states**, never spinners, for any in-flight computation — even the client-side calculator math (which is instant) gets a 100ms debounce so rapid slider drags don't cause visual thrash, not because it's slow.
- No parallax, no scroll-jacking, no auto-advancing carousels anywhere on the site — these are the most common cause of perceived lag on mobile and are explicitly out of scope.
- `prefers-reduced-motion` respected on every animated element without exception.
- Definition of done for this section: on a throttled mobile CPU profile in dev tools, no interaction (filter tap, matcher submit, calculator slider) should visually block for more than one frame before showing *some* feedback (skeleton, disabled state, or the result itself).

---

## 12. WhatsApp Link Rules

Same helper pattern as Dubai Adventures, extended for real-estate-specific contexts:

```ts
// lib/whatsapp.ts
export function buildWhatsAppLink(message: string): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
```

- Demo number ships in `.env.local` (valid UAE mobile format); `.env.example` documents all vars
- Per-context messages:
  - Property detail "Request a Viewing" → *"Marhaba! I'd like to arrange a viewing for {propertyTitle}. My preferred date is {preferredDate}."*
  - PropertyCard quick-enquire → *"Hi! I'm interested in {propertyTitle} — could you share more details?"*
  - Nav/Contact general → *"Marhaba! I'd like to speak with a Meridian Estates advisor."*
- All links go through the single helper; number never hardcoded; message always `encodeURIComponent`-ed

---

## 13. Accessibility Floor (applies to every component)

Same standard as Dubai Adventures, non-negotiable:

- Visible keyboard focus rings (token-colored) on all interactive elements
- Semantic landmarks (`header`/`nav`/`main`/`footer`)
- `alt`/`title`/`aria-label` on all non-text content, including the SVG floor plan and gallery placeholders
- AA color contrast against the Blueprint & Brass tokens — already audited and resolved in §1.1 (two token values were corrected there); re-check any future token change against that table before shipping it
- Reduced motion respected everywhere (§11)
- Target Lighthouse Accessibility 100

---

## 14. Trade-off Ledger (binding — every major decision, documented)

This section exists because this project is a portfolio centerpiece: being able to explain *why* each technical choice was made — not just that it works — is itself part of what should impress the client.

| # | Decision | Pros | Cons | Verdict |
|---|---|---|---|---|
| 1 | Static TS array (`properties.ts`) vs. headless CMS | Zero infra, instant demo, fully type-safe, no external dependency to fail during a live pitch | Not how a real production listings site would scale past a few dozen units; editing requires a code change | Static for the demo. State explicitly to the client that production would move to a headless CMS (Sanity/Contentful) with this exact TypeScript shape as the schema — the migration path is trivial precisely *because* the types are already correct |
| 2 | Client-side filtering vs. server/DB-side filtering | Instant UX, zero API round-trips, simple state management | Doesn't scale past a few hundred listings; no per-filter SSR/SEO URLs | Client-side, appropriate at 8-listing demo scale. Documented as a known limitation, not an oversight |
| 3 | Structured tool-use matcher vs. open RAG chat (Dubai Adventures' pattern) | Deterministic and explainable (LLM parses intent, code ranks results — the model never "picks" a home), cheaper per query, proves a second distinct AI integration pattern | Less conversational/exploratory than a chat interface; a user can't easily ask a follow-up in the same free-form way | Chosen deliberately — this is the single most important differentiator versus the first portfolio project |
| 4 | `next-intl` vs. hand-rolled string map (Dubai Adventures' approach) | Real pluralization and number/currency formatting, which matters far more on a price-heavy real estate site than a tourism site; scales properly | More setup, slightly larger bundle | Upgrade justified. Explicitly framed to the client as "we learned from project one and improved the pattern" — this is a *strength* to say out loud, not a thing to hide |
| 5 | SVG/illustration property imagery vs. real photography | Zero licensing risk, consistent visual system, fast load, no ambiguity about whether a specific real building is being depicted | Real estate buyers expect real photography more than tourism site visitors expect real safari photos — this is a bigger visual gap here than on Dubai Adventures | Keep illustration for the demo, but flag this explicitly and proactively as the one thing that would change first in a real client engagement (licensed photography or client-supplied assets) |
| 6 | Full property detail page vs. "coming soon" stub | A real detail page is where a real estate site earns credibility | More build time, more edge cases (agent lookup, similar-properties logic) | Build the real page — no stub. See §9 for the full reasoning; this is the clearest case where copying the first project's shortcut would have hurt the second |
| 7 | Generic trust language vs. naming real regulators (RERA, DLD) as Meridian's own credentials | Naming a real regulator sounds more authoritative at a glance | Falsely implying a fictional brokerage holds a real license or registration is a genuine credibility and (if ever mistaken for real) legal risk | Generic descriptive language only, ever. The one public regulatory fact used (DLD's 4% transfer fee in the calculator) is stated as general public information, not a claim about this company — see §10 |
| 8 | Keyless single-property Maps embed vs. full Maps JS API with clustered pins | Zero setup, works immediately with no API key required for the demo | No interactive multi-listing map view with clustering | Keyless embed on the detail page for the demo. Note to client: production would add the JS API for a clustered map view on `/listings` |
| 9 | Client-side mortgage math vs. live bank-rate API | No external dependency, instant, still genuinely interactive and useful | Rates are illustrative, not live | Client-side, every output labeled "Estimate" in the UI copy itself, not just in a footnote |
| 10 | Controlled-input form (no `<form>` tag) vs. native HTML form | Full control over validation states and no native-form quirks; consistent with Dubai Adventures | More boilerplate; accessibility (labels, `aria-invalid`) must be handled by hand | Same pattern as project one, for architectural consistency across the whole portfolio — a client reviewing multiple demos should recognize a consistent engineering philosophy |
| 11 | Monospace (`font-data`) exclusively for numeric specs | Instantly signals "this is data" — beds/baths/price/sqft become scannable the way a real listing site trains users to expect | Three type families total is one more than Dubai Adventures used; risks looking busy if not restrained | Used *only* for numbers, nowhere else — restraint is the point, not the mono font itself |
| 12 | Restrained animation budget (§11) vs. heavier motion (parallax, 3D tilt, auto-carousels) | Fast perceived performance, professional feel, directly satisfies the standing no-lag requirement | Less immediately flashy than heavier motion trends | Restrained, per standing project instruction — this is not negotiable per current guidance |
| 13 | Heavy client-component boundary for i18n-reactive text (same as Dubai Adventures) | Familiar, consistent pattern; server-rendered page shells stay SEO-friendly | Nearly every visible text leaf still ends up client-rendered, same reconciliation note as project one | Same documented approach — consistency across the portfolio is itself a signal of engineering maturity |
| 14 | Simple "preferred date" field vs. full viewing-booking calendar | Keeps this project's scope focused on its actual differentiators (matcher, calculator, i18n) | Less impressive in isolation than a real calendar system | Deliberately deferred to the next portfolio project (clinic booking site), so real calendar/booking logic becomes *that* project's differentiator instead of diluting this one |
| 15 | Ship the initial "Blueprint & Brass" hex values as drafted vs. run a formal WCAG contrast audit before build | Drafted values were chosen for aesthetic intent and looked correct at a glance | Two pairings actually failed AA when measured (brass-on-stone text, and the original `ink-light` footer-disclosure color) — the kind of bug that only surfaces in a Lighthouse run late in the build | Audited every text/button pairing up front (§1.1), corrected both failures before Phase 1 starts. Costs nothing at spec stage; costs real rework if caught after components are built |

---

## 15. Definition of Done Per Phase

`npx tsc --noEmit` clean at the end of every phase. Zero console errors in dev. Visual check conceptually at 390px and 1280px. Final phase additionally requires `next build` clean (zero errors/warnings) and a manual pass through §11's animation budget and §13's accessibility floor. Each phase ends with a written summary and waits for confirmation before the next.

- **Phase 1:** Scaffold, design tokens, fonts, types, project structure
- **Phase 2:** Static data (`properties.ts`, `agents.ts`), Listings page + FilterBar, PropertyCard
- **Phase 3:** Property Detail page (full build per §9) + similar-properties logic
- **Phase 4:** AI Matcher — API route, tool-use extraction, deterministic ranking, resilience fallback (§5)
- **Phase 5:** Mortgage + ROI Calculator (§6), linkable from property detail pages
- **Phase 6:** Contact page + lead form + Maps + WhatsApp integration (§12), full `next-intl` EN/AR pass (§8), TrustBand + disclosure (§10), final accessibility + animation QA (§§11, 13), `next build` clean

---

## 16. Pre-Pitch Checklist (do this before showing the UAE company)

- [ ] `ANTHROPIC_API_KEY` live and tested with at least 2 distinct matcher queries (one villa/buy, one studio/rent)
- [ ] Footer disclosure visible and legible on every page
- [ ] TrustBand copy re-read for any accidental real-regulator naming
- [ ] Mortgage calculator labeled "Estimate" throughout, not just once
- [ ] AR toggle checked on the property detail page specifically — it has the most numeric content and is the highest-risk page for RTL/number-formatting bugs
- [ ] One sentence ready to say first, unprompted: "This is a concept build — listings and reviews are illustrative, used to demonstrate the technical patterns."
