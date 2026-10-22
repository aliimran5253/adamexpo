import { useRef, useState, type FormEvent } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

import { Aurora } from '@/components/ui/aurora'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// PLACEHOLDER contact details: replace with Adamexpo's real phone, email, address
// and social profiles before launch.
const CONTACT = {
  phone: '+94 11 234 5678',
  phoneHref: 'tel:+94112345678',
  email: 'trade@adamexpo.com',
  address: ['Adamexpo (Pvt) Ltd', 'Colombo, Sri Lanka'],
  whatsapp: 'https://wa.me/94112345678',
  linkedin: 'https://www.linkedin.com/company/adamexpo',
}


const LINK_COLUMNS = [
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#about' },
      { label: 'Certifications', href: '#certifications' },
      { label: 'Careers', href: '#careers' },
      { label: 'Blog', href: '#blog' },
      { label: 'Contacts', href: '#contact' },
    ],
  },
  {
    title: 'Products',
    links: [
      { label: 'Tea', href: '#products' },
      { label: 'Spices', href: '#products' },
      { label: 'Coconut', href: '#products' },
      { label: 'Private Label', href: '#packaging' },
    ],
  },
]

const labelBase = 'font-label uppercase font-semibold'

function LinkedInGlyph() {
  // LinkedIn's "in" mark (the brand box is dropped; the circle button frames it)
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[17px]" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452z" />
    </svg>
  )
}

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[18px]" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}

