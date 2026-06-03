'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { useTrialUsage } from '@/lib/hooks/useTrialUsage'
import type { UserSubscription } from '@/lib/types'

interface TrialBannerProps {
  subscription: UserSubscription
  email:        string
}

export default function TrialBanner({ subscription, email }: TrialBannerProps) {
  const [dismissed, setDismissed] = useState(false)
  const { data: usage } = useTrialUsage(email, true)

  if (dismissed) return null

  const daysLeft   = subscription.trialDaysRemaining ?? 0
  const todayUsed  = usage?.todayCount  ?? 0
  const remaining  = usage?.remaining   ?? 3
  const isBlocked  = usage?.isBlocked   ?? false

  return (
    <div className={cn(
      'relative flex items-center justify-between gap-4',
      'px-4 sm:px-6 py-2.5',
      'border-b text-xs font-body',
      isBlocked
        ? 'bg-red-950/40 border-red-800/30 text-red-300/80'
        : 'bg-amber-950/40 border-amber-800/25 text-amber-300/80',
    )}>

      <div className='flex items-center gap-4 flex-wrap'>
        {/* Trial indicator */}
        <div className='flex items-center gap-2'>
          <span className={cn(
            'w-1.5 h-1.5 rounded-full flex-shrink-0',
            isBlocked ? 'bg-red-400' : 'bg-amber-400 animate-pulse',
          )} />
          <span>
            Free trial —{' '}
            <span className='font-medium text-amber-200'>
              {daysLeft === 0 ? 'ends today' : `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`}
            </span>
          </span>
        </div>

        {/* Separator */}
        <span className='text-amber-800/60 hidden sm:inline'>·</span>

        {/* Daily usage */}
        <div className='flex items-center gap-2 hidden sm:flex'>
          <div className='flex gap-0.5'>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  'w-3.5 h-1.5 rounded-full transition-colors',
                  i < todayUsed
                    ? isBlocked ? 'bg-red-500' : 'bg-amber-400'
                    : 'bg-amber-900/60',
                )}
              />
            ))}
          </div>
          <span>
            {isBlocked
              ? 'Daily limit reached — resets at midnight'
              : `${remaining} video${remaining !== 1 ? 's' : ''} remaining today`
            }
          </span>
        </div>
      </div>

      {/* Right side */}
      <div className='flex items-center gap-3 flex-shrink-0'>
        <Link
          href='/pricing'
          className='font-medium text-amber-200 hover:text-amber-100 transition-colors underline underline-offset-2'
        >
          Upgrade now
        </Link>
        <button
          onClick={() => setDismissed(true)}
          className='text-amber-600 hover:text-amber-400 transition-colors'
          aria-label='Dismiss'
        >
          <svg width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
            <path d='M18 6L6 18M6 6l12 12' />
          </svg>
        </button>
      </div>
    </div>
  )
}