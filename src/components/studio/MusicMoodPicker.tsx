'use client'

import { cn } from '@/lib/utils/cn'
import { useMusicLibrary } from '@/lib/hooks/useMusicLibrary'
import Spinner from '@/components/ui/Spinner'
import type { MusicMoodKey } from '@/lib/types'

const MOOD_ICONS: Record<MusicMoodKey, string> = {
  calm_minimal:                '🌿',
  energetic_bold_motivational: '⚡',
  soft_cinematic_emotional:    '🎬',
  trend_style_modern_vibe:     '✨',
  uplifting_happy:             '☀️',
  warm_acoustic_storytelling:  '🔥',
}

interface MusicMoodPickerProps {
  value:    string
  onChange: (mood: MusicMoodKey) => void
  error?:   string
}

export default function MusicMoodPicker({ value, onChange, error }: MusicMoodPickerProps) {
  const { data: moods, isLoading } = useMusicLibrary()

  if (isLoading) {
    return (
      <div className='flex items-center gap-2 py-4'>
        <Spinner size='sm' className='text-gold/40' />
        <span className='font-body text-xs text-cream/30'>Loading music moods…</span>
      </div>
    )
  }

  return (
    <div>
      <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
        {(moods ?? []).map((mood) => {
          const isSelected = value === mood.key
          return (
            <button
              key={mood.key}
              type='button'
              onClick={() => onChange(mood.key as MusicMoodKey)}
              className={cn(
                'relative flex items-center gap-3 px-4 py-3.5 rounded-2xl border text-left',
                'transition-all duration-200',
                isSelected
                  ? 'border-gold/40 bg-gold/10 shadow-gold-sm'
                  : 'border-cream/8 bg-cream/3 hover:border-cream/15 hover:bg-cream/5',
              )}
            >
              <span className='text-xl flex-shrink-0'>
                {MOOD_ICONS[mood.key as MusicMoodKey]}
              </span>
              <span className={cn(
                'font-body text-xs font-medium leading-tight transition-colors',
                isSelected ? 'text-gold' : 'text-cream/50',
              )}>
                {mood.label}
              </span>
              {isSelected && (
                <div className='absolute top-2 right-2 w-4 h-4 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center'>
                  <svg width='8' height='8' viewBox='0 0 24 24' fill='none' stroke='#D4A574' strokeWidth='3'>
                    <path d='M20 6L9 17l-5-5' strokeLinecap='round' />
                  </svg>
                </div>
              )}
            </button>
          )
        })}
      </div>
      {error && <p className='font-body text-xs text-red-400 mt-2 ml-1'>{error}</p>}
    </div>
  )
}