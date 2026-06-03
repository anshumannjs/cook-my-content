'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import Button from '@/components/ui/Button'
import Input, { Textarea } from '@/components/ui/Input'
import type { CustomTier } from '@/lib/types'

// ─── Schema ──────────────────────────────────────────────────────────────────
const schema = z.object({
  fullName:       z.string().min(2, 'Name is required'),
  email:          z.string().email('Valid email required'),
  phone:          z.string().min(6, 'Phone number required'),
  businessName:   z.string().min(2, 'Business name required'),
  projectGoals:   z.string().min(20, 'Tell us a bit more — at least 20 characters'),
  videoStyle:     z.string().min(10, 'Describe the style you have in mind'),
  targetAudience: z.string().min(10, 'Who is this video for?'),
  references:     z.string().optional(),
  additionalNotes:z.string().optional(),
})
type FormValues = z.infer<typeof schema>

// ─── Tier data ────────────────────────────────────────────────────────────────
const TIERS = [
  {
    key:      'starter' as CustomTier,
    name:     'Starter',
    price:    '$299',
    duration: '20–30 sec',
    delivery: '4–5 working days',
    ideal:    'Brand intro, product launch, event highlight',
  },
  {
    key:      'advance' as CustomTier,
    name:     'Advance',
    price:    '$399',
    duration: '35–60 sec',
    delivery: '7–10 working days',
    ideal:    'Brand story, campaign film, testimonial showcase',
    popular:  true,
  },
  {
    key:      'pro_master' as CustomTier,
    name:     'Pro Master',
    price:    '$599',
    duration: '60–120 sec',
    delivery: '10–15 working days',
    ideal:    'Full brand film, documentary-style, hero video',
  },
]

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className='flex items-center gap-2'>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className='flex items-center gap-2'>
          <div className={cn(
            'w-7 h-7 rounded-full flex items-center justify-center font-body text-xs font-medium transition-all duration-300',
            i + 1 < current
              ? 'bg-gold text-primary'
              : i + 1 === current
                ? 'bg-gold/15 border border-gold/40 text-gold'
                : 'bg-cream/5 border border-cream/10 text-cream/25',
          )}>
            {i + 1 < current ? (
              <svg width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='3'>
                <path d='M20 6L9 17l-5-5' strokeLinecap='round' />
              </svg>
            ) : (
              i + 1
            )}
          </div>
          {i < total - 1 && (
            <div className={cn(
              'w-10 h-px transition-colors duration-300',
              i + 1 < current ? 'bg-gold/40' : 'bg-cream/8',
            )} />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CustomFilmmakingPage() {
  const [step,      setStep]      = useState(1)
  const [tier,      setTier]      = useState<CustomTier | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  function onSubmit(_values: FormValues) {
    // No API connection yet — just show success
    return new Promise<void>((res) => {
      setTimeout(() => {
        setSubmitted(true)
        res()
      }, 1200)
    })
  }

  if (submitted) {
    return (
      <div className='min-h-screen pt-32 pb-24 flex items-center justify-center px-6'>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1   }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className='max-w-lg w-full text-center'
        >
          <div className='relative w-24 h-24 mx-auto mb-8'>
            <div className='absolute inset-0 rounded-full border border-gold/15 animate-ping-slow' />
            <div className='w-full h-full rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center'>
              <svg width='36' height='36' viewBox='0 0 24 24' fill='none' stroke='#D4A574' strokeWidth='1.5'>
                <path d='M20 6L9 17l-5-5' strokeLinecap='round' strokeLinejoin='round' />
              </svg>
            </div>
          </div>

          <h1 className='font-heading text-4xl font-medium text-cream mb-4'>
            Request received.
          </h1>
          <p className='font-body text-base text-cream/50 leading-relaxed mb-3'>
            Our team will personally review your brief and reach out within{' '}
            <span className='text-gold'>1–2 business days</span> to discuss your project.
          </p>
          <p className='font-body text-sm text-cream/30 mb-10'>
            Check your inbox for a confirmation email.
          </p>

          <div className='bg-shadow/60 border border-gold/10 rounded-2xl p-5 text-left mb-8'>
            <p className='font-body text-xs text-gold/50 uppercase tracking-widest mb-3'>Your selection</p>
            <div className='flex items-center justify-between'>
              <span className='font-body text-sm text-cream/60'>
                {TIERS.find((t) => t.key === tier)?.name} Package
              </span>
              <span className='font-heading text-xl text-cream'>
                {TIERS.find((t) => t.key === tier)?.price}
              </span>
            </div>
          </div>

          <Button variant='ghost' onClick={() => window.location.href = '/'}>
            Back to Home
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className='min-h-screen pt-32 pb-24'>

      {/* Header */}
      <div className='text-center px-6 mb-16'>
        <p className='font-body text-xs text-gold/60 tracking-widest uppercase mb-4'>
          Custom AI Filmmaking
        </p>
        <h1 className='font-heading text-[clamp(2.5rem,5vw,4.5rem)] font-medium text-cream'>
          Let&apos;s make your film.
        </h1>
        <p className='font-body text-base text-cream/40 mt-4 max-w-md mx-auto leading-relaxed'>
          Tell us about your project. Our team handles everything — personally.
        </p>
      </div>

      <div className='max-w-3xl mx-auto px-6'>

        {/* Step indicator */}
        <div className='flex justify-center mb-12'>
          <StepIndicator current={step} total={3} />
        </div>

        <AnimatePresence mode='wait'>

          {/* ── Step 1: Choose tier ──────────────────────────────────────── */}
          {step === 1 && (
            <motion.div
              key='step1'
              initial={{ opacity: 0, x: 30  }}
              animate={{ opacity: 1, x: 0   }}
              exit={{ opacity: 0,   x: -30  }}
              transition={{ duration: 0.3 }}
            >
              <div className='text-center mb-8'>
                <h2 className='font-heading text-3xl font-medium text-cream mb-2'>
                  Choose your package
                </h2>
                <p className='font-body text-sm text-cream/40'>
                  All packages include 1 revision and vertical + horizontal formats.
                </p>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10'>
                {TIERS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTier(t.key)}
                    className={cn(
                      'relative text-left rounded-3xl border p-6 transition-all duration-300',
                      tier === t.key
                        ? 'border-gold/40 bg-gold/8 shadow-gold-sm'
                        : 'border-cream/8 bg-cream/3 hover:border-cream/15',
                    )}
                  >
                    {t.popular && (
                      <span className='absolute top-4 right-4 font-body text-[10px] text-gold border border-gold/25 px-2 py-0.5 rounded-full uppercase tracking-widest'>
                        Popular
                      </span>
                    )}

                    {/* Selection ring */}
                    {tier === t.key && (
                      <div className='absolute top-4 left-4 w-4 h-4 rounded-full border-2 border-gold flex items-center justify-center'>
                        <div className='w-2 h-2 rounded-full bg-gold' />
                      </div>
                    )}

                    <div className={tier === t.key ? 'mt-4' : ''}>
                      <p className='font-body text-xs text-cream/30 uppercase tracking-widest mb-2'>
                        {t.name}
                      </p>
                      <p className='font-heading text-4xl font-medium text-cream mb-4'>
                        {t.price}
                      </p>

                      <ul className='space-y-2.5'>
                        {[
                          t.duration + ' video',
                          '1 revision',
                          'Vertical & horizontal',
                          t.delivery,
                        ].map((detail, i) => (
                          <li key={i} className='flex items-start gap-2'>
                            <span className='w-1 h-1 rounded-full bg-gold/30 flex-shrink-0 mt-2' />
                            <span className='font-body text-xs text-cream/40 leading-relaxed'>{detail}</span>
                          </li>
                        ))}
                      </ul>

                      <p className={cn(
                        'font-body text-xs mt-4 pt-4 border-t leading-relaxed',
                        tier === t.key ? 'border-gold/15 text-gold/60' : 'border-cream/5 text-cream/25',
                      )}>
                        Ideal for: {t.ideal}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <Button
                variant='gold'
                fullWidth
                size='lg'
                disabled={!tier}
                onClick={() => setStep(2)}
                className='shadow-gold-md'
              >
                Continue with {tier ? TIERS.find((t) => t.key === tier)?.name : 'selected package'}
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='ml-1'>
                  <path d='M5 12h14M12 5l7 7-7 7' />
                </svg>
              </Button>
            </motion.div>
          )}

          {/* ── Step 2: Project details ──────────────────────────────────── */}
          {step === 2 && (
            <motion.div
              key='step2'
              initial={{ opacity: 0, x: 30  }}
              animate={{ opacity: 1, x: 0   }}
              exit={{ opacity: 0,   x: -30  }}
              transition={{ duration: 0.3 }}
            >
              <div className='flex items-center justify-between mb-8'>
                <div>
                  <h2 className='font-heading text-3xl font-medium text-cream'>
                    Your project brief
                  </h2>
                  <p className='font-body text-sm text-cream/40 mt-1'>
                    The more detail, the better your film.
                  </p>
                </div>
                <div className='px-4 py-2 rounded-xl border border-gold/20 bg-gold/5'>
                  <p className='font-body text-xs text-gold/60'>
                    {TIERS.find((t) => t.key === tier)?.name} · {TIERS.find((t) => t.key === tier)?.price}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>

                {/* Contact info */}
                <div className='bg-shadow/50 border border-gold/8 rounded-3xl p-6 space-y-4'>
                  <p className='font-body text-xs text-cream/30 uppercase tracking-widest'>Contact Info</p>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <Input
                      label='Your Name'
                      placeholder='Jane Smith'
                      error={errors.fullName?.message}
                      {...register('fullName')}
                    />
                    <Input
                      label='Email'
                      type='email'
                      placeholder='jane@brand.com'
                      error={errors.email?.message}
                      {...register('email')}
                    />
                  </div>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <Input
                      label='Phone Number'
                      type='tel'
                      placeholder='+1 234 567 8900'
                      error={errors.phone?.message}
                      {...register('phone')}
                    />
                    <Input
                      label='Business / Brand Name'
                      placeholder='Bloom Skincare'
                      error={errors.businessName?.message}
                      {...register('businessName')}
                    />
                  </div>
                </div>

                {/* Project details */}
                <div className='bg-shadow/50 border border-gold/8 rounded-3xl p-6 space-y-4'>
                  <p className='font-body text-xs text-cream/30 uppercase tracking-widest'>Project Details</p>
                  <Textarea
                    label='Project Goals'
                    placeholder='What do you want this film to achieve? e.g. "Introduce our new product line to women aged 28–45 on Instagram, focus on luxury feel and emotional connection"'
                    rows={4}
                    error={errors.projectGoals?.message}
                    {...register('projectGoals')}
                  />
                  <Textarea
                    label='Video Style & Aesthetic'
                    placeholder='Describe the look and feel. e.g. "Warm, golden hour tones. Slow motion. Minimal text. Think premium skincare meets fashion film."'
                    rows={3}
                    error={errors.videoStyle?.message}
                    {...register('videoStyle')}
                  />
                  <Textarea
                    label='Target Audience'
                    placeholder='Who is this video for? e.g. "Women 28–45, interested in luxury skincare and wellness, primarily on Instagram"'
                    rows={2}
                    error={errors.targetAudience?.message}
                    {...register('targetAudience')}
                  />
                  {/* <Textarea
                    label='Reference Videos or Brands (optional)'
                    placeholder='Any brands or videos that capture the vibe you\'re after? YouTube links, brand names, anything helps.'
                    rows={2}
                    {...register('references')}
                  /> */}
                  <Textarea
                    label='Additional Notes (optional)'
                    placeholder='Anything else we should know — deadlines, special requirements, upcoming campaigns…'
                    rows={2}
                    {...register('additionalNotes')}
                  />
                </div>

                <div className='flex gap-3'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setStep(1)}
                    className='flex-shrink-0'
                  >
                    <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='mr-1'>
                      <path d='M19 12H5M12 19l-7-7 7-7' />
                    </svg>
                    Back
                  </Button>
                  <Button
                    type='button'
                    variant='gold'
                    fullWidth
                    onClick={() => {
                      // Trigger validation then go to step 3
                      handleSubmit(() => setStep(3))()
                    }}
                  >
                    Review & Submit
                    <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='ml-1'>
                      <path d='M5 12h14M12 5l7 7-7 7' />
                    </svg>
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {/* ── Step 3: Review ───────────────────────────────────────────── */}
          {step === 3 && (
            <motion.div
              key='step3'
              initial={{ opacity: 0, x: 30  }}
              animate={{ opacity: 1, x: 0   }}
              exit={{ opacity: 0,   x: -30  }}
              transition={{ duration: 0.3 }}
            >
              <div className='text-center mb-8'>
                <h2 className='font-heading text-3xl font-medium text-cream mb-2'>
                  Almost done.
                </h2>
                <p className='font-body text-sm text-cream/40'>
                  Review your selection and submit. Our team will be in touch within 1–2 business days.
                </p>
              </div>

              <div className='bg-shadow/60 border border-gold/15 rounded-3xl p-8 mb-6'>
                <div className='flex items-center justify-between pb-6 border-b border-cream/5 mb-6'>
                  <div>
                    <p className='font-body text-xs text-cream/30 mb-1'>Selected Package</p>
                    <p className='font-heading text-2xl text-cream'>
                      Custom AI Filmmaking — {TIERS.find((t) => t.key === tier)?.name}
                    </p>
                  </div>
                  <p className='font-heading text-3xl text-gold'>
                    {TIERS.find((t) => t.key === tier)?.price}
                  </p>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  {[
                    { label: 'Video Length',   value: TIERS.find((t) => t.key === tier)?.duration + ' video' },
                    { label: 'Delivery',       value: TIERS.find((t) => t.key === tier)?.delivery },
                    { label: 'Revisions',      value: '1 included' },
                    { label: 'Formats',        value: 'Vertical & horizontal' },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className='font-body text-xs text-cream/25 mb-0.5'>{item.label}</p>
                      <p className='font-body text-sm text-cream/60'>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className='bg-amber-950/20 border border-amber-800/25 rounded-2xl p-4 mb-8'>
                <p className='font-body text-xs text-amber-400/70 leading-relaxed'>
                  <span className='font-medium text-amber-400'>No payment yet.</span>{' '}
                  Our team will review your brief and send a payment link once we&apos;ve confirmed all details with you.
                </p>
              </div>

              <div className='flex gap-3'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setStep(2)}
                  className='flex-shrink-0'
                >
                  <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='mr-1'>
                    <path d='M19 12H5M12 19l-7-7 7-7' />
                  </svg>
                  Back
                </Button>
                <Button
                  variant='gold'
                  fullWidth
                  loading={isSubmitting}
                  onClick={handleSubmit(onSubmit)}
                  className='shadow-gold-md'
                >
                  Submit Request
                  <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='ml-1'>
                    <path d='M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z' />
                  </svg>
                </Button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}