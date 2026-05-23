import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/supabase'
import type { MusicMoodOption, MusicMoodKey } from '@/lib/types'

type Client = SupabaseClient<Database>

// Human-readable labels for each mood key
const MOOD_LABELS: Record<MusicMoodKey, string> = {
  calm_minimal:                 'Calm & Minimal',
  energetic_bold_motivational:  'Energetic & Bold',
  soft_cinematic_emotional:     'Soft & Cinematic',
  trend_style_modern_vibe:      'Trendy & Modern',
  uplifting_happy:              'Uplifting & Happy',
  warm_acoustic_storytelling:   'Warm & Acoustic',
}

export async function fetchMusicMoods(client: Client): Promise<MusicMoodOption[]> {
  const { data, error } = await client
    .from('music_library')
    .select('*')
    .limit(1)
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!data)  return []

  const keys: MusicMoodKey[] = [
    'calm_minimal',
    'energetic_bold_motivational',
    'soft_cinematic_emotional',
    'trend_style_modern_vibe',
    'uplifting_happy',
    'warm_acoustic_storytelling',
  ]

  return keys.map((key) => ({
    key,
    label: MOOD_LABELS[key],
    url:   data[key] ?? null,
  }))
}