'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppNavbar from '@/components/layout/AppNavbar'
import Spinner from '@/components/ui/Spinner'
import { useAuthStore } from '@/lib/store/authStore'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router       = useRouter()
  const user         = useAuthStore((s) => s.user)
  const isLoading    = useAuthStore((s) => s.isLoading)
  const subscription = useAuthStore((s) => s.subscription)

  useEffect(() => {
    if (isLoading) return

    // No user → middleware should have caught this, but double-check
    if (!user) {
      router.replace('/login')
      return
    }

    // User exists but no active subscription → send to pricing
    // Allow settings page even without subscription
    if (
      !subscription &&
      typeof window !== 'undefined' &&
      !window.location.pathname.startsWith('/settings')
    ) {
      router.replace('/pricing')
    }
  }, [user, isLoading, subscription, router])

  // Loading state — shown briefly while auth resolves
  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='flex flex-col items-center gap-4'>
          <div className='w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center shadow-gold-md'>
            <svg width='16' height='16' viewBox='0 0 14 14' fill='none'>
              <path d='M3 2.5L11 7L3 11.5V2.5Z' fill='#0A0A0A' />
            </svg>
          </div>
          <Spinner size='md' className='text-gold/50' />
        </div>
      </div>
    )
  }

  // No user — returning null while redirect fires
  if (!user) return null

  return (
    <div className='min-h-screen flex flex-col'>
      <AppNavbar />
      <main className='flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-10 py-8 sm:py-10'>
        {children}
      </main>
    </div>
  )
}