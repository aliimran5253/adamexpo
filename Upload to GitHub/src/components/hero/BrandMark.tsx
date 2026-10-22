import { cn } from '@/lib/utils'

type BrandMarkProps = {
  className?: string
}

/**
 * Adamexpo mark: a tea leaf with its midrib and veins, set inside a ring.
 * Sized in em so it tracks the type it sits beside.
 */
export function BrandMark({ className }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={cn('inline-block shrink-0', className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="50" cy="50" r="46" strokeWidth={3.4} />
      <path d="M30 72 C 26 48, 40 28, 70 26 C 72 52, 58 70, 30 72 Z" strokeWidth={3.4} />
      <g strokeWidth={3}>
        <path d="M30 72 L 64 34" />
        <path d="M42 58 L 40 46" />
        <path d="M50 49 L 50 37" />
        <path d="M42 58 L 55 59" />
        <path d="M50 49 L 62 48" />
      </g>
    </svg>
  )
}
