import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { fetchSubscription } from '@/lib/queries/shopify'

export function useSubscription(userId: string | null | undefined) {
  console.log({userId})
  return useQuery({
    queryKey:  ['subscription', userId],
    // queryFn:   () => fetchSubscription(createClient(), userId!),
    queryFn:   () => fetchSubscription(userId!),
    enabled:   !!userId,
    staleTime: 1000 * 60 * 5,
    retry:     2,
  })
}