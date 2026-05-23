import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthUser, UserSubscription } from '@/lib/types'

interface AuthState {
  user:            AuthUser | null
  subscription:    UserSubscription | null
  isLoading:       boolean
  setUser:         (user: AuthUser | null) => void
  setSubscription: (sub: UserSubscription | null) => void
  setLoading:      (v: boolean) => void
  reset:           () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user:         null,
      subscription: null,
      isLoading:    true,

      setUser: (user) => set({ user }),

      setSubscription: (subscription) => set({ subscription }),

      setLoading: (isLoading) => set({ isLoading }),

      reset: () => set({
        user:         null,
        subscription: null,
        isLoading:    false,
      }),
    }),
    {
      name: 'cmc-auth',
      // Only persist user — subscription is always re-fetched fresh on mount
      partialize: (state) => ({ user: state.user }),
    }
  )
)

// ─── Selectors ──────────────────────────────────────────────────────────────
export const selectUser         = (s: AuthState) => s.user
export const selectSubscription = (s: AuthState) => s.subscription
export const selectPlan         = (s: AuthState) => s.subscription?.plan ?? null
export const selectIsLoading    = (s: AuthState) => s.isLoading
export const selectIsAuthed     = (s: AuthState) => !!s.user