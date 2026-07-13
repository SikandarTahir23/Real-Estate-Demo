import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Inter, IBM_Plex_Mono } from 'next/font/google'
import { LocaleProvider } from '@/components/providers/LocaleProvider'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppFAB } from '@/components/floating/WhatsAppFAB'
import { ChatWidget } from '@/components/chat/ChatWidget'
import { defaultLocale, localeDirection } from '@/lib/i18n/config'
import './globals.css'

// Typography (§1): three families exposed as CSS variables, consumed by the
// font-display / font-body / font-data Tailwind utilities.
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700'],
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600'],
  display: 'swap',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-data',
  weight: ['400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Meridian Estates — Prime addresses across the Emirates',
    template: '%s · Meridian Estates',
  },
  description:
    'Discover prime residential property across Dubai and Abu Dhabi. Search by need with our AI matcher, estimate mortgages, and explore ready and off-plan homes.',
  applicationName: 'Meridian Estates',
}

export const viewport: Viewport = {
  themeColor: '#10161D',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Semantic landmarks: header (Navbar) / main / footer (§13). LocaleProvider owns
  // the NextIntlClientProvider and bundles both locales' messages for instant,
  // client-side switching (no-routing i18n, §8).
  return (
    <html lang={defaultLocale} dir={localeDirection[defaultLocale]}>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${plexMono.variable} flex min-h-screen flex-col`}
      >
        <LocaleProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFAB />
          <ChatWidget />
        </LocaleProvider>
      </body>
    </html>
  )
}
