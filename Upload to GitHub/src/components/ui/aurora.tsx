import { cn } from '@/lib/utils'

// The brand aurora: a dark ground that runs deep green → teal-slate → aubergine,
// with soft blurred blobs drifting over it. Blobs go moss → sage → teal → dusk →
// plum from left to right, so each one blends into the next and the green never
// meets the purple head-on. Shared by the footer panel and the menu.
//
// `compact` is for short, wide bars (the scrolled nav): blobs are sized against the
// width and stretched well past the bar's height, with a tighter blur, so the
// colours still read in a ~60px strip. (`.aurora-blob` is unlayered CSS, hence the `!`.)
const BLOBS = [
  { color: 'bg-aurora-moss', opacity: 'opacity-70', full: '-top-[20%] -left-[10%] h-[70%] w-[50%]', compact: 'left-[-8%] w-[30%]', delay: '' },
  { color: 'bg-aurora-sage', opacity: 'opacity-40', full: 'top-[30%] left-[18%] h-[55%] w-[38%]', compact: 'left-[14%] w-[26%]', delay: '[animation-delay:-8s]' },
  { color: 'bg-aurora-teal', opacity: 'opacity-55', full: '-top-[10%] left-[38%] h-[60%] w-[36%]', compact: 'left-[36%] w-[26%]', delay: '[animation-delay:-14s]' },
  { color: 'bg-aurora-dusk', opacity: 'opacity-50', full: 'top-[35%] left-[56%] h-[60%] w-[36%]', compact: 'left-[57%] w-[26%]', delay: '[animation-delay:-4s]' },
  { color: 'bg-aurora-plum', opacity: 'opacity-45', full: '-top-[15%] -right-[12%] h-[70%] w-[42%]', compact: 'right-[-8%] w-[30%]', delay: '[animation-delay:-20s]' },
  { color: 'bg-aurora-glow', opacity: 'opacity-20', full: '-right-[8%] -bottom-[25%] h-[50%] w-[38%]', compact: 'hidden', delay: '[animation-delay:-11s]' },
]

export function Aurora({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-[linear-gradient(160deg,#1c3626_0%,#1b2f33_45%,#221f35_100%)]',
        className,
      )}
    >
      {BLOBS.map((b) => (
        <div
          key={b.color}
          className={cn(
            'aurora-blob',
            b.color,
            b.opacity,
            b.delay,
            compact ? cn('-top-[150%] h-[400%] [filter:blur(40px)]!', b.compact) : b.full,
          )}
        />
      ))}
    </div>
  )
}
