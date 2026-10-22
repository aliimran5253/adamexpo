import { Certifications } from '@/components/certifications/Certifications'
import { Footer } from '@/components/footer/Footer'
import { Founder } from '@/components/founder/Founder'
import { Hero } from '@/components/hero/Hero'
import { MeetUs } from '@/components/meet-us/MeetUs'
import { Packaging } from '@/components/packaging/Packaging'
import { Products } from '@/components/products/Products'
import { SiteNav } from '@/components/hero/SiteNav'
import { useSmoothScroll } from '@/lib/smooth-scroll'

function App() {
  useSmoothScroll()

  return (
    <>
      <SiteNav />
      <main className="relative z-10">
        <Hero />
        <Products />
        <Certifications />
        <Packaging />
        <Founder />
        <MeetUs />
      </main>
      <Footer />
    </>
  )
}

export default App
