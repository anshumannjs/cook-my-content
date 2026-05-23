'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { useStudioStore } from '@/lib/store/studioStore'

export default function SuccessState() {
  const router       = useRouter()
  const submissionId = useStudioStore((s) => s.submissionId)
  const activePlan   = useStudioStore((s) => s.activePlan)
  const reset        = useStudioStore((s) => s.resetUpload)

  const deliveryTime = activePlan === 'premium' ? '25–30 minutes' : '20–35 minutes'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1   }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className='flex flex-col items-center text-center py-16 px-6'
    >
      {/* Animated checkmark */}
      <div className='relative mb-10'>
        <div className='absolute inset-0 -m-3 rounded-full border border-gold/15 animate-ping-slow' />
        <div className='absolute inset-0 -m-6 rounded-full border border-gold/8 animate-ping-slow'
          style={{ animationDelay: '0.5s' }}
        />
        <div className='relative w-24 h-24 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center shadow-gold-md'>
          <motion.svg
            width='40' height='40' viewBox='0 0 24 24' fill='none'
            stroke='#D4A574' strokeWidth='1.5'
            strokeLinecap='round' strokeLinejoin='round'
          >
            <motion.path
              d='M20 6L9 17l-5-5'
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            />
          </motion.svg>
        </div>
      </div>

      <h2 className='font-heading text-4xl sm:text-5xl font-medium text-cream mb-4'>
        Your reel is cooking!
      </h2>

      <p className='font-body text-base text-cream/50 max-w-md leading-relaxed mb-3'>
        Celestiva has your photo and is crafting your cinematic reel right now.
        Expect it in your inbox in{' '}
        <span className='text-gold'>{deliveryTime}</span>.
      </p>

      {submissionId && (
        <div className='mt-2 mb-8 px-4 py-2 rounded-xl bg-cream/3 border border-cream/8'>
          <p className='font-body text-xs text-cream/25'>
            Ref: <span className='font-mono text-cream/40'>{submissionId}</span>
          </p>
        </div>
      )}

      {/* Tips while waiting */}
      <div className='w-full max-w-md bg-shadow/60 border border-gold/8 rounded-2xl p-6 mb-10 text-left'>
        <p className='font-body text-xs text-gold/50 uppercase tracking-widest mb-4'>
          While you wait
        </p>
        <ul className='space-y-3'>
          {[
            'Check your inbox — your reel will arrive there directly',
            'Submit another reel after 24 hours',
            'Want a longer, bespoke film? Try Custom AI Filmmaking',
          ].map((tip, i) => (
            <li key={i} className='flex items-start gap-3'>
              <div className='w-5 h-5 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5'>
                <span className='font-body text-[10px] text-gold/60'>{i + 1}</span>
              </div>
              <span className='font-body text-sm text-cream/45 leading-relaxed'>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className='flex flex-col sm:flex-row gap-3 w-full max-w-sm'>
        <Button
          variant='gold'
          fullWidth
          onClick={() => router.push('/library')}
        >
          View Library
        </Button>
        <Button
          variant='ghost'
          fullWidth
          onClick={() => reset()}
        >
          Cook Another
        </Button>
      </div>
    </motion.div>
  )
}