import type { Testimonial } from '@/types'

// Static testimonial data (spec §3 shape, §7, §10). Illustrative client reviews for the
// concept build. Per §10 disclosure rules: initials + origin only — NO invented
// surnames, and NO claimed third-party verification badge (no "Google Reviews verified"
// or platform logos). The section is labelled generically as "Client Reviews", not
// attributed to any real platform.
export const testimonials: Testimonial[] = [
  {
    id: 't1',
    clientInitials: 'A.R.',
    clientOrigin: 'United Kingdom',
    rating: 5,
    quote:
      'The matcher understood exactly what we needed and shortlisted three homes that actually fit our budget and school run. We viewed two and offered on one.',
    propertyType: 'Villa',
    date: '2026-02',
  },
  {
    id: 't2',
    clientInitials: 'S.K.',
    clientOrigin: 'India',
    rating: 5,
    quote:
      'As an investor I care about numbers first. The yield estimates and the mortgage breakdown made it easy to compare units before I ever spoke to an advisor.',
    propertyType: 'Apartment',
    date: '2026-01',
  },
  {
    id: 't3',
    clientInitials: 'M.A.',
    clientOrigin: 'UAE',
    rating: 4,
    quote:
      'Clear listings, honest specs, and a straightforward WhatsApp handover to an advisor. No pressure, no inflated claims — refreshing for this market.',
    propertyType: 'Townhouse',
    date: '2025-12',
  },
]
