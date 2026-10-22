import { Fragment, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'

import { BrandMark } from '@/components/hero/BrandMark'
import { scrambleText } from '@/lib/scramble'

gsap.registerPlugin(useGSAP)

const EYEBROW_PRIMARY = 'Sourcing · Blending · Packaging'
const EYEBROW_SECONDARY = 'TEA · SPICE · COCONUT'
const FOUNDED_YEAR = '1973'
const VIDEO_PLAYBACK_RATE = 0.6
const CREDENTIALS =['FSSC 22000', 'Fairtrade', 'Sri Lanka Tea Board GMP']

const labelBase = 'font-label uppercase font-semibold'

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const media = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const eyebrowRule = useRef<HTMLSpanElement>(null)
  const eyebrowSecondary = useRef<HTMLSpanElement>(null)
  const foundedYear = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      // Play the footage at 60% speed for a calmer drift
      if (video.current) {
        video.current.defaultPlaybackRate = VIDEO_PLAYBACK_RATE
        video.current.playbackRate = VIDEO_PLAYBACK_RATE
      }

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const nav = document.querySelector('[data-hero-nav]')
        const lines = gsap.utils.toArray<HTMLElement>('.line-in', root.current)
        const reveals = gsap.utils.toArray<HTMLElement>('[data-rv]', root.current)

        // Initial state (set before first paint by useGSAP's layout effect)
        gsap.set(nav, { yPercent: -80, opacity: 0 })
        gsap.set(lines, { yPercent: 108, opacity: 0 })
        gsap.set(reveals, { opacity: 0, y: 14 })
        gsap.set(eyebrowRule.current, { scaleX: 0 })
        gsap.set(media.current, { opacity: 0, scale: 1.08 })

        video.current?.play().catch(() => {})

        // Video fades up first; the type follows once the scene has some light in it.
        const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
        tl.to(media.current, { opacity: 1, duration: 1.75, ease: 'power1.inOut' }, 0)
          .to(media.current, { scale: 1, duration: 3.2, ease: 'power3.out' }, 0)
          .addLabel('type', 0.9)
          .to(nav, { yPercent: 0, opacity: 1, duration: 1.15 }, 'type')
          .to(eyebrowRule.current, { scaleX: 1, duration: 1.15, ease: 'power3.inOut' }, 'type')
          .to(reveals, { opacity: 1, y: 0, duration: 1.15, stagger: 0.06 }, 'type+=0.14')
          .to(lines, { yPercent: 0, opacity: 1, duration: 1.2, stagger: 0.085 }, 'type+=0.2')
          .call(() => {
            if (eyebrowSecondary.current) scrambleText(eyebrowSecondary.current, EYEBROW_SECONDARY, 0.8)
            if (foundedYear.current) scrambleText(foundedYear.current, FOUNDED_YEAR, 0.9)
          }, undefined, 'type+=0.5')
      })

      // Reduced motion: no reveal and a still frame instead of a looping video.
      mm.add('(prefers-reduced-motion: reduce)', () => {
        video.current?.pause()
      })

      // matchMedia is its own context; revert it so a remount starts from clean transforms
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section
      id="top"
      ref={root}
      className="relative isolate overflow-hidden pb-(--hero-tail) text-cream [--hero-tail:clamp(64px,8vw,128px)]"
    >
      {/* Background video + legibility overlays, as a rounded card on the beige page.
          The card runs past the first screen by --hero-tail (always taller than the
          corner radius), so on load the video fills the view edge to edge and the
          rounded bottom only appears as you scroll on. */}
      <div
        className="absolute inset-0 -z-10 overflow-hidden rounded-b-[clamp(28px,4.5vw,72px)] bg-ink"
        aria-hidden="true"
      >
        {/* Video and its grade fade in together */}
        <div ref={media} className="absolute inset-0">
          <video
            ref={video}
            className="h-full w-full object-cover [filter:saturate(1.3)_contrast(1.1)_brightness(0.98)]"
            src="/videos/plantation.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
          {/* Colour grade: a light soft-light wash warms the overcast sky toward gold
              and deepens the tea rows, on top of the saturation boost above. */}
          <div className="absolute inset-0 bg-[linear-gradient(170deg,rgb(235_185_95/0.45)_0%,rgb(90_170_100/0.3)_55%,rgb(20_100_70/0.45)_100%)] mix-blend-soft-light" />
        </div>
        {/* Top-down: keeps the nav and eyebrow readable, deepens toward the credentials */}
        <div className="hero-shade-top absolute inset-0" />
        {/* Left side shade behind the headline */}
        <div className="hero-shade-left absolute inset-0" />
        {/* Soft vignette */}
        <div className="hero-vignette absolute inset-0" />
        {/* Film grain */}
        <div className="absolute inset-0 opacity-[0.07] mix-blend-overlay [background-image:url(&quot;data:image/svg+xml,%3Csvg_xmlns='http://www.w3.org/2000/svg'_width='160'_height='160'%3E%3Cfilter_id='n'%3E%3CfeTurbulence_type='fractalNoise'_baseFrequency='0.9'_numOctaves='2'_stitchTiles='stitch'/%3E%3C/filter%3E%3Crect_width='100%25'_height='100%25'_filter='url(%23n)'/%3E%3C/svg%3E&quot;)]" />
      </div>

      <div className="relative flex min-h-svh flex-col px-(--hero-mx) pb-[clamp(20px,3.6vh,44px)]">
        {/* Eyebrow tag stack, top right */}
        <div className="flex justify-end pt-[clamp(104px,17vh,190px)]">
          <div className="relative flex flex-col items-end gap-2 pt-4 text-right">
            <span
              ref={eyebrowRule}
              aria-hidden="true"
              className="absolute top-0 right-0 h-px w-14 origin-right bg-cream/50"
            />
            <span
              data-rv
              className={`${labelBase} text-[clamp(0.72rem,0.95vw,0.92rem)] tracking-[0.16em] text-cream`}
            >
              {EYEBROW_PRIMARY}
            </span>
            <span
              data-rv
              className={`${labelBase} text-[clamp(0.64rem,0.72vw,0.72rem)] tracking-[0.2em] text-cream-dim`}
            >
              <span ref={eyebrowSecondary}>{EYEBROW_SECONDARY}</span>
            </span>
          </div>
        </div>

        {/* Headline: each .line-mask is one masked reveal. The first row is two
            masks so it can break onto two lines on phones. */}
        <h1
          aria-label="Taking Sri Lanka's tea and spice to the world"
          className="mt-auto mb-[clamp(28px,5.5vh,68px)] font-display text-[clamp(2.2rem,12vw,3.9rem)] leading-[1] font-medium tracking-[-0.03em] whitespace-nowrap sm:text-[clamp(2.8rem,8vw,9.6rem)]"
        >
          <span aria-hidden="true" className="block">
            <span className="line-mask sm:inline-block sm:align-top">
              <span className="line-in">
                <BrandMark className="mr-[0.14em] size-[0.72em] align-[-0.01em] text-cream/65" />
                Taking
              </span>
            </span>{' '}
            <span className="line-mask sm:inline-block sm:align-top">
              <span className="line-in">Sri Lanka’s</span>
            </span>
          </span>
          <span aria-hidden="true" className="line-mask">
            <span className="line-in">
              <span className="accent-word">tea</span> and <span className="accent-word">spice</span>
            </span>
          </span>
          <span aria-hidden="true" className="line-mask">
            <span className="line-in">to the world</span>
          </span>
        </h1>

        {/* Credentials strip + scroll indicator */}
        <div
          data-rv
          className="flex items-end justify-between gap-6 border-t border-hairline pt-[clamp(14px,2.2vh,22px)]"
        >
          <div className={`${labelBase} flex min-w-0 flex-col gap-1.5 text-[clamp(0.6rem,0.7vw,0.7rem)] leading-[1.4] tracking-[0.18em]`}>
            <span className="text-cream">
              Family owned since <span ref={foundedYear}>{FOUNDED_YEAR}</span>
            </span>
            <span className="text-cream-dim">
              {CREDENTIALS.map((item, i) => (
                <Fragment key={item}>
                  {i > 0 && ' · '}
                  <span className="whitespace-nowrap">{item}</span>
                </Fragment>
              ))}
            </span>
          </div>

          <a
            href="#about"
            aria-label="Scroll to next section"
            className={`${labelBase} flex shrink-0 flex-col items-end gap-1.5 text-[clamp(0.6rem,0.7vw,0.7rem)] tracking-[0.2em] text-cream-dim transition-colors hover:text-cream`}
          >
            <span aria-hidden="true" className="scroll-tick text-[0.85rem] leading-none tracking-[0.3em] text-cream">
              + +
            </span>
            Scroll
          </a>
        </div>
      </div>
    </section>
  )
}
