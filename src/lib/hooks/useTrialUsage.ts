import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { TrialUsage } from '@/lib/types'

const DAILY_TRIAL_LIMIT = 3

async function fetchTodaySubmissions(email: string): Promise<TrialUsage> {
  const client     = createClient()
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const [classic, premium] = await Promise.all([
    client
      .from('TALLY BMC CLASSIC')
      .select('id', { count: 'exact', head: true })
      .eq('email', email)
      .gte('created_at', todayStart.toISOString()),
    client
      .from('TALLY BMC PREMIUM')
      .select('id', { count: 'exact', head: true })
      .eq('email', email)
      .gte('created_at', todayStart.toISOString()),
  ])

  const todayCount = (classic.count ?? 0) + (premium.count ?? 0)

  return {
    todayCount,
    dailyLimit:  DAILY_TRIAL_LIMIT,
    remaining:   Math.max(0, DAILY_TRIAL_LIMIT - todayCount),
    isBlocked:   todayCount >= DAILY_TRIAL_LIMIT,
  }
}

export function useTrialUsage(
  email:      string | null | undefined,
  isTrialing: boolean
) {
  return useQuery({
    queryKey:        ['trial-usage', email],
    queryFn:         () => fetchTodaySubmissions(email!),
    enabled:         !!email && isTrialing,
    staleTime:       1000 * 30,
    refetchInterval: isTrialing ? 1000 * 30 : false,
  })
}