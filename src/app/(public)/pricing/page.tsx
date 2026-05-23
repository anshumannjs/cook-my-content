'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/lib/store/authStore'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

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
    'Custom brand song',
    'Sequential cinematic motion',
    'Professional colour grading',
    'Multiple submissions per 24 hours',
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
    'Multiple submissions per 24 hours',
  ],
}

const CUSTOM_TIERS = [
  {
    key:      'starter' as const,
    name:     'Starter',
    price:    '$299',
    duration: '20–30 sec',
    delivery: '4–5 working days',
    revision: '1 revision included',
    format:   'Vertical & horizontal',
  },
  {
    key:      'advance' as const,
    name:     'Advance',
    price:    '$399',
    duration: '35–60 sec',
    delivery: '7–10 working days',
    revision: '1 revision included',
    format:   'Vertical & horizontal',
  },
  {
    key:       'pro_master' as const,
    name:      'Pro Master',
    price:     '$599',
    duration:  '60–120 sec',
    delivery:  '10–15 working days',
    revision:  '1 revision included',
    format:    'Vertical & horizontal',
    highlight: true,
  },
]

const FAQ = [
  {
    q: 'Can I switch between Classic and Premium?',
    a: 'Yes. Upgrade or downgrade at any time. Changes take effect on your next billing cycle.',
  },
  {
    q: 'What happens if I don\'t use all 10 reels?',
    a: 'Unused reels do not roll over. Each billing cycle starts fresh with 10 reels.',
  },
  {
    q: 'Is there a free trial?',
    a: 'We don\'t offer a free trial currently, but our Classic plan is the best way to experience Celestiva at a low commitment.',
  },
  {
    q: 'How is Custom AI Filmmaking different from the monthly plans?',
    a: 'Custom is a fully hands-on, bespoke service. Our team contacts you personally, handles all creative direction, and delivers a professional short film — not an automated reel.',
  },
]

function FeatureRow({ text, included }: { text: string; included: boolean }) {
  return (
    <div className='flex items-start gap-3'>
      {included ? (
        <svg width='16' height='16' viewBox='0 0 24 24' fill='none' className='flex-shrink-0 mt-0.5'>
          <path d='M20 6L9 17l-5-5' stroke='#D4A574' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
      ) : (
        <svg width='16' height='16' viewBox='0 0 24 24' fill='none' className='flex-shrink-0 mt-0.5'>
          <path d='M18 6L6 18M6 6l12 12' stroke='rgba(245,240,232,0.15)' strokeWidth='1.5' strokeLinecap='round' />
        </svg>
      )}
      <span className={cn(
        'font-body text-sm leading-relaxed',
        included ? 'text-cream/65' : 'text-cream/22',
      )}>
        {text}
      </span>
    </div>
  )
}

