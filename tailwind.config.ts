import type { Config } from 'tailwindcss'

// "Blueprint & Brass" design system — tokens are the single source of truth (spec §1).
// Colors are EXTENDED (not replaced) so Tailwind default scale steps remain
// available alongside these named tokens.
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#10161D', // primary dark surface, nav, footer, hero
          mid: '#3A4552', // secondary text on light surfaces
          light: '#5A636F', // tertiary text, captions — corrected for AA (§1.1)
        },
        brass: {
          DEFAULT: '#A9793C', // primary accent — decorative/large text only (§1.1)
          light: '#C99A5B',
          dark: '#7C5A2A', // AA-safe fill/text variant (§1.1)
        },
        steel: {
          DEFAULT: '#5B7A94', // secondary accent — off-plan tags, glass motif
          light: '#8CA7BC',
          dark: '#3E5A70',
        },
        stone: {
          DEFAULT: '#EEEAE2', // base background
          dark: '#DFD9CC', // card/section alternation
        },
        emerald: {
          DEFAULT: '#2F6E51', // "Available" status only — sole semantic color
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        data: ['var(--font-data)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      // Animation budget (§11): hard ceiling 350ms. Nothing here exceeds it.
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 300ms ease-out both', // hero page-load
        'fade-in': 'fade-in 200ms ease-out both', // card/result reveal
      },
    },
  },
  plugins: [],
}

export default config
