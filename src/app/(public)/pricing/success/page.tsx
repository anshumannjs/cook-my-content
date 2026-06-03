'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/lib/store/authStore'
import { useSubscription } from '@/lib/hooks/useSubscription'
import { useQueryClient } from '@tanstack/react-query'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import { format, addDays } from 'date-fns'

export default function PricingSuccessPage() {
  const router      = useRouter()
  const user        = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  const [elapsed,   setElapsed]   = useState(0)
  const [timedOut,  setTimedOut]  = useState(false)

  const { data: subscription } = useSubscription(user?.id ?? null)

  // Poll every 2 seconds until subscription appears
  useEffect(() => {
    if (subscription) return

    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] })
      setElapsed((e) => e + 2)
    }, 2000)

    return () => clearInterval(interval)
  }, [subscription, queryClient])

  // Time out after 30 seconds — webhook might have failed
  useEffect(() => {
    if (subscription) return
    if (elapsed >= 30) setTimedOut(true)
  }, [elapsed, subscription])

  // Once subscription confirmed → redirect to studio
  useEffect(() => {
    if (!subscription) return
    const t = setTimeout(() => router.replace('/studio'), 1500)
    return () => clearTimeout(t)
  }, [subscription, router])

  const plan     = subscription?.plan ?? 'classic'
  const trialEnd = subscription?.trialEnd
    ? format(new Date(subscription.trialEnd), 'MMMM d, yyyy')
    : format(addDays(new Date(), 3), 'MMMM d, yyyy')

  return (
    <div className='min-h-screen flex items-center justify-center px-6 py-24'>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1   }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className='max-w-lg w-full text-center'
      >
        {/* ── Waiting for webhook ─────────────────────────────────────── */}
        {!subscription && !timedOut && (
          <>
            <div className='w-20 h-20 mx-auto mb-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center'>
              <Spinner size='lg' className='text-gold/60' />
            </div>
            <h1 className='font-heading text-3xl font-medium text-cream mb-3'>
              Confirming your payment…
            </h1>
            <p className='font-body text-sm text-cream/40'>
              This usually takes a few seconds.
            </p>
          </>
        )}

        {/* ── Timed out — webhook didn't fire ─────────────────────────── */}
        {!subscription && timedOut && (
          <>
            <div className='w-20 h-20 mx-auto mb-8 rounded-full bg-amber-950/40 border border-amber-800/30 flex items-center justify-center'>
              <svg width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='#E8A854' strokeWidth='1.5'>
                <circle cx='12' cy='12' r='10'/><path d='M12 8v4M12 16h.01'/>
              </svg>
            </div>
            <h1 className='font-heading text-3xl font-medium text-cream mb-3'>
              Taking longer than expected
            </h1>
            <p className='font-body text-sm text-cream/45 mb-6 max-w-sm mx-auto leading-relaxed'>
              Payment was received but activation is delayed. Try refreshing — if the problem persists contact support.
            </p>
            <div className='flex flex-col sm:flex-row gap-3 justify-center'>
              <Button variant='gold' onClick={() => {
                queryClient.invalidateQueries({ queryKey: ['subscription'] })
                setTimedOut(false)
                setElapsed(0)
              }}>
                Try Again
              </Button>
              <Button variant='ghost' onClick={() => router.push('/')}>
                Go Home
              </Button>
            </div>
          </>
        )}

        {/* ── Subscription confirmed ───────────────────────────────────── */}
        {subscription && (
          <>
            <div className='relative w-24 h-24 mx-auto mb-8'>
              <div className='absolute inset-0 rounded-full border border-gold/15 animate-ping-slow' />
              <div className='w-full h-full rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center shadow-gold-md'>
                <motion.svg
                  width='36' height='36' viewBox='0 0 24 24'
                  fill='none' stroke='#D4A574' strokeWidth='1.5'
                  strokeLinecap='round' strokeLinejoin='round'
                >
                  <motion.path
                    d='M20 6L9 17l-5-5'
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  />
                </motion.svg>
              </div>
            </div>

            <h1 className='font-heading text-4xl sm:text-5xl font-medium text-cream mb-4'>
              Your trial is live.
            </h1>
            <p className='font-body text-base text-cream/50 leading-relaxed mb-8 max-w-sm mx-auto'>
              Welcome to Cook My Content.{' '}
              <span className='text-gold capitalize'>
                {plan === 'premium' ? "Premium Chef's Special" : 'Classic Menu'}
              </span>{' '}
              — 3 days free, starting now.
            </p>

            <div className='bg-shadow/60 border border-gold/10 rounded-2xl p-6 mb-8 text-left space-y-3'>
              {[
                { label: 'Plan',         value: plan === 'premium' ? "Premium Chef's Special" : 'Classic Menu' },
                { label: 'Trial period', value: '3 days — no charge today' },
                { label: 'Daily limit',  value: '3 videos per day during trial' },
                { label: 'Trial ends',   value: trialEnd },
                { label: 'After trial',  value: `${plan === 'premium' ? '$169' : '$49'}/month — cancel anytime` },
              ].map((item) => (
                <div key={item.label} className='flex items-center justify-between'>
                  <span className='font-body text-xs text-cream/30'>{item.label}</span>
                  <span className='font-body text-sm text-cream/65'>{item.value}</span>
                </div>
              ))}
            </div>

            <Button
              variant='gold'
              size='lg'
              fullWidth
              onClick={() => router.replace('/studio')}
              className='shadow-gold-md'
            >
              Go to Studio
              <svg width='16' height='16' viewBox='0 0 14 14' fill='currentColor' className='ml-2'>
                <path d='M3 2.5L11 7L3 11.5V2.5Z' />
              </svg>
            </Button>

            <p className='font-body text-xs text-cream/20 mt-4'>
              Redirecting automatically…
            </p>
          </>
        )}
      </motion.div>
    </div>
  )
}