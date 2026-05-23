import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { fetchLibrary } from '@/lib/queries/library'
import type { PlanType } from '@/lib/types'

export function useLibrary(
  email:      string | null | undefined,
  planFilter?: PlanType
) {
  return useQuery({
    queryKey:  ['library', email, planFilter],
    queryFn:   () => fetchLibrary(createClient(), email!, planFilter),
    enabled:   !!email,
    staleTime: 1000 * 60 * 3,  // 3 min
    retry:     2,
  })
}