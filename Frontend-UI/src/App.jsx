
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

<section className="mx-auto grid min-h-[75vh] max-w-7xl grid-cols-1 items-center gap-10 py-12 md:grid-cols-2 md:gap-8">
  <div className="flex flex-col items-start text-left">
    <span className="rounded-full bg-[#dcd4c2] px-4 py-2 text-xs tracking-wide text-[#35583b]">
      INTELLIGENT AGRICULTURE
    </span>

    <h1 className="mt-7 max-w-xl text-left font-serif text-4xl leading-[1.08] tracking-[-0.045em] sm:text-5xl md:text-6xl lg:text-7xl">
      Precision Farming
      <br />
      and Soil
      <br />
      <span className="italic text-[#52764a]">Health Monitoring</span>
    </h1>

    <p className="mt-6 max-w-lg text-left text-sm leading-7 text-[#6b634f] md:text-base">
      Understand your soil. Discover its potential. Make smarter crop
      decisions with AI-powered nutrient assessment and intelligent
      agricultural insights.
    </p>

    <div className="mt-8 flex flex-wrap justify-start gap-3">
      <a
        href="#analysis"
        className="rounded-xl bg-[#35583b] px-6 py-3.5 text-sm text-white transition hover:-translate-y-1 hover:bg-[#29452e]"
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

    <div className="mt-10 flex items-center gap-3 text-sm text-[#6b634f]">
      <Sprout size={22} className="text-[#52764a]" />
      <span>Grow with better insights</span>
    </div>
  </div>

  <div className="relative flex min-h-[400px] items-center justify-center md:min-h-[560px]">
    <div className="absolute h-[80%] w-[80%] rounded-full bg-[#dcd4c2]" />
    <div className="absolute h-[65%] w-[65%] rounded-full border border-[#8ca77b]/40" />

    <img
      src="/images/farmer/farmer-01.png"
      alt="Farmer in an agricultural setting"
      className="relative z-10 max-h-[520px] w-full object-contain"
    />

    <div className="absolute left-0 top-[22%] z-20 rounded-2xl border border-white/70 bg-[#fffdf7]/90 p-4 shadow-lg backdrop-blur-md">
      <p className="text-xs text-[#77705e]">Soil analysis</p>
      <p className="mt-1 font-semibold text-[#35583b]">Know your soil</p>
    </div>

    <div className="absolute bottom-[20%] right-0 z-20 rounded-2xl border border-white/70 bg-[#fffdf7]/90 p-4 shadow-lg backdrop-blur-md">
      <p className="text-xs text-[#77705e]">Smart advisory</p>
      <p className="mt-1 font-semibold text-[#35583b]">Grow smarter</p>
    </div>
  </div>
</section>

    </main>
  )
}

export default App
