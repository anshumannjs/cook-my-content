'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
})
type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [sent,   setSent]   = useState(false)
  const [sentTo, setSentTo] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit({ email }: FormData) {
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })
    if (error) { toast.error(error.message); return }
    setSentTo(email)
    setSent(true)
  }

  return (
    <div className='w-full max-w-[460px]'>
      <AnimatePresence mode='wait'>

        {!sent && (
          <motion.div
            key='form'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0  }}
            exit={{ opacity: 0,   y: -20 }}
            transition={{ duration: 0.35 }}
          >
            <div className='bg-shadow/50 backdrop-blur-xl border border-gold/10 rounded-[2rem] p-8 sm:p-10 shadow-card'>

              {/* Key icon */}
              <div className='w-14 h-14 rounded-2xl bg-gold/8 border border-gold/20 flex items-center justify-center mb-7'>
                <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#D4A574' strokeWidth='1.5'>
                  <path d='M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4' />
                </svg>
              </div>

              <h1 className='font-heading text-4xl font-medium text-cream mb-2'>
                Reset password.
              </h1>
              <p className='font-body text-sm text-cream/45 mb-8 leading-relaxed'>
                Enter the email linked to your account. We&apos;ll send a reset link.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
                <Input
                  label='Email Address'
                  type='email'
                  placeholder='hello@yourbusiness.com'
                  autoComplete='email'
                  error={errors.email?.message}
                  {...register('email')}
                />

                <Button
                  type='submit'
                  variant='gold'
                  fullWidth
                  loading={isSubmitting}
                  className='h-12'
                >
                  Send Reset Link
                  <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='ml-1'>
                    <path d='M5 12h14M12 5l7 7-7 7' />
                  </svg>
                </Button>
              </form>

              <div className='mt-8 text-center border-t border-cream/5 pt-7'>
                <Link
                  href='/login'
                  className='inline-flex items-center gap-2 font-body text-sm text-cream/40 hover:text-gold transition-colors'
                >
                  <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                    <path d='M19 12H5M12 19l-7-7 7-7' />
                  </svg>
                  Back to Sign In
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Success */}
        {sent && (
          <motion.div
            key='success'
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1   }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className='bg-shadow/50 backdrop-blur-xl border border-gold/10 rounded-[2rem] p-8 sm:p-10 shadow-card text-center'>
              <div className='relative w-20 h-20 mx-auto mb-8'>
                <div className='absolute inset-0 rounded-full border border-gold/15 animate-ping-slow' />
                <div className='relative w-full h-full rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center'>
                  <svg width='28' height='28' viewBox='0 0 24 24' fill='none' stroke='#D4A574' strokeWidth='1.5'>
                    <path d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                  </svg>
                </div>
              </div>

              <h2 className='font-heading text-3xl font-medium text-cream mb-3'>
                Check your inbox.
              </h2>
              <p className='font-body text-sm text-cream/50 mb-1'>
                Reset link sent to
              </p>
              <p className='font-body text-sm text-gold font-medium mb-5'>
                {sentTo}
              </p>
              <p className='font-body text-xs text-cream/30 max-w-xs mx-auto leading-relaxed'>
                The link expires in 1 hour. Check your spam folder if you don&apos;t see it.
              </p>

              <div className='mt-8 p-4 rounded-2xl bg-primary/40 border border-cream/5'>
                <p className='font-body text-xs text-cream/35'>
                  Wrong email?{' '}
                  <button onClick={() => setSent(false)} className='text-gold hover:underline'>
                    Try again
                  </button>
                </p>
              </div>

              <div className='mt-6'>
                <Link href='/login' className='font-body text-sm text-cream/35 hover:text-gold transition-colors'>
                  ← Back to Sign In
                </Link>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}