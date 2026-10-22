import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MapPin } from 'lucide-react'

import { cn } from '@/lib/utils'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// `stand: null` means the stand isn't confirmed yet and renders as a pending tag.
// Photos are freely licensed from Wikimedia Commons; each carries a linked credit
// (required for CC BY, kept for all three for consistency).
const EVENTS = [
  {
    name: 'SIAL Paris',
    stand: null,
    photo: {
      src: '/images/events/sial-paris.webp',
      alt: 'Exhibition hall at SIAL Paris, busy with visitors and food brand stands',
      credit: 'SIAL Paris · CC0',
      href: 'https://commons.wikimedia.org/wiki/File:Hall_SIAL.jpg',
    },
  },
  {
    name: 'Anuga, Germany',
    stand: null,
    photo: {
      src: '/images/events/anuga-koelnmesse.webp',
      alt: 'Koelnmesse exhibition centre in Cologne, home of Anuga, at dusk',
      credit: 'Koelnmesse · KölnKongress · Public domain',
      href: 'https://commons.wikimedia.org/wiki/File:Congress-Centrum_Nord_-_Eingang_Nordhallen.jpg',
    },
  },
  {
    name: 'Gulfood, Dubai',
    stand: 'South Hall 10, Stand 57-88',
    photo: {
      src: '/images/events/gulfood-dubai.webp',
      alt: 'Exhibitor stands along a purple-carpeted aisle at Gulfood 2026 in Dubai',
      credit: 'rais.tatarstan.ru · CC BY 4.0',
      href: 'https://commons.wikimedia.org/wiki/File:Tatarstan_in_Gulfood-2026_-_28.jpg',
    },
  },
]

const labelBase = 'font-label uppercase font-semibold'

export function MeetUs() {
  const root = useRef<HTMLElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)

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
            // Cards sharing a row land one after another rather than all at once
            delay: el.dataset.card ? 0.08 * Number(el.dataset.card) : 0,
            scrollTrigger: { trigger: el, start: 'top 92%', once: true },
          })
        })
      })

      // matchMedia is its own context; revert it so a remount starts from clean transforms
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section
      id="trade-fairs"
      ref={root}
      className="relative pt-[clamp(88px,14svh,160px)] pb-[clamp(88px,14svh,160px)] text-forest"
    >
      <div className="px-(--hero-mx)">
        {/* Eyebrow */}
        <div data-rv className="relative mb-[clamp(10px,2svh,24px)] pt-3">
          <span aria-hidden="true" className="absolute top-0 left-0 h-px w-14 bg-forest/40" />
          <span className={`${labelBase} text-[clamp(0.72rem,0.9vw,0.86rem)] tracking-[0.18em] text-forest/65`}>
            Meet Us
          </span>
        </div>

        {/* Heading */}
        <h2
          ref={heading}
          aria-label="Find us on the floor."
          className="font-display text-[clamp(1.9rem,min(5vw,7.5svh),5.25rem)] leading-[1.02] font-medium tracking-[-0.025em]"
        >
          <span aria-hidden="true" className="line-mask">
            <span className="line-in">
              Find us <span className="accent-word">on</span> the floor.
            </span>
          </span>
        </h2>

        {/* Body */}
        <p
          data-rv
          className="mt-[clamp(18px,3.5svh,36px)] max-w-[52ch] font-label text-[clamp(0.98rem,1.15vw,1.15rem)] leading-[1.6] text-forest/75"
        >
          We show up at the trade fairs that matter, so you can taste the tea, see the packaging, and talk specifics in
          person.
        </p>

        {/* Event cards */}
        <ul className="mt-[clamp(36px,6svh,72px)] grid gap-[clamp(12px,1.6vw,24px)] md:grid-cols-3">
          {EVENTS.map((event, i) => (
            <li
              key={event.name}
              data-rv
              data-card={i}
              className="flex flex-col gap-[clamp(18px,2vw,28px)] rounded-[22px] bg-paper p-[clamp(10px,1vw,14px)] pb-[clamp(22px,2.4vw,32px)]"
            >
              {/* Event photo, inset in the card, with its licence credit */}
              <figure className="relative aspect-[3/2] overflow-hidden rounded-[14px] bg-forest/10">
                <img
                  src={event.photo.src}
                  alt={event.photo.alt}
                  loading="lazy"
                  draggable={false}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-[linear-gradient(transparent,rgb(0_0_0/0.45))] px-3 pt-6 pb-2 text-right">
                  <a
                    href={event.photo.href}
                    target="_blank"
                    rel="noreferrer"
                    className="font-label text-[0.62rem] text-white/80 hover:text-white hover:underline"
                  >
                    Photo: {event.photo.credit}
                  </a>
                </figcaption>
              </figure>

              <div className="flex items-start justify-between gap-4 px-[clamp(12px,1.4vw,22px)]">
                <h3 className="font-display text-[clamp(1.5rem,2.2vw,2.1rem)] leading-[1.1] font-medium tracking-[-0.02em]">
                  {event.name}
                </h3>
                <span className={`${labelBase} pt-2 text-[0.68rem] tracking-[0.14em] text-forest/40 tabular-nums`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>

              <div className="mt-auto px-[clamp(12px,1.4vw,22px)]">
                <span className={`${labelBase} block text-[0.66rem] tracking-[0.18em] text-forest/55`}>Stand</span>
                <span
                  className={cn(
                    'mt-2.5 inline-flex items-center gap-2 rounded-full font-label text-[0.9rem]',
                    event.stand
                      ? 'bg-forest px-3.5 py-1.5 font-medium text-cream'
                      : 'border border-dashed border-forest/35 px-3.5 py-1.5 text-forest/55',
                  )}
                >
                  {event.stand ? (
                    <>
                      <MapPin aria-hidden="true" className="size-3.5" />
                      {event.stand}
                    </>
                  ) : (
                    <>
                      <span className="tracking-[0.12em] uppercase">TBC</span>
                      <span className="sr-only">, stand number to be confirmed</span>
                    </>
                  )}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
