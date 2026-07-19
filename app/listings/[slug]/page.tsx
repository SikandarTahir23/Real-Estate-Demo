import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAgentById } from '@/lib/agents'
import {
  getPropertyBySlug,
  getSimilarProperties,
  properties,
} from '@/lib/properties'
import { PropertyDetailView } from '@/components/detail/PropertyDetailView'

interface PageProps {
  params: { slug: string }
}

// Pre-render every listing at build time (§14 item 2: static generation). A slug that
// isn't in the static set 404s via notFound().
export function generateStaticParams() {
  return properties.map((property) => ({ slug: property.slug }))
}

export function generateMetadata({ params }: PageProps): Metadata {
  const property = getPropertyBySlug(params.slug)
  if (!property) {
    return { title: 'Property not found' }
  }
  return {
    title: property.title,
    description: property.description,
  }
}

export default function PropertyDetailPage({ params }: PageProps) {
  const property = getPropertyBySlug(params.slug)
  if (!property) {
    notFound()
  }

  // Data is resolved server-side and passed down as plain props; the client view holds
  // no fetching logic (§14 item 13).
  const agent = getAgentById(property.agentId)
  const similar = getSimilarProperties(property)

  return (
    <PropertyDetailView property={property} agent={agent} similar={similar} />
  )
}
