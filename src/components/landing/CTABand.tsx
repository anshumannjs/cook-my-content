'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Button from '@/components/ui/Button'

gsap.registerPlugin(ScrollTrigger)

export default function CTABand() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.fromTo(
      sectionRef.current?.querySelectorAll('.cta-item'),
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 0.7, ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      }
    )
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      className='relative py-28 sm:py-36 px-6 overflow-hidden'
    >
      {/* Gradient bg */}
      <div
        className='absolute inset-0 pointer-events-none'
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(212,135,74,0.1) 0%, rgba(212,165,116,0.05) 40%, transparent 70%)',
        }}
      />
      <div className='absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent' />

      <div className='relative z-10 max-w-3xl mx-auto text-center'>
        <p className='cta-item opacity-0 font-body text-xs text-gold/50 tracking-widest uppercase mb-6'>
          Ready to Start?
        </p>

        <h2 className='cta-item opacity-0 font-heading text-[clamp(2.8rem,6vw,5rem)] font-medium text-cream leading-[1.05]'>
          Your next reel is{' '}
          <span className='text-gradient-gold italic'>one photo</span>{' '}
          away.
        </h2>

        <p className='cta-item opacity-0 font-body text-lg text-cream/40 mt-6 max-w-lg mx-auto leading-relaxed'>
          No prompts. No editing software. No agency retainers.
          Just upload and let Celestiva cook.
        </p>

        <div className='cta-item opacity-0 flex flex-col sm:flex-row items-center justify-center gap-4 mt-12'>
          <Link href='/signup'>
            <Button variant='gold' size='xl' className='min-w-[200px] shadow-gold-lg hover:shadow-gold-xl'>
              Get Started Free
            </Button>
          </Link>
          <Link href='/pricing'>
            <Button variant='outline' size='xl' className='min-w-[200px]'>
              See All Plans
            </Button>
          </Link>
        </div>

        <p className='cta-item opacity-0 font-body text-xs text-cream/20 mt-8'>
          No credit card required · Cancel anytime
        </p>
      </div>
    </section>
  )
}