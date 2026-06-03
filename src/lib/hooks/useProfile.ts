import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { fetchProfile, updateProfile } from '@/lib/queries/profile'
import { toast } from 'sonner'
import type { Profile } from '@/lib/types'

export function useProfile(userId: string | null | undefined) {
  return useQuery({
    queryKey:  ['profile', userId],
    queryFn:   () => fetchProfile(createClient(), userId!),
    enabled:   !!userId,
    staleTime: 1000 * 60 * 10,
  })
}

export function useUpdateProfile(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (updates: Partial<Omit<Profile, 'id' | 'email'>>) =>
      updateProfile(createClient(), userId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] })
      toast.success('Profile updated')
    },
    onError: (err: Error) => toast.error(err.message),
  })
}