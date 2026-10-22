import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

gsap.registerPlugin(ScrollTrigger)

// Inertia scrolling for wheel and trackpad: the page glides and eases to a stop
// instead of jumping a full notch. Touch keeps native scrolling (syncTouch off).
// Lenis runs on GSAP's ticker, so ScrollTrigger reads the same smoothed position
// every frame and scroll-linked motion stays in step with the page.
export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      lerp: 0.08,
      wheelMultiplier: 0.8,
      autoRaf: false,
      // Header and footer "#…" links glide to their section
      anchors: true,
      // Let the dropdown menu and the carousel track scroll on their own
      allowNestedScroll: true,
    })

    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      gsap.ticker.lagSmoothing(500, 33)
      lenis.destroy()
    }
  }, [])
}