function SocialsAndAddress() {
  return (
    <div>
      <div className="flex gap-2.5">
        <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" aria-label="Adamexpo on WhatsApp" className={socialButton}>
          <WhatsAppGlyph />
        </a>
        <a href={CONTACT.linkedin} target="_blank" rel="noreferrer" aria-label="Adamexpo on LinkedIn" className={socialButton}>
          <LinkedInGlyph />
        </a>
      </div>
      <address className="mt-4 font-label text-[0.92rem] leading-relaxed text-cream/70 not-italic">
        {CONTACT.address.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </address>
    </div>
  )
}

const socialButton =
  'grid size-11 place-items-center rounded-full border border-cream/30 text-cream transition-colors duration-300 hover:border-cream hover:bg-cream hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream'

export function Footer() {
  const root = useRef<HTMLElement>(null)
  const headline = useRef<HTMLHeadingElement>(null)
  const [sent, setSent] = useState(false)

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
          scrollTrigger: { trigger: headline.current, start: 'top 88%', once: true },
        })
        reveals.forEach((el) => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 94%', once: true },
          })
        })
      })

      // matchMedia is its own context; revert it so a remount starts from clean transforms
      return () => mm.revert()
    },
    { scope: root },
  )

  // Not connected to a backend yet: acknowledge locally so the form feels finished
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <footer
      id="contact"
      ref={root}
      className="relative z-10 px-(--hero-mx) pt-[clamp(8px,2svh,24px)] pb-[clamp(16px,2vw,32px)] text-cream"
    >
      {/* One rounded panel: the aurora gradient runs its full height, and every row
          (links, contact, CTA, copyright) sits directly on it in light colours.
          The beige page shows around the rounded corners. */}
      <div data-rv className="relative isolate overflow-hidden rounded-[28px]">
        {/* Aurora: blurred blobs bridging the brand greens through teal to a soft plum */}
        <Aurora />

        <div className="px-[clamp(22px,3vw,48px)] pt-[clamp(24px,3vw,44px)]">
          {/* 1-2. Logo with socials + address beneath it, link columns, quote button +
              contact with the established mark beneath it. The outer columns stretch
              to the height of the link lists, so the socials sit right under the nav
              rather than in a separate row. */}
          <div className="grid grid-cols-2 gap-x-[clamp(24px,4vw,72px)] gap-y-8 lg:grid-cols-[1.3fr_1fr_1fr_auto]">
            <div className="col-span-2 flex flex-col justify-between gap-8 lg:col-span-1">
              <a href="#top" aria-label="Adamexpo home" className="flex items-center gap-2.5 self-start">
                <span
                  aria-hidden="true"
                  className="block aspect-[256/225] h-8 bg-current [mask:url(/images/brand/adamexpo-ideogram.png)_center/contain_no-repeat]"
                />
                <span className="font-display text-[1.3rem] font-[650] tracking-[0.02em]">ADAMEXPO</span>
              </a>
              <div className="max-lg:hidden">
                <SocialsAndAddress />
              </div>
            </div>

            {LINK_COLUMNS.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h3 className={`${labelBase} text-[0.7rem] tracking-[0.18em] text-cream/55`}>{col.title}</h3>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="font-label text-[0.98rem] text-cream/80 transition-colors hover:text-cream hover:underline hover:underline-offset-4"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <div className="col-span-2 flex flex-col items-start justify-between gap-6 lg:col-span-1 lg:items-end lg:text-right">
              <div className="flex flex-col items-start gap-4 lg:items-end">
                <a
                  href="#quote"
                  className="group inline-flex items-center gap-2.5 rounded-full bg-cream px-6 py-3.5 font-label text-[0.82rem] font-semibold tracking-[0.12em] text-ink uppercase transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
                >
                  Request a Quote
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
                <div className="flex flex-col gap-1.5 font-label text-[0.95rem]">
                  <a href={CONTACT.phoneHref} className="text-cream/80 hover:text-cream">
                    {CONTACT.phone}
                  </a>
                  <a href={`mailto:${CONTACT.email}`} className="text-cream/80 hover:text-cream">
                    {CONTACT.email}
                  </a>
                </div>
              </div>
              {/* Below lg the socials + address come here, beside the established mark */}
              <div className="flex w-full items-end justify-between gap-6 lg:w-auto">
                <div className="lg:hidden">
                  <SocialsAndAddress />
                </div>
                <div className="flex items-center gap-3 text-cream/50">
                  <span
                    aria-hidden="true"
                    className="block aspect-[256/225] h-6 bg-current [mask:url(/images/brand/adamexpo-ideogram.png)_center/contain_no-repeat]"
                  />
                  <span className={`${labelBase} text-[0.7rem] tracking-[0.2em]`}>Est. 1973</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. CTA row */}
          <section
            id="quote"
            aria-labelledby="quote-heading"
            className="mt-[clamp(28px,3.5vw,48px)] grid gap-[clamp(24px,4vw,64px)] border-t border-cream/15 pt-[clamp(28px,3.5vw,48px)] lg:grid-cols-[1.35fr_1fr] lg:items-end"
          >
            <h2
              id="quote-heading"
              ref={headline}
              aria-label="Can't find the blend or pack size you need?"
              className="font-display text-[clamp(1.85rem,5.2vw,5.4rem)] leading-[1.02] font-semibold tracking-[-0.03em]"
            >
              <span aria-hidden="true" className="line-mask">
                <span className="line-in">Can’t find the</span>
              </span>
              <span aria-hidden="true" className="line-mask">
                <span className="line-in">
                  <span className="accent-word font-medium">blend</span> or pack size
                </span>
              </span>
              <span aria-hidden="true" className="line-mask">
                <span className="line-in">you need?</span>
              </span>
            </h2>

            <div className="lg:pb-[0.6em]">
              <p className="max-w-[36ch] font-label text-[clamp(0.98rem,1.15vw,1.12rem)] leading-[1.6] text-cream/80">
                Tell us what you’re looking for and we’ll get back to you.
              </p>
              {sent ? (
                <p role="status" className="mt-6 font-label text-[1rem] text-cream">
                  Thanks, we’ll be in touch shortly.
                </p>
              ) : (
                <form onSubmit={onSubmit} className="relative mt-6 max-w-[440px]">
                  <label htmlFor="quote-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="quote-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="Your email address"
                    className="h-14 w-full rounded-full border border-cream/25 bg-cream/10 pr-16 pl-6 font-label text-[1rem] text-cream backdrop-blur-sm transition-colors outline-none placeholder:text-cream/55 focus:border-cream/70 focus:bg-cream/15"
                  />
                  <button
                    type="submit"
                    aria-label="Send"
                    className="absolute top-1.5 right-1.5 grid size-11 cursor-pointer place-items-center rounded-full bg-cream text-ink transition-transform duration-300 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
                  >
                    <ArrowRight aria-hidden="true" className="size-5" />
                  </button>
                </form>
              )}
            </div>
          </section>

          {/* 4. Bottom row */}
          <div className="mt-[clamp(28px,4vw,56px)] flex items-center justify-between gap-6 border-t border-cream/20 py-5 font-label text-[0.85rem] text-cream/70">
            <span>© 2026 Adamexpo</span>
            <a href="#privacy" className="transition-colors hover:text-cream">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
