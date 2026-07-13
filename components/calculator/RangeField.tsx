'use client'

import { useId } from 'react'

interface RangeFieldProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
  // Pre-formatted display of the current value (e.g. "AED 1,850,000", "25%", "25 yrs").
  // Rendered in font-data since it's numeric (§1).
  formattedValue: string
}

// Labelled slider input with a live numeric readout (spec §6: "sliders/inputs …
// output updates live"). Controlled, no <form> tag (§14 item 10). The range gets an
// accessible name via htmlFor, and aria-valuetext so screen readers announce the
// human-formatted value rather than the raw number.
export function RangeField({
  label,
  value,
  min,
  max,
  step,
  onChange,
  formattedValue,
}: RangeFieldProps) {
  const id = useId()

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-ink-mid">
          {label}
        </label>
        <span className="font-data text-sm font-medium text-ink">
          {formattedValue}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={formattedValue}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-stone-dark accent-brass-dark"
      />
    </div>
  )
}
