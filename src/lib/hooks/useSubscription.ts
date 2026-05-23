import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { fetchSubscription } from '@/lib/queries/shopify'

export function useSubscription(email: string | null | undefined) {
  return useQuery({
    queryKey:  ['subscription', email],
    queryFn:   () => fetchSubscription(createClient(), email!),
    enabled:   !!email,
    staleTime: 1000 * 60 * 10,  // 10 min — plan doesn't change often
    retry:     2,
  })
}