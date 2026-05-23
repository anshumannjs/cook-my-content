import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { fetchMusicMoods } from '@/lib/queries/music'

export function useMusicLibrary() {
  return useQuery({
    queryKey:  ['music-library'],
    queryFn:   () => fetchMusicMoods(createClient()),
    staleTime: Infinity,  // music moods never change at runtime
    retry:     2,
  })
}