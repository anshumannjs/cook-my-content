'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'

export default function PricingCancelPage() {
  return (
    <div className='min-h-screen flex items-center justify-center px-6 py-24'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ duration: 0.4 }}
        className='max-w-md w-full text-center'
      >
        <div className='w-16 h-16 rounded-2xl bg-cream/5 border border-cream/10 flex items-center justify-center mx-auto mb-7'>
          <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='rgba(245,240,232,0.3)' strokeWidth='1.5'>
            <path d='M18 6L6 18M6 6l12 12' />
          </svg>
        </div>

        <h1 className='font-heading text-3xl font-medium text-cream mb-3'>
          Checkout cancelled.
        </h1>
        <p className='font-body text-sm text-cream/40 leading-relaxed mb-8'>
          No charges were made. Your trial is still waiting for you whenever you&apos;re ready.
        </p>

        <div className='flex flex-col sm:flex-row gap-3'>
          <Link href='/pricing' className='flex-1'>
            <Button variant='gold' fullWidth>Back to Pricing</Button>
          </Link>
          <Link href='/' className='flex-1'>
            <Button variant='ghost' fullWidth>Go Home</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}