// WhatsApp deep-link helper (spec §12). Single source for every WhatsApp link on the
// site — the number is never hardcoded into a component; it comes from
// NEXT_PUBLIC_WHATSAPP_NUMBER, and the message is always encodeURIComponent-ed.
//
// The advisor number is provided via .env.local (valid UAE mobile format), documented
// in .env.example. wa.me requires the number in international format with no '+', spaces,
// or dashes, so we strip non-digits defensively before building the URL.
export function buildWhatsAppLink(message: string): string {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''
  const number = raw.replace(/\D/g, '')
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
