import type { Metadata } from 'next'
import { properties } from '@/lib/properties'
import { ListingsView } from './ListingsView'

// Server component shell (§14 item 13: page shells stay server-rendered/SEO-friendly).
// It owns static metadata and passes the static data down; ListingsView is the client
// island that holds filter state and renders i18n-reactive text.
export const metadata: Metadata = {
  title: 'Listings',
  description:
    'Browse ready and off-plan homes across Dubai and Abu Dhabi. Filter by type, location, price, beds, status, and purpose.',
}

export default function ListingsPage() {
  return <ListingsView properties={properties} />
}
