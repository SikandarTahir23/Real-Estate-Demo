// Pure mortgage & ROI math (spec §6). No API calls, no state — fully deterministic and
// unit-testable. Rates are illustrative, not live bank rates (§14 item 9): every UI
// output built on these is labelled "Estimate".
//
// The three exported functions below are verbatim from §6. The derived helpers beneath
// exist only to keep the UI components free of arithmetic (composition over duplication).

// Monthly amortized payment for a repayment mortgage. Handles the 0% edge case (straight
// division) so a zero-rate input never divides by zero.
export function monthlyPayment(
  priceAED: number,
  downPaymentPct: number,
  annualRatePct: number,
  tenureYears: number,
): number {
  const principal = priceAED * (1 - downPaymentPct / 100)
  const monthlyRate = annualRatePct / 100 / 12
  const n = tenureYears * 12
  if (monthlyRate === 0) return principal / n
  return (
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, n))) /
    (Math.pow(1 + monthlyRate, n) - 1)
  )
}

export function grossRentalYield(annualRentAED: number, priceAED: number): number {
  return (annualRentAED / priceAED) * 100
}

export function dldTransferFeeEstimate(priceAED: number): number {
  return priceAED * 0.04 // Dubai Land Department 4% transfer fee — public regulation, not a company claim
}

// ── Derived helpers (UI-only) ──────────────────────────────────────────────────────

// Loan principal = price minus the down payment.
export function loanAmount(priceAED: number, downPaymentPct: number): number {
  return priceAED * (1 - downPaymentPct / 100)
}

// Absolute down payment in AED, for display alongside the percentage.
export function downPaymentAmount(priceAED: number, downPaymentPct: number): number {
  return priceAED * (downPaymentPct / 100)
}

// Total interest paid over the full tenure — monthly payment × months, minus principal.
// Clamped at zero to avoid a tiny negative from floating-point noise on 0% inputs.
export function totalInterest(
  priceAED: number,
  downPaymentPct: number,
  annualRatePct: number,
  tenureYears: number,
): number {
  const monthly = monthlyPayment(priceAED, downPaymentPct, annualRatePct, tenureYears)
  const principal = loanAmount(priceAED, downPaymentPct)
  const total = monthly * tenureYears * 12 - principal
  return Math.max(0, total)
}
