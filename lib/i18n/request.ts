import { getRequestConfig } from 'next-intl/server'
import { defaultLocale } from './config'

// Server-side request config for next-intl. In no-routing mode there is no locale
// segment in the URL, so the server always renders the default locale's messages;
// the client LocaleProvider then re-provides the active (possibly AR) locale from
// localStorage on hydration (spec §8, §14 item 13). Currency/number formatting still
// flows through next-intl's Intl.NumberFormat under the hood on both sides.
export default getRequestConfig(async () => {
  const locale = defaultLocale
  const messages = (await import(`./messages/${locale}.json`)).default

  return { locale, messages }
})
