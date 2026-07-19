'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'

const EXPLORE_LINKS = [
  { key: 'listings', href: '/listings' },
  { key: 'calculator', href: '/calculator' },
] as const

const COMPANY_LINKS = [
  { key: 'about', href: '/about' },
  { key: 'contact', href: '/contact' },
] as const

export function Footer() {
  const tNav = useTranslations('nav')
  const tFooter = useTranslations('footer')

  return (
    <footer className="border-t border-white/10 bg-ink text-stone">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-2">
            <p className="flex items-center gap-2 font-display text-lg font-bold tracking-tight">
              <span aria-hidden="true" className="text-brass-light">
                ◈
              </span>
              {tNav('brand')}
            </p>
            <p className="text-sm text-stone/70">{tFooter('tagline')}</p>
          </div>

          <nav aria-label={tFooter('sections.explore')} className="space-y-2">
            <p className="font-display text-sm font-medium text-stone">
              {tFooter('sections.explore')}
            </p>
            <ul className="space-y-1">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone/70 transition-colors duration-150 hover:text-stone motion-reduce:transition-none"
                  >
                    {tNav(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={tFooter('sections.company')} className="space-y-2">
            <p className="font-display text-sm font-medium text-stone">
              {tFooter('sections.company')}
            </p>
            <ul className="space-y-1">
              {COMPANY_LINKS.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone/70 transition-colors duration-150 hover:text-stone motion-reduce:transition-none"
                  >
                    {tNav(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-10 border-t border-white/10 pt-6 font-data text-xs text-stone/50">
          © 2026 · {tFooter('rights')}
        </p>
      </div>
    </footer>
  )
}
