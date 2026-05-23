import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { fetchUsageLimits } from '@/lib/queries/library'
import type { PlanType } from '@/lib/types'

export function useUsageLimits(
  email: string | null | undefined,
  plan:  PlanType | null | undefined
) {
  return useQuery({
    queryKey:  ['usage-limits', email, plan],
    queryFn:   () => fetchUsageLimits(createClient(), email!, plan!),
    enabled:   !!email && !!plan,
    staleTime: 1000 * 60 * 2,  // 2 min — refresh fairly often
    retry:     2,
  })
}