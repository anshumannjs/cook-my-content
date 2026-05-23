'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  {
    number: '01',
    icon: (
      <svg width='28' height='28' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5'>
        <rect x='3' y='3' width='18' height='18' rx='2' />
        <circle cx='8.5' cy='8.5' r='1.5' />
        <path d='M21 15l-5-5L5 21' />
      </svg>
    ),
    title:       'Upload Your Photo',
    description: 'Drop in one photo for Classic, or four for Premium. No special requirements — any quality photo works.',
  },
  {
    number: '02',
    icon: (
      <svg width='28' height='28' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5'>
        <path d='M12 2a10 10 0 1 0 10 10' />
        <path d='M12 6v6l4 2' />
        <path d='M17 2l5 5-5 5' />
      </svg>
    ),
    title:       'Celestiva Does The Rest',
    description: 'Our AI reads your photos, writes the story, scores the music, grades the colours, and adds cinematic motion.',
  },
  {
    number: '03',
    icon: (
      <svg width='28' height='28' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5'>
        <path d='M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4' />
        <polyline points='7 10 12 15 17 10' />
        <line x1='12' y1='15' x2='12' y2='3' />
      </svg>
    ),
    title:       'Download & Post Instantly',
    description: 'Your 4K reel lands in your inbox in 20–35 minutes, post-ready in 9:16. Download and publish directly.',
  },
]

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const cards = sectionRef.current?.querySelectorAll('.step-card')
    const line  = sectionRef.current?.querySelector('.connector-line')

    // Cards enter from alternating sides
    cards?.forEach((card, i) => {
      gsap.fromTo(card,
        { x: i % 2 === 0 ? -50 : 50, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start:   'top 80%',
          },
        }
      )
    })

    // SVG line draws in
    if (line) {
      gsap.fromTo(line,
        { strokeDashoffset: 1000, strokeDasharray: 1000 },
        {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start:   'top 60%',
          },
        }
      )
    }
  }, { scope: sectionRef })

  return (
    <section
      id='how-it-works'
      ref={sectionRef}
      className='py-28 sm:py-36 px-6 max-w-6xl mx-auto'
    >
      {/* Header */}
      <div className='text-center mb-20'>
        <p className='font-body text-xs text-gold/60 tracking-widest uppercase mb-4'>
          The Process
        </p>
        <h2 className='font-heading text-[clamp(2.5rem,5vw,4rem)] font-medium text-cream'>
          Three steps to cinematic
        </h2>
        <p className='font-body text-base text-cream/40 mt-4 max-w-lg mx-auto'>
          The simplest content workflow you&apos;ve ever used.
        </p>
      </div>

      {/* Steps */}
      <div className='relative'>
        {/* Connecting SVG line — desktop only */}
        <svg
          className='absolute top-16 left-0 right-0 w-full hidden lg:block pointer-events-none'
          height='2'
          preserveAspectRatio='none'
        >
          <line
            className='connector-line'
            x1='16%' y1='1' x2='84%' y2='1'
            stroke='rgba(212,165,116,0.2)'
            strokeWidth='1'
            strokeDasharray='6 4'
          />
        </svg>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {STEPS.map((step, i) => (
            <div key={i} className='step-card opacity-0'>
              <div className='bg-shadow/60 border border-gold/10 rounded-3xl p-8 h-full relative group hover:border-gold/25 transition-colors duration-300'>

                {/* Step number */}
                <div className='flex items-center justify-between mb-6'>
                  <div className='w-12 h-12 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold group-hover:bg-gold/15 transition-colors'>
                    {step.icon}
                  </div>
                  <span className='font-heading text-5xl font-medium text-gold/10 group-hover:text-gold/20 transition-colors'>
                    {step.number}
                  </span>
                </div>

                <h3 className='font-heading text-2xl font-medium text-cream mb-3'>
                  {step.title}
                </h3>
                <p className='font-body text-sm text-cream/45 leading-relaxed'>
                  {step.description}
                </p>

                {/* Arrow — not on last */}
                {i < STEPS.length - 1 && (
                  <div className='hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-primary border border-gold/15 items-center justify-center'>
                    <svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(212,165,116,0.5)' strokeWidth='2'>
                      <path d='M5 12h14M12 5l7 7-7 7' />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}