export default function PricingPage() {
  const user         = useAuthStore((s) => s.user)
  const subscription = useAuthStore((s) => s.subscription)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const cta = (plan: 'classic' | 'premium') => {
    if (!user) return { href: '/signup', label: 'Get Started' }
    if (subscription?.plan === plan) return { href: '/studio', label: 'Go to Studio' }
    return { href: '/signup', label: 'Get Started' }
  }

  return (
    <div className='min-h-screen pt-32 pb-24'>

      {/* Header */}
      <div className='text-center px-6 mb-20'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ duration: 0.6 }}
        >
          <p className='font-body text-xs text-gold/60 tracking-widest uppercase mb-4'>
            Pricing
          </p>
          <h1 className='font-heading text-[clamp(3rem,6vw,5rem)] font-medium text-cream leading-tight'>
            Simple, honest pricing.
          </h1>
          <p className='font-body text-lg text-cream/40 mt-5 max-w-lg mx-auto leading-relaxed'>
            No hidden fees. No per-video charges. One flat monthly rate — 10 chef&apos;s special reels every cycle.
          </p>
        </motion.div>
      </div>

      {/* Main plan cards */}
      <div className='max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>

        {/* Classic */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='bg-shadow/60 border border-gold/12 rounded-3xl p-8 flex flex-col'
        >
          <div className='mb-8'>
            <p className='font-body text-xs text-gold/50 tracking-widest uppercase mb-3'>Classic Menu</p>
            <div className='flex items-end gap-2 mb-2'>
              <span className='font-heading text-6xl font-medium text-cream'>$49</span>
              <span className='font-body text-sm text-cream/35 mb-2'>/month</span>
            </div>
            <p className='font-body text-sm text-cream/40 leading-relaxed'>
              One photo. One cinematic reel. Every time.
            </p>
          </div>

          {subscription?.plan === 'classic' ? (
            <Link href='/studio' className='mb-8'>
              <Button variant='gold' fullWidth>Go to Studio</Button>
            </Link>
          ) : (
            <Link href={cta('classic').href} className='mb-8'>
              <Button variant='ghost' fullWidth>{cta('classic').label}</Button>
            </Link>
          )}

          <div className='space-y-3.5 flex-1'>
            {CLASSIC_FEATURES.included.map((f, i) => (
              <FeatureRow key={i} text={f} included />
            ))}
            <div className='h-px bg-cream/5 my-4' />
            {CLASSIC_FEATURES.excluded.map((f, i) => (
              <FeatureRow key={i} text={f} included={false} />
            ))}
          </div>
        </motion.div>

        {/* Premium */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='relative gold-border-gradient rounded-3xl p-8 flex flex-col overflow-hidden'
        >
          {/* Glow */}
          <div className='absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none'
            style={{ background: 'radial-gradient(circle, rgba(212,135,74,0.1) 0%, transparent 70%)' }}
          />

          <div className='absolute top-5 right-5'>
            <span className='font-body text-[10px] text-amber-300 border border-amber-700/40 bg-amber-950/50 px-2.5 py-1 rounded-full tracking-widest uppercase'>
              Chef&apos;s Special
            </span>
          </div>

          <div className='mb-8'>
            <p className='font-body text-xs text-amber-400/60 tracking-widest uppercase mb-3'>Premium</p>
            <div className='flex items-end gap-2 mb-2'>
              <span className='font-heading text-6xl font-medium text-cream'>$169</span>
              <span className='font-body text-sm text-cream/35 mb-2'>/month</span>
            </div>
            <p className='font-body text-sm text-cream/40 leading-relaxed'>
              Four photos. One story. Full cinematic production.
            </p>
          </div>

          {subscription?.plan === 'premium' ? (
            <Link href='/studio' className='mb-8'>
              <Button variant='gold' fullWidth className='shadow-gold-md'>Go to Studio</Button>
            </Link>
          ) : (
            <Link href={cta('premium').href} className='mb-8'>
              <Button variant='gold' fullWidth className='shadow-gold-md'>
                {cta('premium').label}
              </Button>
            </Link>
          )}

          <div className='space-y-3.5 flex-1'>
            {PREMIUM_FEATURES.included.map((f, i) => (
              <FeatureRow key={i} text={f} included />
            ))}
            <div className='h-px bg-cream/5 my-4' />
            {PREMIUM_FEATURES.excluded.map((f, i) => (
              <FeatureRow key={i} text={f} included={false} />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Custom AI Filmmaking */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className='max-w-5xl mx-auto px-6 mb-24'
      >
        <div className='bg-shadow/40 border border-gold/8 rounded-3xl p-8 sm:p-10'>
          <div className='flex flex-col lg:flex-row lg:items-start gap-10'>

            <div className='lg:max-w-sm'>
              <p className='font-body text-xs text-gold/50 tracking-widest uppercase mb-3'>
                Custom AI Filmmaking
              </p>
              <h2 className='font-heading text-3xl font-medium text-cream mb-3'>
                A film built for your brand.
              </h2>
              <p className='font-body text-sm text-cream/40 leading-relaxed mb-6'>
                Our team personally handles every frame. You get a bespoke short film delivered to your brief — with revisions included.
              </p>
              <Link href='/custom-filmmaking'>
                <Button variant='ghost'>Request a Custom Film</Button>
              </Link>
            </div>

            <div className='flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4'>
              {CUSTOM_TIERS.map((tier) => (
                <div
                  key={tier.key}
                  className={cn(
                    'rounded-2xl p-5 border',
                    tier.highlight
                      ? 'border-gold/25 bg-gold/6'
                      : 'border-cream/6 bg-cream/2',
                  )}
                >
                  {tier.highlight && (
                    <span className='font-body text-[10px] text-gold border border-gold/25 px-2 py-0.5 rounded-full uppercase tracking-widest mb-3 inline-block'>
                      Popular
                    </span>
                  )}
                  <p className='font-heading text-3xl font-medium text-cream'>{tier.price}</p>
                  <p className='font-body text-xs text-gold/50 mt-0.5 mb-5'>{tier.name}</p>
                  <ul className='space-y-2.5'>
                    {[tier.duration + ' video', tier.revision, tier.format, tier.delivery].map((d, i) => (
                      <li key={i} className='flex items-start gap-2'>
                        <span className='w-1 h-1 rounded-full bg-gold/30 flex-shrink-0 mt-2' />
                        <span className='font-body text-xs text-cream/40 leading-relaxed'>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* FAQ */}
      <div className='max-w-2xl mx-auto px-6'>
        <h2 className='font-heading text-3xl font-medium text-cream text-center mb-10'>
          Common questions
        </h2>
        <div>
          {FAQ.map((item, i) => (
            <div key={i} className='border-b border-cream/5 last:border-b-0'>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className='w-full flex items-center justify-between py-5 text-left group'
              >
                <span className={cn(
                  'font-body text-sm font-medium transition-colors pr-6',
                  openFaq === i ? 'text-cream' : 'text-cream/55 group-hover:text-cream/80',
                )}>
                  {item.q}
                </span>
                <div className={cn(
                  'flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all',
                  openFaq === i ? 'border-gold/40 bg-gold/10 rotate-45' : 'border-cream/10',
                )}>
                  <svg width='10' height='10' viewBox='0 0 12 12' fill='none'
                    stroke={openFaq === i ? '#D4A574' : 'rgba(245,240,232,0.3)'} strokeWidth='1.5'>
                    <path d='M6 1v10M1 6h10' strokeLinecap='round' />
                  </svg>
                </div>
              </button>
              {openFaq === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className='overflow-hidden'
                >
                  <p className='font-body text-sm text-cream/40 leading-relaxed pb-5'>
                    {item.a}
                  </p>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}