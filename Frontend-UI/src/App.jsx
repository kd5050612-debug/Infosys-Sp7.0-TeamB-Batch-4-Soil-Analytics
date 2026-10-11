
import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ArrowUpRight, Sprout, LogOut, UserRound } from 'lucide-react'
import Testimonials from './components/Testimonials'
import FeedbackSection from './components/FeedbackSection'
import AuthModal from './components/AuthModal'

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [imageIndex, setImageIndex] = useState(0)

  const logoRef = useRef(null)
  const farmerRef = useRef(null)

  const farmerImages = [
    '/images/farmer/farmer-01.png',
    '/images/farmer/farmer-02.png',
    '/images/farmer/farmer-03.png',
    '/images/farmer/farmer-04.png',
    '/images/farmer/farmer-05.png',
  ]

  const farmerPositions = [
    { x: 0, y: 0, scale: 1 },
    { x: 30, y: 0, scale: 1 },
    { x: 0, y: 0, scale: 1 },
    { x: 0, y: 0, scale: 1 },
    { x: 0, y: 0, scale: 1 },
  ]

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

      gsap.to('.orbit-track', {
        rotation: 360,
        duration: 18,
        repeat: -1,
        ease: 'none',
        transformOrigin: '50% 50%',
      })

      gsap.to('.orbit-card', {
        rotation: -360,
        duration: 18,
        repeat: -1,
        ease: 'none',
        transformOrigin: '50% 50%',
      })
    })

    return () => ctx.revert()
  }, [])

  useLayoutEffect(() => {
    const timer = window.setInterval(() => {
      setImageIndex((current) => (current + 1) % farmerImages.length)
    }, 2800)

    return () => window.clearInterval(timer)
  }, [farmerImages.length])

  useLayoutEffect(() => {
    if (!farmerRef.current) return

    gsap.fromTo(
      farmerRef.current,
      { opacity: 0.3 },
      {
        opacity: 1,
        duration: 0.55,
        ease: 'power2.out',
        clearProps: 'opacity',
      },
    )
  }, [imageIndex])

  function handleAuthSuccess(user) {
    setCurrentUser(user)
  }

  async function handleLogout() {
    try {
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } finally {
      setCurrentUser(null)
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#eae3d4] px-5 py-3 text-[#352e20] md:px-10">
      <nav className="mx-auto flex max-w-7xl items-center justify-between border-b border-[#352e20]/15 pb-3">
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
          <a href="#solutions" className="transition hover:text-[#52764a]">
            Solutions
          </a>
          <a href="#technology" className="transition hover:text-[#52764a]">
            Technology
          </a>
          <a href="#analytics" className="transition hover:text-[#52764a]">
            Analytics
          </a>
        </div>

        <div className="flex items-center gap-2">
          {currentUser ? (
            <>
              <span className="hidden items-center gap-2 text-sm text-[#35583b] sm:flex">
                <UserRound size={17} />
                {currentUser.name}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl border border-[#35583b]/25 px-3 py-2.5 text-sm text-[#35583b] transition hover:bg-[#dcd4c2]"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsAuthOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-[#302a1d] px-4 py-3 text-sm text-[#f4eddf] transition hover:bg-[#4b4930]"
            >
              Sign In
              <ArrowUpRight size={16} />
            </button>
          )}
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-5 py-5 md:grid-cols-2 md:gap-6 md:py-6">
        <div className="flex flex-col items-start text-left">
          <span className="rounded-full bg-[#dcd4c2] px-4 py-2 text-xs tracking-wide text-[#35583b]">
            INTELLIGENT AGRICULTURE
          </span>

          <h1 className="mt-5 max-w-xl text-left font-serif text-4xl leading-[1.08] tracking-[-0.045em] sm:text-5xl md:text-6xl lg:text-7xl">
            Precision Farming
            <br />
            and Soil
            <br />
            <span className="italic text-[#52764a]">
              Health Monitoring
            </span>
          </h1>

          <p className="mt-4 max-w-lg text-left text-sm leading-7 text-[#6b634f] md:text-base">
            Understand your soil. Discover its potential. Make smarter crop
            decisions with AI-powered nutrient assessment and intelligent
            agricultural insights.
          </p>

          <div className="mt-6 flex flex-wrap justify-start gap-3">
            <button
              type="button"
              onClick={() => setIsAuthOpen(true)}
              className="rounded-xl bg-[#35583b] px-6 py-3.5 text-sm text-white transition hover:-translate-y-1 hover:bg-[#29452e]"
            >
              Analyze Your Soil ↗
            </button>

            <a
              href="#solutions"
              className="rounded-xl border border-[#352e20]/20 px-6 py-3.5 text-sm transition hover:bg-[#ded6c5]"
            >
              Explore Technology
            </a>
          </div>

          <div className="mt-6 flex items-center gap-3 text-sm text-[#6b634f]">
            <Sprout size={22} className="text-[#52764a]" />
            <span>Grow with better insights</span>
          </div>
        </div>

        <div className="relative mx-auto flex min-h-[350px] w-full max-w-[590px] items-center justify-center sm:min-h-[410px] md:min-h-[490px]">
          <div className="absolute left-1/2 top-1/2 h-[76%] w-[76%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e2e7d6]" />

          <div className="absolute left-1/2 top-1/2 h-[66%] w-[66%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#b6c6a6]/60" />

          <img
            key={imageIndex}
            ref={farmerRef}
            src={farmerImages[imageIndex]}
            alt="Farmer illustration"
            onError={(event) => {
              event.currentTarget.style.visibility = 'hidden'
            }}
            style={{
              left: `calc(50% + ${farmerPositions[imageIndex].x}px)`,
              top: `calc(50% + ${farmerPositions[imageIndex].y}px)`,
              transform: `translate(-50%, -50%) scale(${farmerPositions[imageIndex].scale})`,
            }}
            className="absolute z-10 h-[90%] w-[90%] object-contain object-center"
          />

          <div className="orbit-track absolute inset-[8%] z-20">
            <div className="absolute left-1/2 top-0 -translate-x-1/2">
              <div className="orbit-card rounded-2xl border border-white/80 bg-[#fffdf7]/95 px-5 py-3 shadow-lg backdrop-blur-md">
                <p className="text-xs text-[#77705e]">Soil intelligence</p>
                <p className="mt-1 whitespace-nowrap font-semibold text-[#35583b]">
                  Healthy growth
                </p>
              </div>
            </div>

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
              <div className="orbit-card rounded-2xl border border-white/80 bg-[#fffdf7]/95 px-5 py-3 shadow-lg backdrop-blur-md">
                <p className="text-xs text-[#77705e]">Smart advisory</p>
                <p className="mt-1 whitespace-nowrap font-semibold text-[#35583b]">
                  Grow smarter
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="solutions"
        className="mx-auto max-w-7xl pt-4 pb-8 md:pt-6 md:pb-12"
      >
        <div className="grid overflow-hidden rounded-[32px] border border-white/70 bg-[#fffdf7] shadow-[0_20px_70px_rgba(65,72,45,0.09)] md:grid-cols-2">
          <div className="flex flex-col p-4 sm:p-6 md:p-8">
            <div className="relative overflow-hidden rounded-[24px] bg-[#e2e7d6]">
              <video
                className="aspect-[4/5] w-full scale-[1.08] object-cover object-center"
                autoPlay
                muted
                loop
                playsInline
                controls
                preload="metadata"
                poster="/images/farmer/farmer-01.png"
              >
                <source
                  src="/videos/farmer-story.mp4"
                  type="video/mp4"
                />
                Your browser does not support this video.
              </video>

              <div className="absolute left-4 top-4 rounded-full border border-white/60 bg-[#fffdf7]/90 px-3 py-2 text-xs font-medium text-[#35583b] shadow-sm backdrop-blur-md">
                <Sprout size={14} className="mr-1 inline" />
                Farming, reimagined
              </div>
            </div>

            <div className="px-2 pb-2 pt-5">
              <p className="text-xs font-semibold tracking-[0.18em] text-[#78906a]">
                THE CHALLENGE · THE SOLUTION · THE CHANGE
              </p>

              <h3 className="mt-3 font-serif text-2xl leading-snug text-[#352e20]">
                Every field has a story.
                <span className="italic text-[#52764a]">
                  {" "}Let's make it a better one.
                </span>
              </h3>

              <p className="mt-3 text-sm leading-7 text-[#6b634f]">
                Discover how understanding soil can help farmers make more
                informed agricultural decisions.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center px-6 pb-8 pt-4 sm:px-10 md:px-12 md:py-12">
            <span className="w-fit rounded-full bg-[#e7ebdf] px-4 py-2 text-xs font-medium tracking-widest text-[#35583b]">
              THE AGRISYNC STORY
            </span>

            <h2 className="mt-5 font-serif text-4xl leading-[1.12] tracking-tight text-[#352e20] sm:text-5xl">
              Better soil.
              <br />
              Smarter decisions.
              <br />
              <span className="italic text-[#52764a]">
                A brighter future.
              </span>
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#6b634f] md:text-base">
              Soil health influences crop growth, but understanding nutrient
              requirements and crop suitability can be challenging.
              AgriSync brings AI-assisted soil analysis and intelligent crop
              advisory into one accessible experience.
            </p>

            <div className="mt-6 space-y-5">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e7ebdf] font-serif text-lg text-[#35583b]">
                  01
                </div>
                <div>
                  <h3 className="font-semibold text-[#352e20]">
                    The challenge
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[#6b634f]">
                    Uncertainty about soil nutrients, soil health, and suitable
                    crop choices.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e7ebdf] font-serif text-lg text-[#35583b]">
                  02
                </div>
                <div>
                  <h3 className="font-semibold text-[#352e20]">
                    What AgriSync does
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[#6b634f]">
                    Uses soil images and submitted information to support
                    nutrient assessment and intelligent crop advisory.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e7ebdf] font-serif text-lg text-[#35583b]">
                  03
                </div>
                <div>
                  <h3 className="font-semibold text-[#352e20]">
                    The outcome
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[#6b634f]">
                    Clearer insights that help farmers make more informed
                    decisions about soil and crops.
                  </p>
                </div>
              </div>
            </div>

            <a
              href="#technology"
              className="mt-7 inline-flex w-fit items-center gap-2 rounded-xl bg-[#35583b] px-6 py-3.5 text-sm font-medium text-white transition duration-300 hover:-translate-y-1 hover:bg-[#29452e]"
            >
              Discover How It Works
              <ArrowUpRight size={17} />
            </a>
          </div>
        </div>
      </section>

      <Testimonials />

      <FeedbackSection />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </main>
  )
}

export default App
