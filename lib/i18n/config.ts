// i18n configuration — EN/AR, next-intl in no-routing mode (spec §8).
// Locale is held in React context + localStorage (see LocaleProvider), not a URL path split.

export const locales = ['en', 'ar'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

// Text direction per locale — drives <html dir> and RTL layout mirroring (§8).
export const localeDirection: Record<Locale, 'ltr' | 'rtl'> = {
  en: 'ltr',
  ar: 'rtl',
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}
