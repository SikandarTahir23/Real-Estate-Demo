import { HeroSection } from '@/components/hero/HeroSection'
import { FeaturedSection } from '@/components/home/FeaturedSection'
import { TrustBand } from '@/components/ui/TrustBand'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { CalculatorTeaser } from '@/components/home/CalculatorTeaser'
import { getFeaturedProperties } from '@/lib/properties'
import { testimonials } from '@/lib/testimonials'

// Landing page (spec §7). Server component shell (§14 item 13) — it resolves the static
// data and composes the client islands. Section order follows §7: Hero + embedded
// Matcher (the thesis, leads the page), Featured Listings, Trust band, one Testimonial,
// and the "Try the Mortgage Calculator" teaser.
export default function HomePage() {
  const featured = getFeaturedProperties()
  // §7 calls for "one Testimonial" on the landing page; the section itself is
  // count-flexible so it can be reused elsewhere.
  const homeTestimonials = testimonials.slice(0, 1)

  return (
    <>
      <HeroSection />
      <FeaturedSection properties={featured} />
      <TrustBand />
      <TestimonialsSection testimonials={homeTestimonials} />
      <CalculatorTeaser />
    </>
  )
}
