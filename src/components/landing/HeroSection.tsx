'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import Button from '@/components/ui/Button'

gsap.registerPlugin()

const WORDS = ['Cinematic.', 'Scroll-Stopping.', 'Chef\'s Special.']

export default function HeroSection() {
  const containerRef  = useRef<HTMLDivElement>(null)
  const headlineRef   = useRef<HTMLDivElement>(null)
  const subRef        = useRef<HTMLParagraphElement>(null)
  const ctaRef        = useRef<HTMLDivElement>(null)
  const orb1Ref       = useRef<HTMLDivElement>(null)
  const orb2Ref       = useRef<HTMLDivElement>(null)
  const orb3Ref       = useRef<HTMLDivElement>(null)
  const wordIndexRef  = useRef(0)
  const cyclingWordRef = useRef<HTMLSpanElement>(null)

  // ── Entrance animation ────────────────────────────────────────────────────
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    // Stagger headline words
    const words = headlineRef.current?.querySelectorAll('.hero-word')
    tl.fromTo(
      words ?? [],
      { y: 60, opacity: 0, rotateX: -20 },
      { y: 0,  opacity: 1, rotateX: 0, duration: 0.9, stagger: 0.08 }
    )
    .fromTo(subRef.current,
      { y: 24, opacity: 0 },
      { y: 0,  opacity: 1, duration: 0.7 },
      '-=0.4'
    )
    .fromTo(ctaRef.current,
      { y: 20, opacity: 0 },
      { y: 0,  opacity: 1, duration: 0.6 },
      '-=0.4'
    )
    // Orbs float in
    .fromTo(
      [orb1Ref.current, orb2Ref.current, orb3Ref.current],
      { scale: 0.6, opacity: 0 },
      { scale: 1,   opacity: 1, duration: 1.6, stagger: 0.2, ease: 'power2.out' },
      0
    )
  }, { scope: containerRef })

  // ── Cycling word animation ────────────────────────────────────────────────
  useEffect(() => {
    const el = cyclingWordRef.current
    if (!el) return

    const cycle = () => {
      wordIndexRef.current = (wordIndexRef.current + 1) % WORDS.length
      gsap.timeline()
        .to(el, { y: -20, opacity: 0, duration: 0.35, ease: 'power2.in' })
        .call(() => { el.textContent = WORDS[wordIndexRef.current] })
        .fromTo(el,
          { y: 20, opacity: 0 },
          { y: 0,  opacity: 1, duration: 0.45, ease: 'power3.out' }
        )
    }

    const interval = setInterval(cycle, 2800)
    return () => clearInterval(interval)
  }, [])

  // ── Mouse parallax on orbs ────────────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const onMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window
      const xRatio = (clientX / innerWidth  - 0.5)
      const yRatio = (clientY / innerHeight - 0.5)

      gsap.to(orb1Ref.current, { x: xRatio * 40,  y: yRatio * 30,  duration: 1.2, ease: 'power2.out' })
      gsap.to(orb2Ref.current, { x: xRatio * -60, y: yRatio * -40, duration: 1.4, ease: 'power2.out' })
      gsap.to(orb3Ref.current, { x: xRatio * 25,  y: yRatio * 50,  duration: 1.6, ease: 'power2.out' })
    }

    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <section
      ref={containerRef}
      className='relative min-h-screen flex items-center justify-center overflow-hidden pt-18'
    >
      {/* ── Ambient orbs ───────────────────────────────────────────────── */}
      <div
        ref={orb1Ref}
        className='absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full opacity-0 pointer-events-none'
        style={{ background: 'radial-gradient(circle, rgba(212,165,116,0.12) 0%, transparent 70%)' }}
      />
      <div
        ref={orb2Ref}
        className='absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full opacity-0 pointer-events-none'
        style={{ background: 'radial-gradient(circle, rgba(212,135,74,0.1) 0%, transparent 70%)' }}
      />
      <div
        ref={orb3Ref}
        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-0 pointer-events-none'
        style={{ background: 'radial-gradient(circle, rgba(212,165,116,0.06) 0%, transparent 60%)' }}
      />

      {/* ── Film grain overlay ──────────────────────────────────────────── */}
      <div className='absolute inset-0 opacity-[0.03] pointer-events-none'
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
      />

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className='relative z-10 max-w-5xl mx-auto px-6 text-center'>

        {/* Eyebrow */}
        <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/20 bg-gold/5 mb-8'>
          <span className='w-1.5 h-1.5 rounded-full bg-gold animate-pulse-slow' />
          <span className='font-body text-xs text-gold/80 tracking-widest uppercase'>
            AI-Powered Content Studio
          </span>
        </div>

        {/* Headline */}
        <div
          ref={headlineRef}
          className='overflow-hidden'
          style={{ perspective: '800px' }}
        >
          <h1 className='font-heading font-medium leading-[1.08] tracking-tight'>
            {'Turn Your Photos Into'.split(' ').map((word, i) => (
              <span
                key={i}
                className='hero-word inline-block mr-[0.25em] text-[clamp(3rem,7vw,6rem)] text-cream opacity-0'
              >
                {word}
              </span>
            ))}
            <br />
            <span
              ref={cyclingWordRef}
              className='hero-word inline-block text-gradient text-[clamp(3rem,7vw,6rem)] opacity-0'
            >
              {WORDS[0]}
            </span>
          </h1>
        </div>

        {/* Sub */}
        <p
          ref={subRef}
          className='font-body text-lg sm:text-xl text-cream/50 mt-8 max-w-2xl mx-auto leading-relaxed opacity-0'
        >
          No prompts. No editing. Upload one photo and Celestiva crafts a
          cinematic reel — your content is{' '}
          <span className='text-gold/80 italic font-heading'>chef&apos;s special</span>
          {' '}every time.
        </p>

        {/* CTAs */}
        <div
          ref={ctaRef}
          className='flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 opacity-0'
        >
          <Link href='/signup'>
            <Button variant='gold' size='lg' className='min-w-[180px] shadow-gold-md hover:shadow-gold-lg'>
              Start Creating
              <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='ml-1'>
                <path d='M5 12h14M12 5l7 7-7 7' />
              </svg>
            </Button>
          </Link>
          <a href='#work'>
            <Button variant='ghost' size='lg' className='min-w-[180px]'>
              See Our Work
            </Button>
          </a>
        </div>

        {/* Social proof strip */}
        <div className='flex items-center justify-center gap-6 mt-14'>
          <div className='flex -space-x-2'>
            {['#C4703A', '#D4A574', '#B08354', '#E6C39B', '#8C6235'].map((color, i) => (
              <div
                key={i}
                className='w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center text-[10px] font-semibold text-primary'
                style={{ backgroundColor: color }}
              >
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
          <div className='text-left'>
            <div className='flex items-center gap-1'>
              {[...Array(5)].map((_, i) => (
                <svg key={i} width='12' height='12' viewBox='0 0 24 24' fill='#D4A574'>
                  <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
                </svg>
              ))}
            </div>
            <p className='font-body text-xs text-cream/35 mt-0.5'>
              Loved by 4,200+ creators
            </p>
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ────────────────────────────────────────────── */}
      <div className='absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40'>
        <span className='font-body text-xs text-cream/50 tracking-widest uppercase'>Scroll</span>
        <div className='w-px h-10 bg-gradient-to-b from-gold/40 to-transparent animate-pulse-slow' />
      </div>
    </section>
  )
}