'use client'

import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, AnimatePresence } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

export default function ProductVideo() {
  const sectionRef  = useRef<HTMLElement>(null)
  const bgRef       = useRef<HTMLDivElement>(null)
  const contentRef  = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)

  // Parallax background
  useGSAP(() => {
    gsap.to(bgRef.current, {
      y: 80,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start:   'top bottom',
        end:     'bottom top',
        scrub:   true,
      },
    })

    // Content entrance
    gsap.fromTo(contentRef.current,
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      }
    )
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      className='relative py-28 sm:py-36 overflow-hidden'
    >
      {/* Parallax bg */}
      <div
        ref={bgRef}
        className='absolute inset-[-80px] pointer-events-none'
        style={{ background: 'radial-gradient(ellipse at center, rgba(212,135,74,0.08) 0%, transparent 65%)' }}
      />

      {/* Horizontal rule lines */}
      <div className='absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent' />
      <div className='absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent' />

      <div ref={contentRef} className='relative z-10 max-w-4xl mx-auto px-6 text-center opacity-0'>
        <p className='font-body text-xs text-gold/60 tracking-widest uppercase mb-4'>
          See It In Action
        </p>
        <h2 className='font-heading text-[clamp(2.5rem,5vw,4rem)] font-medium text-cream mb-4'>
          Watch Celestiva cook.
        </h2>
        <p className='font-body text-base text-cream/40 mb-14 max-w-md mx-auto'>
          From raw photo to cinematic reel — see the full process in two minutes.
        </p>

        {/* Video thumbnail */}
        <div className='relative group cursor-pointer' onClick={() => setPlaying(true)}>
          {/* Thumbnail placeholder */}
          <div className='relative w-full aspect-video rounded-3xl overflow-hidden border border-gold/12 bg-shadow/80'>
            {/* Fake thumbnail gradient */}
            <div className='absolute inset-0'
              style={{ background: 'linear-gradient(135deg, #1C1208 0%, #0A0A0A 50%, #120A18 100%)' }}
            />
            {/* Abstract cinematic lines */}
            <svg className='absolute inset-0 w-full h-full opacity-10' viewBox='0 0 800 450'>
              <line x1='0' y1='225' x2='800' y2='225' stroke='#D4A574' strokeWidth='0.5' />
              <line x1='400' y1='0' x2='400' y2='450' stroke='#D4A574' strokeWidth='0.5' />
              <circle cx='400' cy='225' r='100' stroke='#D4A574' strokeWidth='0.5' fill='none' />
              <circle cx='400' cy='225' r='180' stroke='#D4A574' strokeWidth='0.3' fill='none' />
            </svg>

            {/* Hover overlay */}
            <div className='absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300' />
          </div>

          {/* Play button */}
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='relative'>
              {/* Orbital ring */}
              <div className='absolute inset-0 -m-4 rounded-full border border-gold/20 animate-spin-slow' />
              <div className='absolute inset-0 -m-8 rounded-full border border-gold/10 animate-spin-slow'
                style={{ animationDirection: 'reverse', animationDuration: '14s' }}
              />

              <div className='relative w-16 h-16 rounded-full bg-gold/20 border border-gold/40 backdrop-blur-sm flex items-center justify-center group-hover:bg-gold/30 group-hover:scale-110 transition-all duration-300 shadow-gold-md'>
                <svg width='20' height='20' viewBox='0 0 14 14' fill='#D4A574'>
                  <path d='M3 2.5L11 7L3 11.5V2.5Z' />
                </svg>
              </div>
            </div>
          </div>

          {/* Duration badge */}
          <div className='absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-black/60 border border-cream/10 backdrop-blur-sm'>
            <span className='font-body text-xs text-cream/60'>2:15</span>
          </div>
        </div>
      </div>

      {/* Video lightbox */}
      <AnimatePresence>
        {playing && (
          <>
            <motion.div
              key='overlay'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 z-50 bg-black/95 backdrop-blur-lg'
              onClick={() => setPlaying(false)}
            />
            <motion.div
              key='video'
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1  }}
              exit={{ opacity: 0,   scale: 0.94 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className='fixed inset-4 sm:inset-8 md:inset-16 z-50 flex items-center justify-center'
            >
              <div className='relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-gold/10'>
                {/* Replace with actual video embed */}
                <div className='absolute inset-0 flex items-center justify-center text-cream/30 font-body text-sm'>
                  Video embed goes here
                </div>
              </div>

              <button
                onClick={() => setPlaying(false)}
                className='absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 border border-cream/15 flex items-center justify-center text-cream/50 hover:text-cream transition-colors'
              >
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                  <path d='M18 6L6 18M6 6l12 12' />
                </svg>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}