import { gsap } from 'gsap'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const DIGITS = '0123456789'

type ScrambleEl = HTMLElement & { _scramble?: gsap.core.Tween }

function randomGlyph(target: string, current: string) {
  const pool = /\d/.test(target) ? DIGITS : LETTERS
  let next: string
  do next = pool.charAt(Math.floor(Math.random() * pool.length))
  while (next === current || next === target.toUpperCase())
  return next
}

/**
 * Decode-style text reveal: each character cycles through random glyphs and
 * resolves left to right. Character widths are locked to the final glyph so
 * the line never jitters while it scrambles.
 */
export function scrambleText(el: HTMLElement, text = el.textContent ?? '', duration = 0.8) {
  const node = el as ScrambleEl
  node._scramble?.kill()

  // Non-breaking spaces: a plain space inside an inline-block span collapses to zero width
  const chars = text.split('').map((ch) => (ch === ' ' ? ' ' : ch))
  node.textContent = ''
  const spans = chars.map((ch) => {
    const span = document.createElement('span')
    span.className = 'sc'
    span.textContent = ch
    node.appendChild(span)
    return span
  })

  const widths = spans.map((s) => s.getBoundingClientRect().width)
  spans.forEach((s, i) => {
    s.style.width = `${widths[i].toFixed(2)}px`
    if (/[0-9a-z]/i.test(chars[i])) {
      s.classList.add('u')
      s.textContent = randomGlyph(chars[i], '')
    }
  })

  const step = (duration - 0.12) / chars.length
  const clock = { t: 0 }
  let lastSwap = 0

  const finish = () => {
    node.textContent = text
    node._scramble = undefined
  }

  node._scramble = gsap.to(clock, {
    t: duration,
    duration,
    ease: 'none',
    onUpdate() {
      const swap = clock.t - lastSwap >= 0.066
      if (swap) lastSwap = clock.t
      spans.forEach((s, i) => {
        if (!s.classList.contains('u')) return
        if (clock.t >= 0.12 + (i + 1) * step) {
          s.classList.remove('u')
          s.textContent = chars[i]
        } else if (swap) {
          s.textContent = randomGlyph(chars[i], s.textContent ?? '')
        }
      })
    },
    onComplete: finish,
    onInterrupt: finish,
  })

  return node._scramble
}
