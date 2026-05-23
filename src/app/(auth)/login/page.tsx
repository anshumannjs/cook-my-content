'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { cn } from '@/lib/utils/cn'

const OTP_LENGTH = 8
const RESEND_COOLDOWN = 60

// ─── OTP digit input ──────────────────────────────────────────────────────────
function OTPInput({
  value,
  onChange,
  disabled,
}: {
  value:    string[]
  onChange: (v: string[]) => void
  disabled?: boolean
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    const digit = e.target.value.replace(/\D/g, '').slice(-1)
    const next  = [...value]
    next[i]     = digit
    onChange(next)
    if (digit && i < OTP_LENGTH - 1) refs.current[i + 1]?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, i: number) => {
    if (e.key === 'Backspace') {
      if (value[i]) {
        const next = [...value]
        next[i] = ''
        onChange(next)
      } else if (i > 0) {
        refs.current[i - 1]?.focus()
      }
    }
    if (e.key === 'ArrowLeft'  && i > 0)              refs.current[i - 1]?.focus()
    if (e.key === 'ArrowRight' && i < OTP_LENGTH - 1) refs.current[i + 1]?.focus()
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    const next   = Array(OTP_LENGTH).fill('')
    pasted.split('').forEach((c, i) => { next[i] = c })
    onChange(next)
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1)
    refs.current[focusIdx]?.focus()
  }

  return (
    <div className='flex gap-2 justify-center'>
      {Array.from({ length: OTP_LENGTH }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el }}
          type='text'
          inputMode='numeric'
          maxLength={1}
          value={value[i] ?? ''}
          disabled={disabled}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className={cn(
            'w-10 h-12 sm:w-12 sm:h-14 text-center rounded-xl border',
            'font-body text-lg font-semibold text-cream',
            'bg-cream/5 transition-all duration-200',
            'focus:outline-none focus:scale-105',
            value[i]
              ? 'border-gold/50 bg-gold/8 text-gold shadow-gold-sm'
              : 'border-cream/12 focus:border-gold/40 focus:bg-cream/8',
            disabled && 'opacity-40 cursor-not-allowed',
          )}
        />
      ))}
    </div>
  )
}

