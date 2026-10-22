import { useEffect, useRef, useState } from 'react'
import { Tabs } from '@base-ui/react/tabs'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'
import { motion, MotionConfig } from 'motion/react'

import { cn } from '@/lib/utils'

gsap.registerPlugin(useGSAP, ScrollTrigger)

type Machine = {
  id: string
  name: string
  category: string
  description: string
  photo: { src: string; alt: string }
  pack: { src: string; alt: string }
}

// Machine photos are manufacturer studio shots: imagroup.com (IMA C2000, IMA C28-E,
// IMA MaiSa EC12C as a representative MaiSa model) and teepack.com (Constanta).
// Pack photos are generic: Adamexpo's own tea bag shot and free Unsplash images.
const MACHINES: Machine[] = [
  {
    id: 'ima-c2000',
    name: 'IMA C2000',
    category: 'Tea Bag & Overwrap',
    description:
      'Our flagship tea bag line. It folds, fills, seals and overwraps each bag, ready to go straight into your box or carton.',
    photo: { src: '/images/packaging/ima-c2000.webp', alt: 'IMA C2000 tea bag packaging machine' },
    pack: { src: '/images/products/tea-bags.jpg', alt: 'Heat sealed staple free tea bags beside a cup of tea' },
  },
  {
    id: 'ima-c28',
    name: 'IMA C28',
    category: 'Pyramid Sachets',
    description:
      'Built for pyramid mesh sachets, for brands that want a premium steep and a premium look on the shelf.',
    photo: { src: '/images/packaging/ima-c28.webp', alt: 'IMA C28 tea bag packaging machine' },
    pack: { src: '/images/packaging/pack-pyramid.webp', alt: 'Pyramid mesh tea sachets filled with loose leaf' },
  },
  {
    id: 'maisa',
    name: 'Maisa',
    category: 'Carton & Case Packing',
    description:
      'Takes finished packs and loads them into cartons and cases, so what leaves our floor is retail-ready, not just factory-ready.',
    photo: { src: '/images/packaging/maisa.webp', alt: 'IMA MaiSa packaging machine' },
    pack: { src: '/images/packaging/pack-carton.webp', alt: 'Plain kraft retail carton' },
  },
  {
    id: 'constanta',
    name: 'Constanta',
    category: 'Flow-Wrap Pouches',
    description:
      'Flow-wraps loose leaf and spice into sealed pouches and sachets, built for the format you’re selling in.',
    photo: { src: '/images/packaging/teepack-constanta.webp', alt: 'Teepack Constanta packaging machine' },
    pack: { src: '/images/packaging/pack-pouch.webp', alt: 'Sealed kraft paper pouch' },
  },
]

const labelBase = 'font-label uppercase font-semibold'

function MachinePanel({ machine }: { machine: Machine }) {
  return (
    <div className="panel-in grid gap-[clamp(20px,3vw,48px)] rounded-[22px] bg-paper p-[clamp(16px,2.4vw,36px)] md:grid-cols-[1.15fr_1fr]">
      {/* Machine photo: studio shots on white, multiplied into the panel colour */}
      <div className="flex aspect-[4/3] items-center justify-center md:aspect-auto md:min-h-[clamp(320px,34vw,480px)]">
        <img
          src={machine.photo.src}
          alt={machine.photo.alt}
          className="max-h-full w-full object-contain mix-blend-multiply"
          draggable={false}
        />
      </div>

      <div className="flex flex-col">
        <span className={`${labelBase} text-[clamp(0.68rem,0.8vw,0.78rem)] tracking-[0.18em] text-forest/60`}>
          {machine.category}
        </span>
        <h3 className="mt-3 font-display text-[clamp(1.9rem,3.2vw,3.2rem)] leading-[1.02] font-medium tracking-[-0.025em]">
          {machine.name}
        </h3>
        <p className="mt-4 max-w-[40ch] font-label text-[clamp(0.95rem,1.05vw,1.08rem)] leading-[1.6] text-forest/75">
          {machine.description}
        </p>

        {/* Output: what this machine produces */}
        <figure className="mt-auto pt-[clamp(20px,3vw,36px)]">
          <figcaption className={`${labelBase} mb-2.5 text-[0.66rem] tracking-[0.18em] text-forest/55`}>
            Finished pack
          </figcaption>
          <img
            src={machine.pack.src}
            alt={machine.pack.alt}
            loading="lazy"
            className="aspect-[3/2] w-full max-w-[300px] rounded-[12px] object-cover"
            draggable={false}
          />
        </figure>
      </div>
    </div>
  )
}

