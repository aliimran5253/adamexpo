import { useEffect, useState } from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Aurora } from '@/components/ui/aurora'
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const PRIMARY_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Products', href: '#products' },
  { label: 'Certifications', href: '#certifications' },
]

// Placeholder destinations for the "Meet us" menu; swap in real pages/events.
const MEET_US_LINKS = [
  { label: 'Trade fairs', href: '#trade-fairs' },
  { label: 'Visit our facility', href: '#visit' },
  { label: 'Book a sourcing call', href: '#contact' },
]

const labelClass =
  'font-label text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-cream'

function NavLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      className={cn(
        labelClass,
        'has-roll relative after:absolute after:inset-x-0 after:-bottom-1.5 after:h-px after:origin-left after:scale-x-0 after:bg-cream after:transition-transform after:duration-500 after:ease-cta hover:after:scale-x-100',
      )}
    >
      <span className="roll">
        <span>{label}</span>
        <span aria-hidden="true">{label}</span>
      </span>
    </a>
  )
}

function PlusIcon({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative inline-block size-2.5 transition-transform duration-500 ease-cta',
        open && 'rotate-45',
      )}
    >
      <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
      <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current" />
    </span>
  )
}

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false)
  const [meetOpen, setMeetOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      data-hero-nav
      className={cn(
        'fixed inset-x-0 top-0 z-50 grid grid-cols-[1fr_auto] items-center border-b border-transparent px-(--hero-mx) py-5 transition-[background,backdrop-filter,border-color,padding] duration-500 ease-cta lg:grid-cols-[1fr_auto_1fr]',
        scrolled && 'border-hairline py-3.5 backdrop-blur-xl backdrop-saturate-150',
      )}
    >
      {/* Same aurora as the footer, fading in once the page scrolls */}
      <Aurora
        compact
        className={cn('transition-opacity duration-500 ease-cta', scrolled ? 'opacity-[0.92]' : 'opacity-0')}
      />
      <a href="#top" aria-label="Adamexpo home" className="flex items-center gap-2.5 text-cream">
        {/* Ideogram, used as a mask so it takes the nav's cream text colour */}
        <span
          aria-hidden="true"
          className="block h-7 aspect-[256/225] bg-current [mask:url(/images/brand/adamexpo-ideogram.png)_center/contain_no-repeat]"
        />
        <span className="font-display text-[1.2rem] font-[650] tracking-[0.02em]">
          ADAMEXPO
        </span>
      </a>

      <div className="hidden items-center gap-[clamp(26px,2.6vw,46px)] justify-self-center lg:flex">
        {PRIMARY_LINKS.map((link) => (
          <NavLink key={link.href} {...link} />
        ))}
      </div>

      <div className="hidden items-center gap-[clamp(20px,2vw,34px)] justify-self-end lg:flex">
        <NavLink label="Contact" href="#contact" />
        <DropdownMenu open={meetOpen} onOpenChange={setMeetOpen}>
          <DropdownMenuTrigger
            className={cn(labelClass, 'flex cursor-pointer items-center gap-2.5 outline-none focus-visible:underline')}
          >
            Meet us <PlusIcon open={meetOpen} />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={14}
            className="relative isolate w-56 rounded-none border border-hairline bg-transparent p-1.5 text-cream ring-0 backdrop-blur-xl"
          >
            <Aurora className="opacity-[0.92]" />
            {MEET_US_LINKS.map((item) => (
              <DropdownMenuItem
                key={item.href}
                render={<a href={item.href} />}
                className="rounded-none px-3 py-2.5 font-label text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-cream/80 focus:bg-cream/10 focus:text-cream"
              >
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile menu */}
      <Sheet>
        <SheetTrigger
          aria-label="Open menu"
          className="flex h-8 w-8 cursor-pointer flex-col items-end justify-center gap-1.5 justify-self-end lg:hidden"
        >
          <span className="block h-[1.5px] w-6 bg-cream" />
          <span className="block h-[1.5px] w-4 bg-cream" />
        </SheetTrigger>
        <SheetContent
          side="right"
          className="isolate overflow-hidden border-hairline bg-transparent px-6 pt-20 data-[side=right]:w-full text-cream backdrop-blur-2xl sm:max-w-sm"
        >
          <Aurora className="opacity-[0.96]" />
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <div className="flex flex-col border-t border-hairline">
            {[...PRIMARY_LINKS, { label: 'Contact', href: '#contact' }, ...MEET_US_LINKS].map(
              (link, i) => (
                <SheetClose
                  key={link.href + link.label}
                  render={<a href={link.href} />}
                  nativeButton={false}
                  className="flex items-baseline gap-4 border-b border-hairline py-4 font-display text-[clamp(1.5rem,7vw,2.2rem)] leading-none font-medium uppercase tracking-[-0.02em]"
                >
                  <span className="font-label text-[0.68rem] font-semibold tracking-[0.12em] text-cream-dim">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {link.label}
                </SheetClose>
              ),
            )}
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  )
}
