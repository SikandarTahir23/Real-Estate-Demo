'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { NextIntlClientProvider } from 'next-intl'
import {
  defaultLocale,
  isLocale,
  localeDirection,
  type Locale,
} from '@/lib/i18n/config'
import enMessages from '@/lib/i18n/messages/en.json'
import arMessages from '@/lib/i18n/messages/ar.json'

// Messages are bundled for both locales so switching is instant and client-side —
// this is the "no-routing" i18n mode from spec §8: locale lives in React context +
// localStorage, and there is no /en /ar URL split.
const messagesByLocale: Record<Locale, typeof enMessages> = {
  en: enMessages,
  ar: arMessages,
}

const STORAGE_KEY = 'meridian.locale'

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return ctx
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  // Server renders the default locale; the stored preference is applied on mount to
  // avoid a hydration mismatch (§14 item 13 — i18n text is client-reactive).
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored && isLocale(stored)) {
      setLocaleState(stored)
    }
  }, [])

  // Keep <html lang> and <html dir> in sync so RTL mirroring and screen readers
  // reflect the active locale (§8, §13).
  useEffect(() => {
    const root = document.documentElement
    root.lang = locale
    root.dir = localeDirection[locale]
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    window.localStorage.setItem(STORAGE_KEY, next)
  }, [])

  const toggleLocale = useCallback(() => {
    setLocaleState((current) => {
      const next: Locale = current === 'en' ? 'ar' : 'en'
      window.localStorage.setItem(STORAGE_KEY, next)
      return next
    })
  }, [])

  const contextValue = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale, toggleLocale }),
    [locale, setLocale, toggleLocale],
  )

  return (
    <LocaleContext.Provider value={contextValue}>
      <NextIntlClientProvider
        locale={locale}
        messages={messagesByLocale[locale]}
        timeZone="Asia/Dubai"
      >
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  )
}
