'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Replace src values with real example assets
const EXAMPLES = [
  {
    id:          1,
    inputLabel:  'Restaurant — 1 photo',
    outputLabel: 'Classic Reel · 10 sec · 4K',
    plan:        'Classic',
    inputBg:     '#1A1008',
    emoji:       '🍽️',
  },
  {
    id:          2,
    inputLabel:  'Fitness Studio — 4 photos',
    outputLabel: 'Premium Reel · 25 sec · 4K',
    plan:        'Premium',
    inputBg:     '#0A1218',
    emoji:       '💪',
  },
  {
    id:          3,
    inputLabel:  'Jewellery Brand — 1 photo',
    outputLabel: 'Classic Reel · 10 sec · 4K',
    plan:        'Classic',
    inputBg:     '#180E1A',
    emoji:       '💎',
  },
  {
    id:          4,
    inputLabel:  'Real Estate — 4 photos',
    outputLabel: 'Premium Reel · 25 sec · 4K',
    plan:        'Premium',
    inputBg:     '#0E1A10',
    emoji:       '🏠',
  },
]

export default function WorkShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)
  const stripRef     = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const container = containerRef.current
    const strip     = stripRef.current
    if (!container || !strip) return

    // Only horizontal scroll on desktop
    const mm = gsap.matchMedia()

    mm.add('(min-width: 1024px)', () => {
      const totalScroll = strip.scrollWidth - window.innerWidth

      gsap.to(strip, {
        x:    -totalScroll,
        ease: 'none',
        scrollTrigger: {
          trigger:      container,
          start:        'top top',
          end:          () => `+=${totalScroll}`,
          pin:          true,
          scrub:        1.2,
          anticipatePin: 1,
        },
      })
    })

    // Stagger cards on mobile
    mm.add('(max-width: 1023px)', () => {
      const cards = strip.querySelectorAll('.showcase-card')
      cards.forEach((card) => {
        gsap.fromTo(card,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.7,
            scrollTrigger: { trigger: card, start: 'top 85%' },
          }
        )
      })
    })
  }, { scope: containerRef })

  return (
    <section
      id='work'
      ref={containerRef}
      className='relative bg-[#0A0805] border-y border-gold/8'
    >
      {/* Section header — visible before scroll on desktop */}
      <div className='lg:absolute lg:top-10 lg:left-10 xl:left-16 z-10 px-6 lg:px-0 pt-16 lg:pt-0 pb-8 lg:pb-0'>
        <p className='font-body text-xs text-gold/50 tracking-widest uppercase mb-3'>
          Our Work
        </p>
        <h2 className='font-heading text-3xl sm:text-4xl font-medium text-cream max-w-xs'>
          Photo in.<br />Cinema out.
        </h2>
      </div>

      {/* Horizontal strip */}
      <div
        ref={stripRef}
        className='flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-8 px-6 lg:px-[15vw] py-10 lg:py-0 lg:h-screen lg:w-max'
      >
        {EXAMPLES.map((ex, i) => (
          <div
            key={ex.id}
            className='showcase-card flex-shrink-0 w-full lg:w-[360px] xl:w-[400px]'
          >
            <div className='bg-shadow/80 border border-gold/10 rounded-3xl overflow-hidden hover:border-gold/25 transition-colors duration-300 group'>

              {/* Input photo mockup */}
              <div
                className='relative p-6 pb-0'
                style={{ backgroundColor: ex.inputBg }}
              >
                <div className='absolute top-4 left-4'>
                  <span className='font-body text-[10px] text-cream/30 uppercase tracking-widest'>
                    Input
                  </span>
                </div>

                {/* Photo frame */}
                <div className='relative mx-auto w-48 h-56 rounded-2xl border border-cream/10 overflow-hidden mt-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
                  style={{ backgroundColor: ex.inputBg }}
                >
                  {/* Placeholder for actual photo */}
                  <div className='absolute inset-0 flex flex-col items-center justify-center gap-2'>
                    <span className='text-5xl'>{ex.emoji}</span>
                    <span className='font-body text-xs text-cream/25 text-center px-4'>
                      {ex.inputLabel}
                    </span>
                  </div>
                  {/* Polaroid border effect */}
                  <div className='absolute inset-0 border-[6px] border-white/5 rounded-2xl pointer-events-none' />
                </div>
              </div>

              {/* Arrow transition */}
              <div className='flex items-center justify-center py-4 gap-3'>
                <div className='h-px w-12 bg-gradient-to-r from-transparent to-gold/30' />
                <div className='w-7 h-7 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center'>
                  <svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='#D4A574' strokeWidth='2.5'>
                    <path d='M5 12h14M12 5l7 7-7 7' />
                  </svg>
                </div>
                <div className='h-px w-12 bg-gradient-to-l from-transparent to-gold/30' />
              </div>

              {/* Output phone mockup */}
              <div className='px-6 pb-6'>
                <div className='relative mx-auto w-32 h-56'>
                  {/* Phone frame */}
                  <div className='absolute inset-0 rounded-[22px] border-[3px] border-cream/10 bg-black/60 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)]'>
                    {/* Screen content placeholder */}
                    <div
                      className='absolute inset-0 flex flex-col items-center justify-end pb-4'
                      style={{ background: `linear-gradient(to bottom, ${ex.inputBg}, #0A0A0A)` }}
                    >
                      <span className='text-3xl mb-2'>{ex.emoji}</span>
                      {/* Fake text overlays */}
                      <div className='w-20 h-1.5 bg-white/20 rounded-full mb-1.5' />
                      <div className='w-14 h-1 bg-white/10 rounded-full mb-3' />
                      {/* Play indicator */}
                      <div className='w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center'>
                        <svg width='10' height='10' viewBox='0 0 14 14' fill='white'>
                          <path d='M3 2.5L11 7L3 11.5V2.5Z' />
                        </svg>
                      </div>
                    </div>
                    {/* Notch */}
                    <div className='absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1.5 bg-black rounded-full' />
                  </div>
                </div>

                {/* Caption */}
                <div className='text-center mt-5'>
                  <p className='font-body text-xs text-cream/50'>{ex.outputLabel}</p>
                  <span className={`inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${
                    ex.plan === 'Premium'
                      ? 'text-amber-300 border-amber-700/40 bg-amber-950/30'
                      : 'text-gold border-gold/25 bg-gold/8'
                  }`}>
                    {ex.plan} Plan
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}