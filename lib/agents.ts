import type { Agent } from '@/types'

// Static agent profiles (spec §4, §7). Our three advisors and their specialities.
// This same TypeScript shape is the intended headless-CMS schema for production
// (§14 item 1).
//
// The `whatsapp` field carries a UAE-format number as domain data. Actual WhatsApp
// deep links are always constructed through buildWhatsAppLink() against
// NEXT_PUBLIC_WHATSAPP_NUMBER (§12, built in Phase 6) — a number is never hardcoded
// into a link.
export const agents: Agent[] = [
  {
    id: 'a1',
    name: 'Layla Haddad',
    initials: 'LH',
    yearsExperience: 9,
    languages: ['English', 'Arabic', 'French'],
    speciality: 'Downtown & off-plan investments',
    whatsapp: '+971 50 000 0001',
  },
  {
    id: 'a2',
    name: 'Omar Farouk',
    initials: 'OF',
    yearsExperience: 14,
    languages: ['English', 'Arabic'],
    speciality: 'Prime villas & waterfront homes',
    whatsapp: '+971 50 000 0002',
  },
  {
    id: 'a3',
    name: 'Sana Kapoor',
    initials: 'SK',
    yearsExperience: 6,
    languages: ['English', 'Hindi', 'Urdu'],
    speciality: 'Rentals & first-time buyers',
    whatsapp: '+971 50 000 0003',
  },
]

// Convenience lookup for agent-card rendering on property detail pages (§9, Phase 3).
export function getAgentById(id: string): Agent | undefined {
  return agents.find((agent) => agent.id === id)
}
