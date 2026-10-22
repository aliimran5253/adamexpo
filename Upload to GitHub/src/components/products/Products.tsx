import { useRef, useState } from 'react'
import { Tabs } from '@base-ui/react/tabs'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, MotionConfig } from 'motion/react'

import FocusPullCarousel, { type Slide } from '@/components/ui/focus-pull-carousel'
import { cn } from '@/lib/utils'

gsap.registerPlugin(useGSAP, ScrollTrigger)

type Category = 'tea' | 'spices'

// Slides without an `image` get a painted landscape placeholder from palette + seed.
const CATEGORIES: { value: Category; label: string; slides: Slide[] }[] = [
  {
    value: 'tea',
    label: 'Tea',
    slides: [
      {
        title: 'Black Tea',
        caption: 'Ceylon’s own, high grown and full bodied, sourced direct from the Colombo auctions.',
        image: '/images/products/black-tea.jpg',
        alt: 'Loose leaf Ceylon black tea beside a cup of brewed amber tea',
      },
      {
        title: 'Green Tea',
        caption: 'Delicate and grassy, sourced from China’s finest gardens.',
        image: '/images/products/green-tea.jpg',
        alt: 'Rolled green tea leaves beside a cup of pale golden green tea',
      },
      {
        title: 'Herbal Tea',
        caption: 'Caffeine free infusions and tisanes from Germany and Egypt.',
        image: '/images/products/herbal-tea.jpg',
        alt: 'Herbal blend of chamomile, lemongrass and mint beside a cup of golden infusion',
      },
      {
        title: 'Flavoured Tea',
        caption: 'Black and green teas blended with real fruit, florals and spice.',
        image: '/images/products/flavoured-tea.jpg',
        alt: 'Black tea flecked with cinnamon pieces beside a cup of red amber tea',
      },
      {
        title: 'Tea Bags',
        caption: 'Staple free, heat sealed, pyramid or envelope, built for any shelf.',
        image: '/images/products/tea-bags.jpg',
        alt: 'Heat sealed staple free tea bags beside a cup of brewed tea',
      },
    ],
  },
  {
    value: 'spices',
    label: 'Spices',
    slides: [
      { title: 'Cinnamon', caption: 'True Ceylon cinnamon, sweeter and warmer than cassia, native only to this island.', palette: 'dusk', seed: 7 },
      { title: 'Pepper', caption: 'Sri Lanka’s own black pepper, high in piperine, sharp and pungent.', palette: 'mist', seed: 19 },
      { title: 'Nutmeg', caption: 'Warm and versatile, transplanted to Ceylon from the Banda Islands in the 1800s.', palette: 'dawn', seed: 29 },
      { title: 'Mace', caption: 'Nutmeg’s rarer twin, hand peeled from the red lace around the seed.', palette: 'dawn', seed: 47 },
    ],
  },
]

const SECTION_BG = 'var(--color-beige)'
const SECTION_INK = 'var(--color-forest)'

// The whole section fits one screen. The carousel fills whatever height is left
// under the heading (a size container), and the card is sized from that space:
// the narrower of 64% of the width (up to 80% on phones) and the width a 3:2 card can have once the
// caption row, buttons and progress bar are set aside (--caption-row, set on the
// container: captions wrap to several lines on phones, one line elsewhere).
const CARD_WIDTH = 'min(max(64cqw, min(80cqw, 340px)), 860px, calc((100cqh - var(--caption-row)) * 1.5))'

const labelBase = 'font-label uppercase font-semibold'

