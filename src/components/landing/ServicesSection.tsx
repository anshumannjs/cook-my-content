'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Button from '@/components/ui/Button'

gsap.registerPlugin(ScrollTrigger)

const CLASSIC_FEATURES = {
  included: [
    '10 cinematic reels per month',
    '10-second reels',
    'Trendy hashtags with caption',
    '9:16 vertical format — post ready',
    'Submit 1 photo per reel',
    'Cinematic text overlays (hook, body, CTA)',
    'Background music included',
    '4K output',
    'Delivered in 20–35 minutes',
    'Download and post instantly',
  ],
  excluded: [
    'No custom brand song',
    'No sequential cinematic motion',
    'No colour grading',
    'No multiple submissions per 24 hours',
  ],
}

const PREMIUM_FEATURES = {
  included: [
    '10 cinematic reels per month',
    '25 seconds per reel',
    '9:16 vertical format — post ready',
    'Submit 4 photos per reel',
    'Celestiva reads all 4 photos as one story',
    'Sequential cinematic motion',
    'Professional colour grading on every photo',
    'Custom brand song written for your business',
    'Cinematic text overlays and captions',
    '4K Ultra HD output',
    'Delivered in 25–30 minutes',
    'Download and post instantly',
    'Priority processing',
  ],
  excluded: [
    'No multiple submissions per 24 hours',
  ],
}

const CUSTOM_TIERS = [
  {
    name:     'Starter',
    price:    '$299',
    duration: '20–30 sec',
    delivery: '4–5 working days',
  },
  {
    name:     'Advance',
    price:    '$399',
    duration: '35–60 sec',
    delivery: '7–10 working days',
  },
  {
    name:      'Pro Master',
    price:     '$599',
    duration:  '60–120 sec',
    delivery:  '10–15 working days',
    highlight: true,
  },
]