// ─── Resend countdown ─────────────────────────────────────────────────────────
function ResendButton({
  onResend,
  loading,
}: {
  onResend: () => void
  loading:  boolean
}) {
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN)

  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  if (countdown > 0) {
    return (
      <p className='font-body text-xs text-cream/30 text-center'>
        Resend code in{' '}
        <span className='text-cream/50 tabular-nums'>{countdown}s</span>
      </p>
    )
  }

  return (
    <button
      type='button'
      onClick={() => { onResend(); setCountdown(RESEND_COOLDOWN) }}
      disabled={loading}
      className='font-body text-xs text-gold/60 hover:text-gold transition-colors text-center w-full'
    >
      {loading ? 'Sending…' : "Didn't receive it? Resend code"}
    </button>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const [email,        setEmail]        = useState('')
  const [emailError,   setEmailError]   = useState('')
  const [otpDigits,    setOtpDigits]    = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const [step,         setStep]         = useState<'email' | 'otp'>('email')
  const [sending,      setSending]      = useState(false)
  const [verifying,    setVerifying]    = useState(false)
  const [googleLoading,setGoogleLoading]= useState(false)

  const otpValue = otpDigits.join('')
  const otpReady = otpValue.length === OTP_LENGTH

  // ── Send OTP ───────────────────────────────────────────────────────────────
async function sendOTP(emailAddr: string) {
  if (!emailAddr || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddr)) {
    setEmailError('Please enter a valid email address')
    return
  }
  setEmailError('')
  setSending(true)
  const supabase = createClient()
  const { error } = await supabase.auth.signInWithOtp({
    email:   emailAddr,
    options: { shouldCreateUser: false },
  })
  setSending(false)

  if (error) {
    // Account doesn't exist — guide them to signup
    if (error.code === 'otp_disabled' || error.message?.includes('Signups not allowed')) {
      toast.error("No account found with this email. Try signing up instead.")
      return
    }
    toast.error(error.message)
    return
  }

  setStep('otp')
}

  // ── Verify OTP ─────────────────────────────────────────────────────────────
  async function verifyOTP() {
    if (!otpReady) return
    setVerifying(true)
    const supabase = createClient()
    const { error } = await supabase.auth.verifyOtp({
      email: email,
      token: otpValue,
      type:  'email',
    })
    setVerifying(false)
    if (error) {
      toast.error('Invalid or expired code. Please try again.')
      setOtpDigits(Array(OTP_LENGTH).fill(''))
      return
    }
    // Auth listener in Providers will handle redirect
  }

  // Auto-verify when all digits filled
  useEffect(() => {
    if (otpReady && step === 'otp') verifyOTP()
  }, [otpReady]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Google OAuth ───────────────────────────────────────────────────────────
  async function signInWithGoogle() {
    setGoogleLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options:  { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) { toast.error(error.message); setGoogleLoading(false) }
  }

  return (
    <div className='w-full max-w-[480px]'>
      <AnimatePresence mode='wait'>

        {/* ── Step 1: Email ──────────────────────────────────────────────── */}
        {step === 'email' && (
          <motion.div
            key='email'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0  }}
            exit={{ opacity: 0,   y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className='bg-shadow/50 backdrop-blur-xl border border-gold/10 rounded-[2rem] p-8 sm:p-10 shadow-card'>
              <div className='mb-8'>
                <h1 className='font-heading text-4xl font-medium text-cream'>
                  Welcome back.
                </h1>
                <p className='font-body text-sm text-cream/45 mt-2'>
                  Sign in to your kitchen.
                </p>
              </div>

              {/* Google */}
              <Button
                variant='outline'
                fullWidth
                loading={googleLoading}
                onClick={signInWithGoogle}
                className='gap-3 h-12 mb-6'
              >
                <svg width='18' height='18' viewBox='0 0 24 24'>
                  <path fill='#4285F4' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/>
                  <path fill='#34A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'/>
                  <path fill='#FBBC05' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'/>
                  <path fill='#EA4335' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'/>
                </svg>
                Continue with Google
              </Button>

              <div className='flex items-center gap-4 mb-6'>
                <div className='flex-1 h-px bg-cream/8' />
                <span className='font-body text-xs text-cream/25'>or use a one-time code</span>
                <div className='flex-1 h-px bg-cream/8' />
              </div>

              <div className='space-y-5'>
                <Input
                  label='Email Address'
                  type='email'
                  placeholder='hello@yourbusiness.com'
                  autoComplete='email'
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError('') }}
                  onKeyDown={(e) => e.key === 'Enter' && sendOTP(email)}
                  error={emailError}
                />
                <Button
                  variant='gold'
                  fullWidth
                  loading={sending}
                  onClick={() => sendOTP(email)}
                  className='h-12'
                >
                  Send Code
                  <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='ml-1'>
                    <path d='M5 12h14M12 5l7 7-7 7'/>
                  </svg>
                </Button>
              </div>

              <p className='font-body text-sm text-cream/35 text-center mt-8'>
                Don&apos;t have an account?{' '}
                <Link href='/signup' className='text-gold hover:text-gold-200 transition-colors'>
                  Get started
                </Link>
              </p>
            </div>
          </motion.div>
        )}

        {/* ── Step 2: OTP ────────────────────────────────────────────────── */}
        {step === 'otp' && (
          <motion.div
            key='otp'
            initial={{ opacity: 0, x: 30  }}
            animate={{ opacity: 1, x: 0   }}
            exit={{ opacity: 0,   x: -30  }}
            transition={{ duration: 0.3 }}
          >
            <div className='bg-shadow/50 backdrop-blur-xl border border-gold/10 rounded-[2rem] p-8 sm:p-10 shadow-card'>

              {/* Back button */}
              <button
                onClick={() => { setStep('email'); setOtpDigits(Array(OTP_LENGTH).fill('')) }}
                className='flex items-center gap-2 text-cream/35 hover:text-cream/60 transition-colors mb-8 font-body text-sm'
              >
                <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                  <path d='M19 12H5M12 19l-7-7 7-7'/>
                </svg>
                Back
              </button>

              {/* Header */}
              <div className='text-center mb-8'>
                <div className='w-14 h-14 rounded-2xl bg-gold/8 border border-gold/20 flex items-center justify-center mx-auto mb-5'>
                  <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#D4A574' strokeWidth='1.5'>
                    <path d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'/>
                  </svg>
                </div>
                <h2 className='font-heading text-3xl font-medium text-cream mb-2'>
                  Check your inbox.
                </h2>
                <p className='font-body text-sm text-cream/45 leading-relaxed'>
                  We sent an 8-digit code to
                </p>
                <p className='font-body text-sm text-gold mt-1 font-medium'>
                  {email}
                </p>
              </div>

              {/* OTP input */}
              <div className='mb-6'>
                <OTPInput
                  value={otpDigits}
                  onChange={setOtpDigits}
                  disabled={verifying}
                />
              </div>

              {/* Verify button — shown when not auto-verifying */}
              <Button
                variant='gold'
                fullWidth
                loading={verifying}
                disabled={!otpReady || verifying}
                onClick={verifyOTP}
                className='h-12 mb-6'
              >
                {verifying ? 'Verifying…' : 'Verify Code'}
              </Button>

              {/* Resend */}
              <ResendButton
                onResend={() => sendOTP(email)}
                loading={sending}
              />

              <p className='font-body text-xs text-cream/20 text-center mt-5'>
                Code expires in 10 minutes. Check spam if you don&apos;t see it.
              </p>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}