export function Products() {
  const root = useRef<HTMLElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const [category, setCategory] = useState<Category>('tea')

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Same reveal language as the hero: masked lines rise, labels fade up.
        const lines = gsap.utils.toArray<HTMLElement>('.line-in', root.current)
        const reveals = gsap.utils.toArray<HTMLElement>('[data-rv]', root.current)
        gsap.set(reveals, { opacity: 0, y: 22 })

        gsap.fromTo(lines, { y: 0, yPercent: 115 }, {
          y: 0,
          yPercent: 0,
          duration: 1.05,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: { trigger: heading.current, start: 'top 88%', once: true },
        })
        reveals.forEach((el) => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 92%', once: true },
          })
        })
      })

      // matchMedia is its own context; revert it so a remount starts from clean transforms
      return () => mm.revert()
    },
    { scope: root },
  )

  // Crossfade between the two carousels: both stay mounted (no repainting the
  // placeholder art on every switch); the outgoing one racks out of focus.
  const { contextSafe } = useGSAP({ scope: root })
  const switchTo = contextSafe((next: Category) => {
    if (next === category) return
    const from = root.current?.querySelector(`[data-panel="${category}"]`)
    const to = root.current?.querySelector(`[data-panel="${next}"]`)
    setCategory(next)
    if (!from || !to || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.killTweensOf([from, to])
    gsap
      .timeline({ defaults: { ease: 'power2.inOut' } })
      .to(from, { opacity: 0, filter: 'blur(10px)', scale: 0.985, duration: 0.45 }, 0)
      .fromTo(
        to,
        { opacity: 0, filter: 'blur(10px)', scale: 0.985 },
        { opacity: 1, filter: 'blur(0px)', scale: 1, duration: 0.6, clearProps: 'filter,scale' },
        0.15,
      )
  })

  return (
    <section
      id="products"
      ref={root}
      className="relative flex h-svh min-h-[560px] flex-col pt-[clamp(76px,11svh,128px)] pb-[clamp(12px,3svh,40px)] text-forest"
    >
      {/* Top padding clears the fixed nav when the section is scrolled to */}
      <div className="shrink-0 px-(--hero-mx)">
        {/* Eyebrow */}
        <div data-rv className="relative mb-[clamp(10px,2svh,24px)] pt-3">
          <span aria-hidden="true" className="absolute top-0 left-0 h-px w-14 bg-forest/40" />
          <span className={`${labelBase} text-[clamp(0.72rem,0.9vw,0.86rem)] tracking-[0.18em] text-forest/65`}>
            What We Export
          </span>
        </div>

        {/* Heading row: heading left, category toggle far right. Below md the
            toggle wraps under the heading, left aligned. */}
        <div className="flex flex-col gap-[clamp(14px,2.5svh,28px)] md:flex-row md:items-end md:justify-between md:gap-8">
          <h2
            ref={heading}
            aria-label="Two categories. One export house."
            className="font-display text-[clamp(1.9rem,min(5vw,7.5svh),5.25rem)] leading-[1.02] font-medium tracking-[-0.025em]"
          >
            <span aria-hidden="true" className="line-mask">
              <span className="line-in">Two categories.</span>
            </span>
            <span aria-hidden="true" className="line-mask">
              <span className="line-in">
                One <span className="accent-word">export</span> house.
              </span>
            </span>
          </h2>

          {/* Category toggle: a pill segmented control. The green fill is one shared
              layout element that slides between options (motion layoutId). */}
          <MotionConfig reducedMotion="user">
            <Tabs.Root
              value={category}
              onValueChange={(value) => switchTo(value as Category)}
              className="shrink-0"
            >
              <Tabs.List
                data-rv
                aria-label="Product categories"
                className="inline-flex rounded-full border border-forest/20 p-1"
              >
                {CATEGORIES.map((c) => (
                  <Tabs.Tab
                    key={c.value}
                    value={c.value}
                    className={cn(
                      labelBase,
                      'relative cursor-pointer rounded-full px-[clamp(18px,1.8vw,28px)] py-[clamp(8px,1.1svh,11px)] text-[clamp(0.74rem,0.9vw,0.86rem)] tracking-[0.16em] text-forest/55 transition-colors duration-300 outline-none not-data-active:hover:text-forest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest data-active:text-cream',
                    )}
                  >
                    {c.value === category && (
                      <motion.span
                        layoutId="category-pill"
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full bg-forest"
                        transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                      />
                    )}
                    <span className="relative">{c.label}</span>
                  </Tabs.Tab>
                ))}
              </Tabs.List>
            </Tabs.Root>
          </MotionConfig>
        </div>
      </div>

      {/* Carousels, stacked in one grid cell so they can crossfade. A size
          container, so CARD_WIDTH can measure the height left over. */}
      <div
        data-rv
        className="mt-[clamp(16px,3svh,40px)] grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)] grid-rows-[minmax(0,1fr)] [container-type:size] [--caption-row:165px] sm:[--caption-row:125px]"
      >
        {CATEGORIES.map((c) => {
          const shown = c.value === category
          return (
            <div
              key={c.value}
              data-panel={c.value}
              role="tabpanel"
              aria-label={`${c.label} products`}
              aria-hidden={!shown}
              inert={!shown}
              className={cn('[grid-area:1/1]', !shown && 'pointer-events-none opacity-0')}
            >
              <FocusPullCarousel
                slides={c.slides}
                background={SECTION_BG}
                ink={SECTION_INK}
                height="100%"
                cardWidth={CARD_WIDTH}
                autoplay={shown ? 5000 : 0}
                ariaLabel={`${c.label} products`}
                className="products-carousel"
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}
