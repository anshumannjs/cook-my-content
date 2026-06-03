'use client'

import { useState } from 'react'

interface PastDueBannerProps {
  onManageBilling: () => void
  loading:         boolean
}

export default function PastDueBanner({ onManageBilling, loading }: PastDueBannerProps) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  return (
    <div className='flex items-center justify-between gap-4 px-4 sm:px-6 py-2.5 bg-red-950/50 border-b border-red-800/30 text-xs font-body'>
      <div className='flex items-center gap-2 text-red-300/80'>
        <svg width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
          <circle cx='12' cy='12' r='10' />
          <path d='M12 8v4M12 16h.01' />
        </svg>
        <span>
          Payment failed.{' '}
          <span className='font-medium text-red-200'>
            Update your payment method to keep access.
          </span>
        </span>
      </div>
      <div className='flex items-center gap-3 flex-shrink-0'>
        <button
          onClick={onManageBilling}
          disabled={loading}
          className='font-medium text-red-200 hover:text-red-100 transition-colors underline underline-offset-2 disabled:opacity-50'
        >
          {loading ? 'Opening…' : 'Fix payment'}
        </button>
        <button
          onClick={() => setDismissed(true)}
          className='text-red-700 hover:text-red-500 transition-colors'
        >
          <svg width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
            <path d='M18 6L6 18M6 6l12 12' />
          </svg>
        </button>
      </div>
    </div>
  )
}