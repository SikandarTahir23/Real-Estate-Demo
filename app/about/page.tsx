import type { Metadata } from 'next'
import { agents } from '@/lib/agents'
import { AboutView } from './AboutView'

// Server component shell (§14 item 13): metadata + static data; AboutView is the
// i18n-reactive client island.
export const metadata: Metadata = {
  title: 'About',
  description:
    'Meridian Estates is a concept portfolio project demonstrating real estate web and AI patterns. Meet the advisors and read the disclosure.',
}

export default function AboutPage() {
  return <AboutView agents={agents} />
}
