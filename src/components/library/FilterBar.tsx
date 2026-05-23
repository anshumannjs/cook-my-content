'use client'

import { cn } from '@/lib/utils/cn'
import type { PlanType } from '@/lib/types'

type FilterPlan   = PlanType | 'all'
type FilterStatus = 'all' | 'submitted' | 'processing' | 'delivered' | 'failed'

interface FilterBarProps {
  planFilter:    FilterPlan
  statusFilter:  FilterStatus
  total:         number
  onPlanChange:  (p: FilterPlan)   => void
  onStatusChange:(s: FilterStatus) => void
}

const PLAN_TABS: { key: FilterPlan; label: string }[] = [
  { key: 'all',     label: 'All Reels' },
  { key: 'classic', label: 'Classic'   },
  { key: 'premium', label: 'Premium'   },
]

const STATUS_OPTIONS: { key: FilterStatus; label: string }[] = [
  { key: 'all',        label: 'Any status'  },
  { key: 'submitted',  label: 'Submitted'   },
  { key: 'processing', label: 'Processing'  },
  { key: 'delivered',  label: 'Delivered'   },
  { key: 'failed',     label: 'Failed'      },
]

export default function FilterBar({
  planFilter,
  statusFilter,
  total,
  onPlanChange,
  onStatusChange,
}: FilterBarProps) {
  return (
    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>

      {/* Plan tabs */}
      <div className='flex items-center gap-1 bg-cream/3 border border-cream/8 rounded-xl p-1'>
        {PLAN_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onPlanChange(tab.key)}
            className={cn(
              'px-4 py-2 rounded-lg font-body text-sm transition-all duration-200',
              planFilter === tab.key
                ? 'bg-gold/15 text-gold border border-gold/25'
                : 'text-cream/40 hover:text-cream/70',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className='flex items-center gap-3'>
        {/* Status filter */}
        <div className='relative'>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value as FilterStatus)}
            className={cn(
              'appearance-none pl-4 pr-9 py-2.5 rounded-xl',
              'bg-cream/3 border border-cream/8 text-cream/50',
              'font-body text-sm cursor-pointer',
              'hover:border-cream/15 transition-colors',
              'focus:outline-none focus:border-gold/30',
            )}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.key} value={o.key} className='bg-[#1C1612] text-cream'>
                {o.label}
              </option>
            ))}
          </select>
          <div className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'>
            <svg width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='rgba(245,240,232,0.3)' strokeWidth='2'>
              <path d='M6 9l6 6 6-6' />
            </svg>
          </div>
        </div>

        {/* Total count */}
        <div className='px-3 py-2 rounded-xl bg-cream/3 border border-cream/8'>
          <span className='font-body text-sm text-cream/30'>
            <span className='text-cream/60 font-medium'>{total}</span> reel{total !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  )
}