export function Packaging() {
  const root = useRef<HTMLElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const [active, setActive] = useState(MACHINES[0].id)

  // Warm the cache so switching machines never waits on an image
  useEffect(() => {
    MACHINES.forEach((m) => {
      new Image().src = m.photo.src
      new Image().src = m.pack.src
    })
  }, [])

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
      id="packaging"
      ref={root}
      className="relative pt-[clamp(88px,14svh,160px)] pb-[clamp(88px,14svh,160px)] text-forest"
    >
      <div className="px-(--hero-mx)">
        {/* Eyebrow */}
        <div data-rv className="relative mb-[clamp(10px,2svh,24px)] pt-3">
          <span aria-hidden="true" className="absolute top-0 left-0 h-px w-14 bg-forest/40" />
          <span className={`${labelBase} text-[clamp(0.72rem,0.9vw,0.86rem)] tracking-[0.18em] text-forest/65`}>
            Packaging &amp; Private Label
          </span>
        </div>

        {/* Heading left, body copy pushed to the far right and bottom-aligned with
            the heading. Heading lines never wrap; the copy column narrows instead.
            Below lg the copy stacks under the heading. */}
        <div className="flex flex-col gap-[clamp(18px,3.5svh,36px)] lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <h2
            ref={heading}
            aria-label="Packed to your spec. Branded as your own."
            className="font-display text-[clamp(1.9rem,min(5vw,7.5svh),5.25rem)] leading-[1.02] font-medium tracking-[-0.025em] lg:shrink-0 lg:whitespace-nowrap"
          >
            <span aria-hidden="true" className="line-mask">
              <span className="line-in">
                <span className="accent-word">Packed</span> to your spec.
              </span>
            </span>
            <span aria-hidden="true" className="line-mask">
              <span className="line-in">
                <span className="accent-word">Branded</span> as your own.
              </span>
            </span>
          </h2>

          <p
            data-rv
            className="max-w-[42ch] font-label text-[clamp(0.98rem,1.15vw,1.15rem)] leading-[1.6] text-forest/75 lg:mb-[0.4em] lg:min-w-[26ch]"
          >
            Every machine on our floor prints, labels and packs to your brand. Loose leaf, tea bags, spice tins or
            pouches, whatever the format, it leaves here under your name.
          </p>
        </div>

        {/* Machine selector: list on the left, detail panel on the right */}
        <MotionConfig reducedMotion="user">
          <Tabs.Root
            data-rv
            value={active}
            onValueChange={(value) => setActive(value as string)}
            orientation="vertical"
            className="mt-[clamp(40px,7svh,88px)] grid gap-[clamp(16px,2.5vw,40px)] lg:grid-cols-[minmax(240px,1fr)_2.4fr] lg:items-start"
          >
            <Tabs.List aria-label="Packaging machines" activateOnFocus className="flex flex-col gap-1">
              {MACHINES.map((m, i) => (
                <Tabs.Tab
                  key={m.id}
                  value={m.id}
                  className="group relative flex cursor-pointer items-center gap-4 rounded-[14px] px-5 py-[clamp(14px,2svh,20px)] text-left text-forest/50 transition-colors duration-300 outline-none not-data-active:hover:text-forest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest data-active:text-cream"
                >
                  {m.id === active && (
                    <motion.span
                      layoutId="machine-fill"
                      aria-hidden="true"
                      className="absolute inset-0 rounded-[14px] bg-forest"
                      transition={{ type: 'spring', stiffness: 420, damping: 38 }}
                    />
                  )}
                  <span className={`${labelBase} relative text-[0.68rem] tracking-[0.14em] tabular-nums opacity-70`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="relative font-display text-[clamp(1.1rem,1.5vw,1.45rem)] leading-tight font-medium tracking-[-0.015em]">
                    {m.name}
                  </span>
                  {/* Accent mark on the active row */}
                  <ArrowRight
                    aria-hidden="true"
                    className={cn(
                      'relative ml-auto size-4 transition-all duration-300',
                      m.id === active ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0',
                    )}
                  />
                </Tabs.Tab>
              ))}
            </Tabs.List>

            {MACHINES.map((m) => (
              <Tabs.Panel key={m.id} value={m.id} keepMounted className="outline-none">
                <MachinePanel machine={m} />
              </Tabs.Panel>
            ))}
          </Tabs.Root>
        </MotionConfig>
      </div>
    </section>
  )
}
