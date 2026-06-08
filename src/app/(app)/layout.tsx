'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppNavbar from '@/components/layout/AppNavbar'
import TrialBanner from '@/components/layout/TrialBanner'
import PastDueBanner from '@/components/layout/PastDueBanner'
import Spinner from '@/components/ui/Spinner'
import { useAuthStore } from '@/lib/store/authStore'
import { useSubscription } from '@/lib/hooks/useSubscription'
import { createClient } from '@/lib/supabase/client'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router    = useRouter()
  const user      = useAuthStore((s) => s.user)
  const isLoading = useAuthStore((s) => s.isLoading)

  const [portalLoading,  setPortalLoading]  = useState(false)
  // Escape hatch — if loading takes too long, stop waiting
  const [loadingTimedOut, setLoadingTimedOut] = useState(false)

  const {
    data:      subscription,
    isLoading: subLoading,
    isError:   subError,
  } = useSubscription(user?.id ?? null)

  // Timeout escape hatch — 6 seconds max
  useEffect(() => {
    const t = setTimeout(() => setLoadingTimedOut(true), 6000)
    return () => clearTimeout(t)
  }, [])

  // Route guard
  useEffect(() => {
    // Still loading auth — wait (but respect timeout)
    if (isLoading && !loadingTimedOut) return

    // No user after loading resolved → login
    if (!user) {
      router.replace('/login')
      return
    }

    // Still fetching subscription — wait (but respect timeout + error)
    if (subLoading && !loadingTimedOut && !subError) return

    const isSettings = window.location.pathname.startsWith('/settings')

    // No subscription and not on settings → pricing
    if (!subscription && !isSettings) {
      router.replace('/pricing')
      return
    }

    // Cancelled subscription → pricing
    if (subscription?.status === 'canceled' && !isSettings) {
      router.replace('/pricing')
    }
  }, [user, isLoading, subscription, subLoading, subError, loadingTimedOut, router])

  async function handleManageBilling() {
    setPortalLoading(true)
    try {
      const { data: sub } = await createClient()
        .from('subscriptions')
        .select('payment_customer_id')
        .eq('user_id', user!.id)
        .single()

      if (sub?.payment_customer_id) {
        window.location.href = `/api/dodo/customer-portal?customer_id=${sub.payment_customer_id}`
      }
    } catch {
      // silent
    } finally {
      setPortalLoading(false)
    }
  }

  // Show loading only while genuinely loading AND not timed out
  const showLoading = (isLoading || subLoading) && !loadingTimedOut

  if (showLoading) {
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

  if (!user) return null

  return (
    <div className='min-h-screen flex flex-col'>
      {subscription?.status === 'trialing' && user?.email && (
        <TrialBanner subscription={subscription} email={user.email} />
      )}

      {subscription?.status === 'past_due' && (
        <PastDueBanner
          onManageBilling={handleManageBilling}
          loading={portalLoading}
        />
      )}

      <AppNavbar />

      <main className='flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-10 py-8 sm:py-10'>
        {children}
      </main>
    </div>
  )
}