
import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ArrowUpRight, Sprout } from 'lucide-react'

function App() {
  const logoRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.brand-sprout', {
        scale: 0,
        rotation: -35,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.7)',
      })

      gsap.from('.brand-name', {
        x: -12,
        opacity: 0,
        duration: 0.7,
        delay: 0.2,
        ease: 'power3.out',
      })

      gsap.from('.brand-underline', {
        scaleX: 0,
        duration: 0.6,
        delay: 0.65,
        transformOrigin: 'left',
        ease: 'power2.out',
      })
    }, logoRef)

    return () => ctx.revert()
  }, [])

  return (
    <main className="min-h-screen bg-[#eae3d4] px-5 py-5 text-[#352e20] md:px-10">
      <nav className="mx-auto flex max-w-7xl items-center justify-between border-b border-[#352e20]/15 pb-5">
        <a
          ref={logoRef}
          href="#"
         className="brand-logo group relative flex items-center gap-2.5 text-3xl font-semibold text-[#35583b]"
style={{ fontFamily: "'Caveat', cursive" }}
          aria-label="AgriSync home"
        >
          <Sprout
            className="brand-sprout transition-transform duration-300 group-hover:rotate-12"
            size={25}
            strokeWidth={1.8}
          />

          <span className="relative">
            <span className="brand-name inline-block">AgriSync</span>
            <span className="brand-underline absolute -bottom-1 left-0 h-[2px] w-full rounded-full bg-[#8ca77b]" />
          </span>
        </a>

        <div className="hidden items-center gap-7 text-sm md:flex">
          <a href="#solutions">Solutions</a>
          <a href="#technology">Technology</a>
          <a href="#analytics">Analytics</a>
        </div>

        <a
          href="#analysis"
          className="flex items-center gap-2 rounded-xl bg-[#302a1d] px-4 py-3 text-sm text-[#f4eddf] transition hover:bg-[#4b4930]"
        >
          Get Started <ArrowUpRight size={16} />
        </a>
      </nav>

      <section className="mx-auto flex max-w-5xl flex-col items-center pt-16 text-center md:pt-24">
        <span className="rounded-full bg-[#dcd4c2] px-4 py-2 text-xs tracking-wide">
          INTELLIGENT AGRICULTURE
        </span>

        <h1 className="mt-7 max-w-4xl font-serif text-4xl leading-[1.08] tracking-[-0.045em] sm:text-5xl md:text-7xl">
          Precision Farming and Soil
          <br className="hidden md:block" /> Health Monitoring
        </h1>

        <p className="mt-6 max-w-xl text-sm leading-7 text-[#6b634f] md:text-base">
          Understand your soil. Discover its potential. Make smarter crop
          decisions with AI-powered nutrient assessment and intelligent
          agricultural insights.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="#analysis"
            className="rounded-xl bg-[#302a1d] px-6 py-3.5 text-sm text-[#f4eddf] transition hover:-translate-y-1"
          >
            Analyze Your Soil ↗
          </a>

          <a
            href="#technology"
            className="rounded-xl border border-[#352e20]/20 px-6 py-3.5 text-sm transition hover:bg-[#ded6c5]"
          >
            Explore Technology
          </a>
        </div>

        <div className="mt-12 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#dcd4c2] shadow-[inset_3px_3px_7px_#c9c1b0,inset_-3px_-3px_7px_#f8f1e2]">
          <Sprout size={28} strokeWidth={1.4} />
        </div>

        <p className="mt-4 text-xs tracking-[0.2em] text-[#77705e]">
          GROW WITH BETTER INSIGHTS
        </p>
      </section>
    </main>
  )
}

export default App