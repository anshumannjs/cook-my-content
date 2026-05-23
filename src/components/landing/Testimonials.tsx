'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

const TESTIMONIALS = [
  {
    quote:    'I used to spend three hours editing reels every weekend. Now I upload a photo on Friday and the reel is in my inbox before lunch. My engagement went up 40%.',
    name:     'Priya Sharma',
    role:     'Founder, Bloom Skincare',
    initials: 'PS',
    color:    '#C4703A',
    plan:     'Premium',
  },
  {
    quote:    'The colour grading alone is worth the price. Celestiva understood the vibe of my brand immediately — warm, golden, cinematic. Exactly what I wanted.',
    name:     'Marcus Chen',
    role:     'Real Estate Agent',
    initials: 'MC',
    color:    '#D4A574',
    plan:     'Classic',
  },
  {
    quote:    'My clients keep asking which agency I hired. I just tell them I have a very good chef. Honestly the best content investment I\'ve made for my restaurant.',
    name:     'Sofia Alvarez',
    role:     'Owner, Casa Fuego Restaurant',
    initials: 'SA',
    color:    '#B08354',
    plan:     'Premium',
  },
  {
    quote:    'The sequential motion across four photos is wild. It reads like a mini short film every single time. My followers think I have a full production team.',
    name:     'James Okafor',
    role:     'Personal Trainer & Coach',
    initials: 'JO',
    color:    '#E6C39B',
    plan:     'Premium',
  },
  {
    quote:    'No prompts. No back and forth. Upload, wait 20 minutes, download, post. That\'s it. I\'ve tried every other AI tool and nothing is this simple.',
    name:     'Aisha Patel',
    role:     'Fashion Boutique Owner',
    initials: 'AP',
    color:    '#8C6235',
    plan:     'Classic',
  },
]

export default function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null)
  const animRef  = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    // Clone cards for infinite loop
    const cards = Array.from(track.children) as HTMLElement[]
    cards.forEach((card) => {
      const clone = card.cloneNode(true) as HTMLElement
      track.appendChild(clone)
    })

    const totalWidth = cards.reduce((acc, c) => acc + c.offsetWidth + 24, 0)

    animRef.current = gsap.to(track, {
      x:        -totalWidth,
      duration: 40,
      ease:     'none',
      repeat:   -1,
      modifiers: {
        x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
      },
    })

    const pause  = () => animRef.current?.pause()
    const resume = () => animRef.current?.play()

    track.addEventListener('mouseenter', pause)
    track.addEventListener('mouseleave', resume)

    return () => {
      animRef.current?.kill()
      track.removeEventListener('mouseenter', pause)
      track.removeEventListener('mouseleave', resume)
    }
  }, [])

  return (
    <section className='py-28 sm:py-36 overflow-hidden' style={{ background: 'linear-gradient(to bottom, #0A0A0A, #120D08, #0A0A0A)' }}>
      <div className='max-w-7xl mx-auto px-6 mb-14'>
        <p className='font-body text-xs text-gold/60 tracking-widest uppercase mb-4 text-center'>
          What Creators Say
        </p>
        <h2 className='font-heading text-[clamp(2.5rem,5vw,4rem)] font-medium text-cream text-center'>
          The chefs have spoken.
        </h2>
      </div>

      {/* Scrolling track */}
      <div className='relative'>
        {/* Fade edges */}
        <div className='absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none'
          style={{ background: 'linear-gradient(to right, #0A0A0A, transparent)' }}
        />
        <div className='absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none'
          style={{ background: 'linear-gradient(to left, #0A0A0A, transparent)' }}
        />

        <div className='overflow-hidden'>
          <div
            ref={trackRef}
            className='flex gap-6 w-max'
            style={{ willChange: 'transform' }}
          >
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className='flex-shrink-0 w-80 sm:w-96 bg-shadow/60 border border-gold/10 rounded-3xl p-7 hover:border-gold/20 transition-colors duration-300'
              >
                {/* Stars */}
                <div className='flex gap-1 mb-5'>
                  {[...Array(5)].map((_, si) => (
                    <svg key={si} width='13' height='13' viewBox='0 0 24 24' fill='#D4A574'>
                      <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
                    </svg>
                  ))}
                </div>

                <p className='font-heading text-lg font-normal italic text-cream/75 leading-relaxed mb-6'>
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className='flex items-center gap-3'>
                  <div
                    className='w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold text-primary flex-shrink-0'
                    style={{ backgroundColor: t.color }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className='font-body text-sm font-medium text-cream/80'>{t.name}</p>
                    <p className='font-body text-xs text-cream/35'>{t.role}</p>
                  </div>
                  <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full border font-body ${
                    t.plan === 'Premium'
                      ? 'text-amber-400 border-amber-700/30 bg-amber-950/30'
                      : 'text-gold border-gold/20 bg-gold/5'
                  }`}>
                    {t.plan}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}