function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width  / 2) / rect.width
    const y = (e.clientY - rect.top  - rect.height / 2) / rect.height
    gsap.to(card, {
      rotateY: x * 6, rotateX: -y * 6,
      transformPerspective: 1000,
      duration: 0.4, ease: 'power2.out',
    })
  }

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      rotateY: 0, rotateX: 0,
      duration: 0.6, ease: 'elastic.out(1, 0.5)',
    })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  )
}

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const cards = sectionRef.current?.querySelectorAll('.plan-card')
    cards?.forEach((card, i) => {
      gsap.fromTo(card,
        { y: 50, opacity: 0, scale: 0.96 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 0.7, ease: 'power3.out',
          delay: i * 0.1,
          scrollTrigger: { trigger: card, start: 'top 85%' },
        }
      )
    })
  }, { scope: sectionRef })

  return (
    <section
      id='plans'
      ref={sectionRef}
      className='py-28 sm:py-36 px-6 max-w-7xl mx-auto'
    >
      {/* Header */}
      <div className='text-center mb-16'>
        <p className='font-body text-xs text-gold/60 tracking-widest uppercase mb-4'>
          Our Services
        </p>
        <h2 className='font-heading text-[clamp(2.5rem,5vw,4rem)] font-medium text-cream'>
          Pick your recipe
        </h2>
        <p className='font-body text-base text-cream/40 mt-4 max-w-md mx-auto'>
          Every plan delivers chef&apos;s special content. Choose the kitchen that suits you.
        </p>
      </div>

      {/* Main plan cards */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>

        {/* Classic */}
        <TiltCard className='plan-card opacity-0'>
          <div className='h-full bg-shadow/60 border border-gold/12 rounded-3xl p-8 flex flex-col'>
            <div className='mb-6'>
              <p className='font-body text-xs text-gold/50 tracking-widest uppercase mb-2'>
                Classic Menu
              </p>
              <div className='flex items-end gap-2'>
                <span className='font-heading text-5xl font-medium text-cream'>$49</span>
                <span className='font-body text-sm text-cream/35 mb-2'>/month</span>
              </div>
              <p className='font-body text-sm text-cream/40 mt-2'>
                One photo. Cinematic result. Every time.
              </p>
            </div>

            <Link href='/signup' className='mb-8'>
              <Button variant='ghost' fullWidth>Get Classic</Button>
            </Link>

            <div className='space-y-3 flex-1'>
              {CLASSIC_FEATURES.included.map((f, i) => (
                <div key={i} className='flex items-start gap-3'>
                  <svg width='16' height='16' viewBox='0 0 24 24' fill='none' className='flex-shrink-0 mt-0.5 text-gold'>
                    <path d='M20 6L9 17l-5-5' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                  </svg>
                  <span className='font-body text-sm text-cream/65'>{f}</span>
                </div>
              ))}
              {CLASSIC_FEATURES.excluded.map((f, i) => (
                <div key={i} className='flex items-start gap-3'>
                  <svg width='16' height='16' viewBox='0 0 24 24' fill='none' className='flex-shrink-0 mt-0.5 text-cream/20'>
                    <path d='M18 6L6 18M6 6l12 12' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
                  </svg>
                  <span className='font-body text-sm text-cream/25'>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </TiltCard>

        {/* Premium */}
        <TiltCard className='plan-card opacity-0'>
          <div className='h-full gold-border-gradient rounded-3xl p-8 flex flex-col relative overflow-hidden'>
            {/* Glow */}
            <div className='absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none'
              style={{ background: 'radial-gradient(circle, rgba(212,135,74,0.12) 0%, transparent 70%)' }}
            />

            <div className='absolute top-4 right-4'>
              <span className='font-body text-[10px] text-amber-300 border border-amber-700/40 bg-amber-950/40 px-2.5 py-1 rounded-full tracking-widest uppercase'>
                Chef&apos;s Special
              </span>
            </div>

            <div className='mb-6'>
              <p className='font-body text-xs text-amber-400/70 tracking-widest uppercase mb-2'>
                Premium
              </p>
              <div className='flex items-end gap-2'>
                <span className='font-heading text-5xl font-medium text-cream'>$169</span>
                <span className='font-body text-sm text-cream/35 mb-2'>/month</span>
              </div>
              <p className='font-body text-sm text-cream/40 mt-2'>
                Four photos. One story. Full cinematic production.
              </p>
            </div>

            <Link href='/signup' className='mb-8'>
              <Button variant='gold' fullWidth className='shadow-gold-md'>
                Get Premium Chef&apos;s Special
              </Button>
            </Link>

            <div className='space-y-3 flex-1'>
              {PREMIUM_FEATURES.included.map((f, i) => (
                <div key={i} className='flex items-start gap-3'>
                  <svg width='16' height='16' viewBox='0 0 24 24' fill='none' className='flex-shrink-0 mt-0.5 text-amber-400'>
                    <path d='M20 6L9 17l-5-5' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                  </svg>
                  <span className='font-body text-sm text-cream/65'>{f}</span>
                </div>
              ))}
              {PREMIUM_FEATURES.excluded.map((f, i) => (
                <div key={i} className='flex items-start gap-3'>
                  <svg width='16' height='16' viewBox='0 0 24 24' fill='none' className='flex-shrink-0 mt-0.5 text-cream/20'>
                    <path d='M18 6L6 18M6 6l12 12' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
                  </svg>
                  <span className='font-body text-sm text-cream/25'>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </TiltCard>
      </div>

      {/* Custom AI Filmmaking */}
      <TiltCard className='plan-card opacity-0'>
        <div className='bg-shadow/40 border border-gold/10 rounded-3xl p-8'>
          <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8'>

            {/* Left info */}
            <div className='lg:max-w-xs'>
              <p className='font-body text-xs text-gold/50 tracking-widest uppercase mb-3'>
                Custom AI Filmmaking
              </p>
              <h3 className='font-heading text-3xl font-medium text-cream mb-3'>
                A film made for your brand.
              </h3>
              <p className='font-body text-sm text-cream/40 leading-relaxed'>
                Our team personally handles every frame. You get a bespoke short film delivered to a brief — with revisions.
              </p>
              <Link href='/custom-filmmaking' className='inline-block mt-6'>
                <Button variant='ghost' size='sm'>
                  Request a Custom Film
                </Button>
              </Link>
            </div>

            {/* Tier columns */}
            <div className='flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4'>
              {CUSTOM_TIERS.map((tier) => (
                <div
                  key={tier.name}
                  className={`rounded-2xl p-5 border transition-colors ${
                    tier.highlight
                      ? 'border-gold/30 bg-gold/8'
                      : 'border-cream/8 bg-cream/3'
                  }`}
                >
                  {tier.highlight && (
                    <span className='font-body text-[10px] text-gold border border-gold/30 px-2 py-0.5 rounded-full uppercase tracking-widest mb-3 inline-block'>
                      Popular
                    </span>
                  )}
                  <p className='font-heading text-2xl font-medium text-cream'>{tier.price}</p>
                  <p className='font-body text-xs text-gold/60 mt-0.5 mb-4'>{tier.name}</p>
                  <div className='space-y-2.5'>
                    {[
                      tier.duration + ' video',
                      '1 revision included',
                      'Vertical & horizontal',
                      tier.delivery,
                    ].map((detail, i) => (
                      <div key={i} className='flex items-center gap-2'>
                        <div className='w-1 h-1 rounded-full bg-gold/40 flex-shrink-0' />
                        <span className='font-body text-xs text-cream/45'>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </TiltCard>
    </section>
  )
}