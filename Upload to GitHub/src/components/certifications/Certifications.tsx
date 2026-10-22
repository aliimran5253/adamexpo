import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

type Certification = {
  name: string
  src: string
  /** Evens out optical weight: round seals sit at full height, wide wordmarks
      shorter so they don't overpower the row */
  scale?: number
}

// Official marks. USDA Organic, the Ceylon Tea Lion Logo, Fairtrade, Rainforest
// Alliance and Sedex come from each body's own site; SGS ISO 22000, FSSC 22000 and
// UKAS were supplied by Adamexpo. Wide wordmarks are spaced between round seals.
const CERTIFICATIONS: Certification[] = [
  { name: 'USDA Organic', src: '/images/certifications/usda-organic.png' },
  { name: 'ISO 22000, certified by SGS', src: '/images/certifications/sgs-iso-22000.png' },
  { name: 'Sedex', src: '/images/certifications/sedex.svg', scale: 0.4 },
  { name: 'Ceylon Tea Symbol of Quality', src: '/images/certifications/ceylon-tea-lion.png', scale: 0.86 },
  { name: 'UKAS Management Systems', src: '/images/certifications/ukas-management-systems.png' },
  { name: 'FSSC 22000', src: '/images/certifications/fssc-22000.png', scale: 0.44 },
  { name: 'Fairtrade', src: '/images/certifications/fairtrade.png' },
  { name: 'Rainforest Alliance Certified', src: '/images/certifications/rainforest-alliance.svg' },
]

const labelBase = 'font-label uppercase font-semibold'

function CertificationMark({ cert }: { cert: Certification }) {
  return (
    <img
      src={cert.src}
      alt={cert.name}
      loading="lazy"
      draggable={false}
      className="block w-auto max-w-none select-none"
      style={{ height: `calc(var(--logo-h) * ${cert.scale ?? 1})` }}
    />
  )
}

// Each marquee group holds the set twice so one group is always wider than even a
// very wide screen; otherwise a gap would show before the loop wraps.
const MARQUEE_SET = [...CERTIFICATIONS, ...CERTIFICATIONS]

function MarqueeGroup({ hidden }: { hidden?: boolean }) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      aria-label={hidden ? undefined : 'Certifications'}
      className="flex shrink-0 items-center gap-(--logo-gap) pr-(--logo-gap)"
    >
      {MARQUEE_SET.map((cert, i) => (
        <li
          key={i}
          // Only the first copy is announced; the repeats are visual
          aria-hidden={i >= CERTIFICATIONS.length || undefined}
          className="flex h-(--logo-h) shrink-0 items-center"
        >
          <CertificationMark cert={cert} />
        </li>
      ))}
    </ul>
  )
}

export function Certifications() {
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
      id="certifications"
      ref={root}
      className="relative pt-[clamp(88px,14svh,160px)] pb-[clamp(72px,12svh,140px)] text-forest"
    >
      <div className="px-(--hero-mx)">
        {/* Eyebrow */}
        <div data-rv className="relative mb-[clamp(10px,2svh,24px)] pt-3">
          <span aria-hidden="true" className="absolute top-0 left-0 h-px w-14 bg-forest/40" />
          <span className={`${labelBase} text-[clamp(0.72rem,0.9vw,0.86rem)] tracking-[0.18em] text-forest/65`}>
            Certifications
          </span>
        </div>

        {/* Heading */}
        <h2
          ref={heading}
         
          aria-label="Fifty years in tea. Every certification earned."
          className="font-display text-[clamp(1.9rem,min(5vw,7.5svh),5.25rem)] leading-[1.02] font-medium tracking-[-0.025em]"
        >
          <span aria-hidden="true" className="line-mask">
            <span className="line-in">Fifty years in tea.</span>
          </span>
          <span aria-hidden="true" className="line-mask">
            <span className="line-in">
              Every <span className="accent-word">certification</span> earned.
            </span>
          </span>
        </h2>

        {/* Body */}
        <p
          data-rv
         
          className="mt-[clamp(18px,3.5svh,36px)] max-w-[46ch] font-label text-[clamp(0.98rem,1.15vw,1.15rem)] leading-[1.6] text-forest/75"
        >
          Each certification here is independently audited and renewed. Together they cover food safety,
          ethical sourcing and quality control from the plantation to the finished pack.
        </p>
      </div>

      {/* Logo marquee: full bleed, edges faded, pauses on hover */}
      <div
        data-rv
        className="mt-[clamp(40px,7svh,88px)] border-y border-forest/12 py-[clamp(26px,4.5svh,44px)] [--logo-gap:clamp(48px,6vw,104px)] [--logo-h:clamp(56px,6vw,84px)] [--marquee-duration:96s]"
      >
        <div className="marquee">
          <div className="marquee-track">
            <MarqueeGroup />
            <MarqueeGroup hidden />
          </div>
        </div>
      </div>
    </section>
  )
}
