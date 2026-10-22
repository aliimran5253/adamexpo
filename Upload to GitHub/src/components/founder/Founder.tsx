import { Fragment, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { scrambleText } from '@/lib/scramble'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// `number` decodes in with the scramble effect; `unit` sits beside it, static.
// Labels are set as fixed lines that never wrap, so each stat is exactly as wide
// as its text and the spacing between stats measures true.
const STATS = [
  { number: '1973', unit: '', label: ['Family owned', 'since'] },
  { number: '150,000', unit: ' sq ft', label: ['Processing &', 'packing facility'] },
  { number: '40', unit: '+', label: ['Countries', 'served'] },
]

const labelBase = 'font-label uppercase font-semibold'

export function Founder() {
  const root = useRef<HTMLElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const stats = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Same reveal language as the sections above: masked lines rise, the rest fades up.
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

        // Stat numbers decode in one after another, like "1973" in the hero
        const numbers = gsap.utils.toArray<HTMLElement>('[data-stat-number]', root.current)
        ScrollTrigger.create({
          trigger: stats.current,
          start: 'top 88%',
          once: true,
          onEnter: () =>
            numbers.forEach((el, i) => {
              gsap.delayedCall(0.14 * i, () => scrambleText(el, el.dataset.statNumber, 0.9))
            }),
        })
      })

      // matchMedia is its own context; revert it so a remount starts from clean transforms
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section
      id="founder"
      ref={root}
      className="relative pt-[clamp(88px,14svh,160px)] pb-[clamp(88px,14svh,160px)] text-forest"
    >
      <div className="grid gap-[clamp(32px,5vw,96px)] px-(--hero-mx) lg:grid-cols-[5fr_7fr] lg:items-center lg:gap-x-[clamp(64px,8vw,160px)]">
        {/* Founder portrait, same rounded panel treatment as the packaging section */}
        <div data-rv className="relative aspect-[4/5] max-h-[78svh] overflow-hidden rounded-[22px] bg-paper lg:max-h-none">
          <img
            src="/images/founder/shabbir-gulamhusein.webp"
            alt="Portrait of Dr. Shabbir Gulamhusein, founder of Adamexpo"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-[50%_30%]"
            draggable={false}
          />
        </div>

        <div>
          {/* Eyebrow */}
          <div data-rv className="relative mb-[clamp(10px,2svh,24px)] pt-3">
            <span aria-hidden="true" className="absolute top-0 left-0 h-px w-14 bg-forest/40" />
            <span className={`${labelBase} text-[clamp(0.72rem,0.9vw,0.86rem)] tracking-[0.18em] text-forest/65`}>
              Our Founder
            </span>
          </div>

          {/* Heading */}
          <h2
            ref={heading}
            aria-label="Half a century. One family's standard."
            className="font-display text-[clamp(1.9rem,min(4.4vw,7.5svh),4.75rem)] leading-[1.02] font-medium tracking-[-0.025em]"
          >
            <span aria-hidden="true" className="line-mask">
              <span className="line-in">Half a century.</span>
            </span>
            <span aria-hidden="true" className="line-mask">
              <span className="line-in">
                <span className="accent-word">One</span> family’s standard.
              </span>
            </span>
          </h2>

          {/* Body */}
          <p
            data-rv
            className="mt-[clamp(18px,3svh,32px)] max-w-[48ch] font-label text-[clamp(0.98rem,1.15vw,1.15rem)] leading-[1.6] text-forest/75"
          >
            Dr. Shabbir Gulamhusein has spent over fifty years building Adamexpo into one of Sri Lanka’s most trusted
            tea and spice exporters, one relationship at a time.
          </p>

          {/* Pull quote */}
          <figure data-rv className="mt-[clamp(28px,5svh,52px)] border-l-2 border-forest/35 pl-[clamp(18px,2vw,28px)]">
            <blockquote className="font-accent text-[clamp(1.45rem,2.3vw,2.25rem)] leading-[1.25] font-medium tracking-[-0.01em] text-balance italic">
              “We take great pride in being perfectionists in tea.”
            </blockquote>
            <figcaption className={`${labelBase} mt-4 text-[clamp(0.66rem,0.78vw,0.74rem)] tracking-[0.16em] text-forest/60`}>
              Dr. Shabbir Gulamhusein, Founder, Adamexpo
            </figcaption>
          </figure>

          {/* Stats. Each stat is as wide as its content; between them, equal flexible
              spacers carry a centred divider, so the gaps are identical whatever the
              number widths. Below sm they stack with rules between. */}
          <div
            ref={stats}
            data-rv
            role="list"
            className="mt-[clamp(32px,6svh,64px)] flex flex-col border-t border-forest/15 sm:flex-row sm:items-stretch"
          >
            {STATS.map((s, i) => (
              <Fragment key={s.number}>
                {i > 0 && (
                  <span aria-hidden="true" className="flex justify-center max-sm:border-t max-sm:border-forest/15 sm:flex-1">
                    <span className="hidden w-px bg-forest/15 sm:block" />
                  </span>
                )}
                <div role="listitem" className="flex flex-col gap-2 py-[clamp(16px,2.6svh,24px)] sm:flex-none">
                  <span className="font-display text-[clamp(1.8rem,2.8vw,2.75rem)] leading-none font-medium tracking-[-0.025em] whitespace-nowrap tabular-nums">
                    <span data-stat-number={s.number}>{s.number}</span>
                    {s.unit && (
                      <span className={s.unit === '+' ? '' : 'text-[0.5em] tracking-normal'}>{s.unit}</span>
                    )}
                  </span>
                  <span className={`${labelBase} text-[clamp(0.64rem,0.74vw,0.72rem)] leading-snug tracking-[0.16em] text-forest/60`}>
                    {s.label.map((line, j) => (
                      <span key={line} className="block whitespace-nowrap">
                        {j > 0 && <span className="sr-only"> </span>}
                        {line}
                      </span>
                    ))}
                  </span>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
