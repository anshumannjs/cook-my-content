'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const schema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, {
  message: 'Passwords do not match',
  path:    ['confirm'],
})
type FormData = z.infer<typeof schema>

export default function ResetPasswordPage() {
  const [done,         setDone]         = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const passwordValue = watch('password', '')

  // Password strength indicator
  const strength = (() => {
    if (!passwordValue) return 0
    let score = 0
    if (passwordValue.length >= 8)      score++
    if (/[A-Z]/.test(passwordValue))    score++
    if (/[0-9]/.test(passwordValue))    score++
    if (/[^A-Za-z0-9]/.test(passwordValue)) score++
    return score
  })()

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength]
  const strengthColor = ['', 'bg-red-500', 'bg-amber-400', 'bg-gold', 'bg-emerald-400'][strength]

  async function onSubmit({ password }: FormData) {
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      toast.error(error.message)
      return
    }

    setDone(true)
    setTimeout(() => router.replace('/studio'), 2500)
  }

  return (
    <div className='w-full max-w-[460px]'>
      <AnimatePresence mode='wait'>

        {!done && (
          <motion.div
            key='form'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0  }}
            exit={{ opacity: 0,   y: -20 }}
            transition={{ duration: 0.35 }}
          >
            <div className='bg-shadow/50 backdrop-blur-xl border border-gold/10 rounded-[2rem] p-8 sm:p-10 shadow-card'>

              <div className='w-14 h-14 rounded-2xl bg-gold/8 border border-gold/20 flex items-center justify-center mb-7'>
                <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#D4A574' strokeWidth='1.5'>
                  <rect x='3' y='11' width='18' height='11' rx='2' ry='2' />
                  <path d='M7 11V7a5 5 0 0110 0v4' />
                </svg>
              </div>

              <h1 className='font-heading text-4xl font-medium text-cream mb-2'>
                New password.
              </h1>
              <p className='font-body text-sm text-cream/45 mb-8'>
                Choose a strong password for your account.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>

                {/* Password field */}
                <Input
                  label='New Password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Min. 8 characters'
                  autoComplete='new-password'
                  error={errors.password?.message}
                  rightIcon={
                    <button
                      type='button'
                      onClick={() => setShowPassword((v) => !v)}
                      className='text-cream/30 hover:text-cream/60 transition-colors'
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5'>
                          <path d='M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22' />
                        </svg>
                      ) : (
                        <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5'>
                          <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' /><circle cx='12' cy='12' r='3' />
                        </svg>
                      )}
                    </button>
                  }
                  {...register('password')}
                />

                {/* Strength indicator */}
                {passwordValue && (
                  <div className='space-y-1.5'>
                    <div className='flex gap-1'>
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                            i <= strength ? strengthColor : 'bg-cream/10'
                          }`}
                        />
                      ))}
                    </div>
                    <p className='font-body text-xs text-cream/35'>{strengthLabel}</p>
                  </div>
                )}

                <Input
                  label='Confirm Password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Repeat your password'
                  autoComplete='new-password'
                  error={errors.confirm?.message}
                  {...register('confirm')}
                />

                <Button
                  type='submit'
                  variant='gold'
                  fullWidth
                  loading={isSubmitting}
                  className='h-12'
                >
                  Update Password
                </Button>
              </form>
            </div>
          </motion.div>
        )}

        {/* Success */}
        {done && (
          <motion.div
            key='done'
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1   }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className='bg-shadow/50 backdrop-blur-xl border border-gold/10 rounded-[2rem] p-8 sm:p-10 shadow-card text-center'>
              <div className='w-20 h-20 mx-auto mb-8 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center'>
                <svg width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='#D4A574' strokeWidth='1.5'>
                  <path d='M20 6L9 17l-5-5' strokeLinecap='round' strokeLinejoin='round' />
                </svg>
              </div>

              <h2 className='font-heading text-3xl font-medium text-cream mb-3'>
                Password updated.
              </h2>
              <p className='font-body text-sm text-cream/45'>
                Redirecting you to the studio…
              </p>

              <div className='mt-6'>
                <div className='w-48 mx-auto h-0.5 bg-cream/5 rounded-full overflow-hidden'>
                  <motion.div
                    className='h-full bg-gold'
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2.5, ease: 'linear' }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}