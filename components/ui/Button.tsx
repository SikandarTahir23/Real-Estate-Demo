import Link from 'next/link'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary'
type ButtonSize = 'md' | 'lg'

// Variant styles are locked to the §1.1 contrast audit:
// - primary: brass-dark fill + white text (6.27:1, the ONLY approved solid CTA combo)
// - secondary: steel-dark outline + steel-dark text on light surfaces (6.03:1)
const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-brass-dark text-white hover:bg-brass-dark/90 active:bg-brass-dark',
  secondary:
    'border border-steel-dark text-steel-dark bg-transparent hover:bg-steel-dark/10',
}

const sizeClasses: Record<ButtonSize, string> = {
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
}

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-md font-body font-medium ' +
  'transition-colors duration-150 motion-reduce:transition-none ' +
  'disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none'

interface BaseProps {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children: ReactNode
}

// Renders a <button> by default, or a Next <Link>/anchor when `href` is provided —
// so the same locked visual variants apply to both actions and navigation.
type ButtonProps = BaseProps &
  Omit<ComponentPropsWithoutRef<'button'>, 'className' | 'children'> & {
    href?: undefined
  }

type AnchorProps = BaseProps &
  Omit<ComponentPropsWithoutRef<'a'>, 'className' | 'children' | 'href'> & {
    href: string
  }

export function Button(props: ButtonProps | AnchorProps) {
  const {
    variant = 'primary',
    size = 'md',
    className,
    children,
    ...rest
  } = props

  const classes = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className,
  )

  if ('href' in props && props.href !== undefined) {
    const { href, ...anchorRest } = rest as AnchorProps
    return (
      <Link href={href} className={classes} {...anchorRest}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} {...(rest as ButtonProps)}>
      {children}
    </button>
  )
}
