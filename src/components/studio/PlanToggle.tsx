'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { useStudioStore } from '@/lib/store/studioStore'
import type { PlanType, UserSubscription } from '@/lib/types'

interface PlanToggleProps {
  subscription: UserSubscription | null
}

export default function PlanToggle({ subscription }: PlanToggleProps) {
  const activePlan   = useStudioStore((s) => s.activePlan)
  const setActivePlan = useStudioStore((s) => s.setActivePlan)

  const plans: { key: PlanType; label: string; sub: string }[] = [
    { key: 'classic', label: 'Classic Menu',          sub: '1 photo · 10 sec'  },
    { key: 'premium', label: "Premium Chef's Special", sub: '4 photos · 25 sec' },
  ]

  // If user is on classic plan, lock them to classic
  const lockedToClassic = subscription?.tier === 'classic'

  return (
    <div className='flex flex-col sm:flex-row gap-3'>
      {plans.map((plan) => {
        const isActive  = activePlan === plan.key
        const isLocked  = lockedToClassic && plan.key === 'premium'

        return (
          <button
            key={plan.key}
            onClick={() => !isLocked && setActivePlan(plan.key)}
            disabled={isLocked}
            className={cn(
              'relative flex-1 flex items-center gap-4 px-5 py-4 rounded-2xl border text-left',
              'transition-all duration-300',
              isActive && !isLocked
                ? plan.key === 'premium'
                  ? 'gold-border-gradient shadow-gold-sm'
                  : 'border-gold/35 bg-gold/8 shadow-gold-sm'
                : 'border-cream/8 bg-cream/3 hover:border-cream/15',
              isLocked && 'opacity-40 cursor-not-allowed',
            )}
          >
            {/* Active indicator */}
            {isActive && (
              <motion.div
                layoutId='plan-indicator'
                className={cn(
                  'absolute inset-0 rounded-2xl pointer-events-none',
                  plan.key === 'premium'
                    ? 'bg-amber-500/5'
                    : 'bg-gold/5',
                )}
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}

            {/* Radio dot */}
            <div className={cn(
              'relative flex-shrink-0 w-4 h-4 rounded-full border-2 transition-colors',
              isActive
                ? plan.key === 'premium' ? 'border-amber-400' : 'border-gold'
                : 'border-cream/20',
            )}>
              {isActive && (
                <motion.div
                  layoutId={`dot-${plan.key}`}
                  className={cn(
                    'absolute inset-[3px] rounded-full',
                    plan.key === 'premium' ? 'bg-amber-400' : 'bg-gold',
                  )}
                />
              )}
            </div>

            <div className='min-w-0'>
              <p className={cn(
                'font-body text-sm font-medium truncate transition-colors',
                isActive ? 'text-cream' : 'text-cream/50',
              )}>
                {plan.label}
              </p>
              <p className='font-body text-xs text-cream/30 mt-0.5'>{plan.sub}</p>
            </div>

            {plan.key === 'premium' && subscription?.tier === 'premium' && (
              <span className='ml-auto flex-shrink-0 text-[10px] text-amber-400 border border-amber-700/40 bg-amber-950/30 px-2 py-0.5 rounded-full font-body'>
                Your Plan
              </span>
            )}
            {plan.key === 'classic' && subscription?.tier === 'classic' && (
              <span className='ml-auto flex-shrink-0 text-[10px] text-gold border border-gold/25 bg-gold/5 px-2 py-0.5 rounded-full font-body'>
                Your Plan
              </span>
            )}
            {isLocked && (
              <span className='ml-auto flex-shrink-0'>
                <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='text-cream/20'>
                  <rect x='3' y='11' width='18' height='11' rx='2' /><path d='M7 11V7a5 5 0 0110 0v4' />
                </svg>
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}