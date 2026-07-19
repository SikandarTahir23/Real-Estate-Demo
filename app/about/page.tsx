import type { Metadata } from 'next'
import { agents } from '@/lib/agents'
import { AboutView } from './AboutView'

// Server component shell (§14 item 13): metadata + static data; AboutView is the
// i18n-reactive client island.
export const metadata: Metadata = {
  title: 'About',
  description:
    'Meridian Estates is a residential property consultancy for Dubai and Abu Dhabi. Meet our advisors and learn how we help you buy, rent, and invest.',
}

export default function AboutPage() {
  return <AboutView agents={agents} />
}
