'use client'

import { useEffect, useRef, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'sonner'
import Lenis from 'lenis'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import { fetchSubscription } from '@/lib/queries/shopify'

// ─── TanStack QueryClient singleton ─────────────────────────────────────────
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime:            60 * 1000,
        refetchOnWindowFocus: false,
        retry:                1,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined

function getQueryClient() {
  if (typeof window === 'undefined') return makeQueryClient()
  if (!browserQueryClient) browserQueryClient = makeQueryClient()
  return browserQueryClient
}

// ─── Auth listener — syncs Supabase session → Zustand ───────────────────────
function AuthListener() {
  const { setUser, setSubscription, setLoading, reset } = useAuthStore()
  const supabase = createClient()

  useEffect(() => {
    setLoading(true)

    // Initial session check
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        setUser({
          id:          user.id,
          email:       user.email!,
          displayName: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
          avatarUrl:   user.user_metadata?.avatar_url ?? null,
        })
        try {
          const sub = await fetchSubscription(supabase,user.id)  // ← user.id not user.email
          setSubscription(sub)
        } catch {
          setSubscription(null)
        }
      } else {
        reset()
      }
      setLoading(false)
    })

    // Live auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const user = session.user
          setUser({
            id:          user.id,
            email:       user.email!,
            displayName: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
            avatarUrl:   user.user_metadata?.avatar_url ?? null,
          })
          try {
            const sub = await fetchSubscription(supabase,user.id)  // ← user.id not user.email
            setSubscription(sub)
          } catch {
            setSubscription(null)
          }
          setLoading(false)
        }

        if (event === 'SIGNED_OUT') {
          reset()
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}

// ─── Lenis smooth scroll ─────────────────────────────────────────────────────
function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration:  1.2,
      easing:    (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => lenis.destroy()
  }, [])

  return null
}

// ─── Root Providers ──────────────────────────────────────────────────────────
export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <AuthListener />
      <SmoothScroll />

      {children}

      <Toaster
        position='top-right'
        toastOptions={{
          style: {
            background:   '#1C1612',
            border:       '1px solid rgba(212,165,116,0.15)',
            color:        '#F5F0E8',
            fontFamily:   'Inter, sans-serif',
            fontSize:     '0.875rem',
            borderRadius: '0.875rem',
          },
          classNames: {
            success: 'border-emerald-800/50',
            error:   'border-red-800/50',
          },
        }}
      />

      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}