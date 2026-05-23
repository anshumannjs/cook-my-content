'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'

interface EmptyStateProps {
  filtered?: boolean  // true = filters active, false = no reels at all
}

export default function EmptyState({ filtered = false }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{ duration: 0.5 }}
      className='flex flex-col items-center justify-center py-24 text-center px-6'
    >
      {/* Illustration */}
      <div className='relative w-28 h-28 mb-8'>
        <div className='absolute inset-0 rounded-full bg-gold/5 border border-gold/10' />
        <div className='absolute inset-4 rounded-full bg-gold/5 border border-gold/8' />
        <div className='absolute inset-0 flex items-center justify-center'>
          {filtered ? (
            <svg width='36' height='36' viewBox='0 0 24 24' fill='none' stroke='rgba(212,165,116,0.3)' strokeWidth='1.5'>
              <circle cx='11' cy='11' r='8' />
              <path d='m21 21-4.35-4.35' />
            </svg>
          ) : (
            <svg width='36' height='36' viewBox='0 0 24 24' fill='none' stroke='rgba(212,165,116,0.3)' strokeWidth='1.5'>
              <rect x='3' y='3' width='18' height='18' rx='2' />
              <circle cx='8.5' cy='8.5' r='1.5' />
              <path d='M21 15l-5-5L5 21' />
            </svg>
          )}
        </div>
        {/* Orbiting dot */}
        <div className='absolute inset-0 rounded-full border border-gold/8 animate-spin-slow' />
        <div className='absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-gold/30' />
      </div>

      <h3 className='font-heading text-3xl font-medium text-cream mb-3'>
        {filtered ? 'No reels found' : 'Your library is empty'}
      </h3>

      <p className='font-body text-sm text-cream/40 max-w-xs leading-relaxed mb-8'>
        {filtered
          ? 'No reels match your current filters. Try adjusting or clearing them.'
          : "You haven't cooked any reels yet. Upload a photo and Celestiva will handle the rest."}
      </p>

      {filtered ? (
        <Button
          variant='ghost'
          onClick={() => window.location.reload()}
        >
          Clear filters
        </Button>
      ) : (
        <Link href='/studio'>
          <Button variant='gold'>
            Cook Your First Reel
            <svg width='16' height='16' viewBox='0 0 14 14' fill='currentColor' className='ml-1'>
              <path d='M3 2.5L11 7L3 11.5V2.5Z' />
            </svg>
          </Button>
        </Link>
      )}
    </motion.div>
  )
}