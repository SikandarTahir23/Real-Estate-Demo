import type { Metadata } from 'next'
import { ContactView } from './ContactView'

// Server component shell (§14 item 13): metadata only; ContactView holds the controlled
// form state and i18n-reactive copy.
export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with a Meridian Estates advisor by form, WhatsApp, phone, or email.',
}

export default function ContactPage() {
  return <ContactView />
}
