'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import Button from '@/components/ui/Button'

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null)
  const orb1Ref      = useRef<HTMLDivElement>(null)
  const orb2Ref      = useRef<HTMLDivElement>(null)
  const numRef       = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.fromTo(numRef.current,
      { y: 40, opacity: 0, scale: 0.9 },
      { y: 0,  opacity: 1, scale: 1, duration: 0.9 }
    )
    .fromTo(
      containerRef.current?.querySelectorAll('.fade-up') ?? [],
      { y: 24, opacity: 0 },
      { y: 0,  opacity: 1, duration: 0.6, stagger: 0.1 },
      '-=0.5'
    )
    .fromTo(
      [orb1Ref.current, orb2Ref.current],
      { scale: 0.5, opacity: 0 },
      { scale: 1,   opacity: 1, duration: 1.4, stagger: 0.2, ease: 'power2.out' },
      0
    )

    // Floating orb animation
    gsap.to(orb1Ref.current, {
      y: -20, duration: 4, ease: 'sine.inOut', repeat: -1, yoyo: true,
    })
    gsap.to(orb2Ref.current, {
      y: 20, duration: 5, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 0.8,
    })
  }, [])

  return (
    <div
      ref={containerRef}
      className='relative min-h-screen flex items-center justify-center overflow-hidden'
    >

      {/* Ambient orbs */}
      <div
        ref={orb1Ref}
        className='absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-0 pointer-events-none'
        style={{ background: 'radial-gradient(circle, rgba(212,165,116,0.08) 0%, transparent 70%)' }}
      />
      <div
        ref={orb2Ref}
        className='absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-0 pointer-events-none'
        style={{ background: 'radial-gradient(circle, rgba(212,135,74,0.07) 0%, transparent 70%)' }}
      />

      {/* Film-frame decoration */}
      <div className='absolute inset-x-0 top-0 h-2 flex gap-3 px-6 pt-2 opacity-10'>
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className='w-6 h-full bg-cream/40 rounded-full flex-shrink-0' />
        ))}
      </div>
      <div className='absolute inset-x-0 bottom-0 h-2 flex gap-3 px-6 pb-2 opacity-10'>
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className='w-6 h-full bg-cream/40 rounded-full flex-shrink-0' />
        ))}
      </div>

      {/* Content */}
      <div className='relative z-10 text-center px-6 max-w-xl mx-auto'>

        {/* 404 */}
        <div ref={numRef} className='opacity-0 mb-6'>
          <p
            className='font-heading font-medium select-none'
            style={{
              fontSize: 'clamp(8rem, 20vw, 16rem)',
              lineHeight: 1,
              background: 'linear-gradient(135deg, rgba(212,165,116,0.15) 0%, rgba(212,165,116,0.05) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.04em',
            }}
          >
            404
          </p>
        </div>

        {/* Text */}
        <h1 className='fade-up opacity-0 font-heading text-3xl sm:text-4xl font-medium text-cream mb-4'>
          This frame doesn&apos;t exist.
        </h1>

        <p className='fade-up opacity-0 font-body text-base text-cream/40 leading-relaxed mb-10 max-w-sm mx-auto'>
          Looks like Celestiva couldn&apos;t find this page in the kitchen.
          It may have been moved, deleted, or never existed.
        </p>

        {/* Actions */}
        <div className='fade-up opacity-0 flex flex-col sm:flex-row items-center justify-center gap-4'>
          <Link href='/'>
            <Button variant='gold' size='lg'>
              <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='mr-1.5'>
                <path d='M19 12H5M12 19l-7-7 7-7' />
              </svg>
              Back to Home
            </Button>
          </Link>
          <Link href='/studio'>
            <Button variant='ghost' size='lg'>
              Go to Studio
            </Button>
          </Link>
        </div>

        {/* Subtle help link */}
        <p className='fade-up opacity-0 font-body text-xs text-cream/20 mt-10'>
          Still lost?{' '}
          <a
            href='mailto:support@cookmycontent.com'
            className='text-cream/35 hover:text-gold/60 transition-colors'
          >
            Contact support
          </a>
        </p>
      </div>
    </div>
  )
}