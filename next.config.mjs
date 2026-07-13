import createNextIntlPlugin from 'next-intl/plugin'

// next-intl runs in "no-routing" mode (locale in React context + localStorage,
// no /en /ar path split — see spec §8, §14 item 13). The plugin is pointed at a
// request-config file that supplies messages for Server Components rendering.
const withNextIntl = createNextIntlPlugin('./lib/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Emit a self-contained server bundle (.next/standalone) so the Docker runner
  // stage ships only the node_modules actually traced as needed — smallest image.
  output: 'standalone',
}

export default withNextIntl(nextConfig)
