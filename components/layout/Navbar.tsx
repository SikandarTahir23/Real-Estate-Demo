'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useLocale } from '@/components/providers/LocaleProvider'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { key: 'home', href: '/' },
  { key: 'listings', href: '/listings' },
  { key: 'calculator', href: '/calculator' },
  { key: 'about', href: '/about' },
  { key: 'contact', href: '/contact' },
] as const

export function Navbar() {
  const t = useTranslations('nav')
  const { toggleLocale } = useLocale()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink text-stone">
      <nav
        aria-label={t('brand')}
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
      >
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-stone"
        >
          <span aria-hidden="true" className="text-brass-light">
            ◈
          </span>
          {t('brand')}
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.key}>
              <Link
                href={link.href}
                className="text-sm text-stone/80 transition-colors duration-150 hover:text-stone motion-reduce:transition-none"
              >
                {t(link.key)}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleLocale}
            className="rounded-md px-3 py-1.5 font-data text-sm text-stone/90 transition-colors duration-150 hover:bg-white/10 motion-reduce:transition-none"
          >
            {t('toggleLocale')}
          </button>

          <Button href="/contact" size="md" className="hidden sm:inline-flex">
            {t('enquire')}
          </Button>

          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? t('closeMenu') : t('openMenu')}
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-stone hover:bg-white/10 md:hidden"
          >
            <span aria-hidden="true" className="text-xl leading-none">
              {menuOpen ? '✕' : '☰'}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile panel */}
      <div
        id="mobile-nav"
        className={cn(
          'md:hidden',
          menuOpen ? 'block' : 'hidden',
        )}
      >
        <ul className="space-y-1 border-t border-white/10 px-4 py-3">
          {NAV_LINKS.map((link) => (
            <li key={link.key}>
              <Link
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-md px-3 py-2 text-sm text-stone/90 hover:bg-white/10"
              >
                {t(link.key)}
              </Link>
            </li>
          ))}
          <li>
            <Button href="/contact" size="md" className="mt-2 w-full">
              {t('enquire')}
            </Button>
          </li>
        </ul>
      </div>
    </header>
  )
}
