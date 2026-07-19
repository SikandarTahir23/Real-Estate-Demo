import type { Testimonial } from '@/types'

// Static testimonial data (spec §3 shape, §7). Client reviews shown with initials +
// origin only, to protect client privacy — no surnames and no third-party platform
// badges. The section is labelled generically as "Client Reviews".
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
  {
    id: 't4',
    clientInitials: 'L.C.',
    clientOrigin: 'Canada',
    rating: 5,
    quote:
      'Relocating from abroad felt daunting, but the team handled everything remotely. I signed for my apartment before I even landed in Dubai.',
    propertyType: 'Apartment',
    date: '2026-03',
  },
  {
    id: 't5',
    clientInitials: 'H.T.',
    clientOrigin: 'Germany',
    rating: 5,
    quote:
      'The floor plans and gallery gave me a genuine feel for each home. When I visited in person, the penthouse was exactly as presented online.',
    propertyType: 'Penthouse',
    date: '2026-02',
  },
  {
    id: 't6',
    clientInitials: 'R.N.',
    clientOrigin: 'Saudi Arabia',
    rating: 4,
    quote:
      'I compared a dozen off-plan projects in one afternoon. The handover dates and payment plans were laid out plainly, which saved me weeks of back-and-forth.',
    propertyType: 'Villa',
    date: '2026-01',
  },
  {
    id: 't7',
    clientInitials: 'E.M.',
    clientOrigin: 'Egypt',
    rating: 5,
    quote:
      'My advisor listened rather than pushed. Every property I was shown genuinely matched my brief, and the whole process felt calm and considered.',
    propertyType: 'Townhouse',
    date: '2025-11',
  },
]
