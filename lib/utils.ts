// Minimal className joiner — avoids pulling in clsx/tailwind-merge as dependencies
// (spec: no unnecessary dependencies). Falsy values are dropped; truthy strings joined.
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}
