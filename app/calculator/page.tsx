import type { Metadata } from 'next'
import { CalculatorView } from './CalculatorView'

// Server component shell (§14 item 13): owns metadata and parses the ?price= query param
// the property detail page links with (§6, §9). The interactive tools live in the
// CalculatorView client island.
export const metadata: Metadata = {
  title: 'Mortgage & ROI Calculator',
  description:
    'Estimate monthly mortgage payments and gross rental yield for UAE property. Estimates for guidance, not live bank rates.',
}

// Fallback price when the calculator is opened standalone (no ?price=). A mid-market
// figure so the sliders start somewhere sensible.
const DEFAULT_PRICE = 1_850_000

interface PageProps {
  searchParams: { price?: string }
}

function parsePrice(raw: string | undefined): { price: number; prefilled: boolean } {
  if (!raw) return { price: DEFAULT_PRICE, prefilled: false }
  const parsed = Number(raw)
  // Guard against non-numeric, negative, or absurd values from a hand-edited URL.
  if (!Number.isFinite(parsed) || parsed < 100_000 || parsed > 100_000_000) {
    return { price: DEFAULT_PRICE, prefilled: false }
  }
  return { price: parsed, prefilled: true }
}

export default function CalculatorPage({ searchParams }: PageProps) {
  const { price, prefilled } = parsePrice(searchParams.price)
  return <CalculatorView initialPrice={price} prefilled={prefilled} />
}
