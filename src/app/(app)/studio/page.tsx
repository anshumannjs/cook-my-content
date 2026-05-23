'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import { useStudioStore } from '@/lib/store/studioStore'
import { useSubscription } from '@/lib/hooks/useSubscription'
import { useUsageLimits } from '@/lib/hooks/useUsageLimits'
import { useSubmitReel } from '@/lib/hooks/useSubmitReel'
import PlanToggle     from '@/components/studio/PlanToggle'
import UploadZone     from '@/components/studio/UploadZone'
import MusicMoodPicker from '@/components/studio/MusicMoodPicker'
import SuccessState   from '@/components/studio/SuccessState'
import Button         from '@/components/ui/Button'
import Input, { Textarea } from '@/components/ui/Input'
import Spinner        from '@/components/ui/Spinner'
import Badge          from '@/components/ui/Badge'
import { cn }         from '@/lib/utils/cn'

// ─── Form Schema ─────────────────────────────────────────────────────────────
const baseSchema = z.object({
  name:                z.string().min(2, 'Name is required'),
  phone_number:        z.string().optional(),
  business_name:       z.string().min(2, 'Business name is required'),
  business_type_niche: z.string().min(2, 'Describe your niche (e.g. "Luxury skincare brand")'),
  content_type:        z.string().min(1, 'Select a content type'),
  content_style:       z.string().min(1, 'Select a content style'),
  caption_type:        z.string().min(1, 'Select a caption type'),
  platform:            z.string().min(1, 'Select a platform'),
  music_mood:          z.string().min(1, 'Select a music mood'),
  story_context:       z.string().optional(),
  // Premium fields — optional at schema level, validated conditionally
  emotion_in_2_sec:    z.string().optional(),
  reel_feeling:        z.string().optional(),
  visual_world:        z.string().optional(),
})

type FormValues = z.infer<typeof baseSchema>

// ─── Select options ───────────────────────────────────────────────────────────
const CONTENT_TYPES = [
  'Product Showcase', 'Behind the Scenes', 'Brand Story',
  'Promotion / Sale', 'Educational / Tips', 'Lifestyle / Aesthetic',
  'Testimonial / Review',
]

const CONTENT_STYLES = [
  'Minimal & Clean', 'Bold & Vibrant', 'Cinematic & Moody',
  'Luxury & Elegant', 'Fun & Playful', 'Documentary Style',
]

const CAPTION_TYPES = [
  'Hook-Body-CTA', 'Question Hook', 'Story-Driven',
  'Fact-Based', 'Emotional Appeal',
]

const PLATFORMS = [
  'Instagram', 'TikTok', 'YouTube Shorts', 'Facebook', 'LinkedIn',
]

const EMOTIONS = [
  'Excited', 'Inspired', 'Curious', 'Moved / Emotional',
  'Confident', 'Luxurious', 'Playful',
]

const REEL_FEELINGS = [
  'Energetic & Fast-Paced', 'Calm & Reflective', 'Dramatic & Intense',
  'Warm & Inviting', 'Bold & Powerful',
]

const VISUAL_WORLDS = [
  'Golden Hour Warmth', 'Cool Urban Edge', 'Dark & Moody Cinema',
  'Bright & Airy', 'Rich Earth Tones', 'Neon & Electric',
]

// ─── Reusable native select wrapper ──────────────────────────────────────────
function SelectField({
  label, error, options, placeholder = 'Select…', value, onChange,
}: {
  label:       string
  error?:      string
  options:     string[]
  placeholder?: string
  value:       string
  onChange:    (v: string) => void
}) {
  return (
    <div className='flex flex-col gap-1.5'>
      <label className='text-xs font-medium text-cream/60 font-body ml-0.5'>{label}</label>
      <div className='relative'>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'input-base appearance-none pr-10 cursor-pointer',
            error && 'border-red-700/60',
          )}
        >
          <option value='' disabled>{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o} className='bg-[#1C1612] text-cream'>{o}</option>
          ))}
        </select>
        <div className='absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none'>
          <svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(245,240,232,0.3)' strokeWidth='2'>
            <path d='M6 9l6 6 6-6' />
          </svg>
        </div>
      </div>
      {error && <p className='text-xs text-red-400 font-body ml-0.5'>{error}</p>}
    </div>
  )
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-3'>
        <p className='font-body text-xs text-cream/30 uppercase tracking-widest whitespace-nowrap'>{title}</p>
        <div className='flex-1 h-px bg-cream/5' />
      </div>
      {children}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function StudioPage() {
  const user         = useAuthStore((s) => s.user)
  const subscription = useAuthStore((s) => s.subscription)

  const activePlan    = useStudioStore((s) => s.activePlan)
  const uploadedFiles = useStudioStore((s) => s.uploadedFiles)
  const logoFile      = useStudioStore((s) => s.logoFile)
  const setLogoFile   = useStudioStore((s) => s.setLogoFile)
  const submitSuccess = useStudioStore((s) => s.submitSuccess)

  const { data: sub }    = useSubscription(user?.email)
  const { data: limits } = useUsageLimits(user?.email, activePlan)
  const submitReel       = useSubmitReel()

  const isPremium = activePlan === 'premium'

  // ── Form setup ────────────────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      name:                user?.displayName ?? '',
      phone_number:        sub?.phoneNumber   ?? '',
      business_name:       '',
      business_type_niche: '',
      content_type:        '',
      content_style:       '',
      caption_type:        '',
      platform:            '',
      music_mood:          '',
      story_context:       '',
      emotion_in_2_sec:    '',
      reel_feeling:        '',
      visual_world:        '',
    },
  })

  // Pre-fill business info from Supabase user_metadata
  useEffect(() => {
    const loadMetadata = async () => {
      const supabase = createClient()
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u?.user_metadata) return
      const meta = u.user_metadata
      if (meta.business_name)       setValue('business_name',       meta.business_name)
      if (meta.business_type_niche) setValue('business_type_niche', meta.business_type_niche)
      if (meta.phone_number)        setValue('phone_number',        meta.phone_number)
    }
    loadMetadata()
  }, [setValue])

  // ── Submit handler ────────────────────────────────────────────────────────
  async function onSubmit(values: FormValues) {
    if (uploadedFiles.length === 0) {
      toast.error('Please upload at least one photo')
      return
    }

    if (isPremium && uploadedFiles.length < 4) {
      toast.error('Premium plan requires 4 photos')
      return
    }

    // Premium field validation
    if (isPremium) {
      if (!values.emotion_in_2_sec) { toast.error('Select opening emotion'); return }
      if (!values.reel_feeling)     { toast.error('Select reel feeling');     return }
      if (!values.visual_world)     { toast.error('Select visual world');     return }
    }

    if (limits?.isBlocked) {
      toast.error('You\'ve reached your submission limit for this cycle. Try again next cycle.')
      return
    }

    // Save business info to user_metadata for future pre-fills
    try {
      const supabase = createClient()
      await supabase.auth.updateUser({
        data: {
          business_name:       values.business_name,
          business_type_niche: values.business_type_niche,
          phone_number:        values.phone_number,
        },
      })
    } catch { /* non-critical, ignore */ }

    await submitReel.mutateAsync({
      plan:            activePlan,
      email:           user!.email,
      name:            values.name,
      phoneNumber:     values.phone_number ?? null,
      businessName:    values.business_name,
      businessNiche:   values.business_type_niche,
      contentType:     values.content_type,
      contentStyle:    values.content_style,
      captionType:     values.caption_type,
      platform:        values.platform,
      musicMood:       values.music_mood,
      storyContext:    values.story_context ?? null,
      photos:          uploadedFiles,
      logoFile:        logoFile,
      emotionIn2Sec:   values.emotion_in_2_sec,
      reelFeeling:     values.reel_feeling,
      visualWorld:     values.visual_world,
    })
  }

  // ── Show success state ────────────────────────────────────────────────────
  if (submitSuccess) {
    return <SuccessState />
  }

  // ── Blocked state ─────────────────────────────────────────────────────────
  const isBlocked = limits?.isBlocked

  return (
    <div className='max-w-3xl mx-auto'>

      {/* Page header */}
      <div className='mb-8'>
        <h1 className='font-heading text-4xl font-medium text-cream'>
          The Kitchen
        </h1>
        <p className='font-body text-sm text-cream/40 mt-1'>
          Upload your photo. Celestiva handles the rest.
        </p>
      </div>

      {/* Plan toggle */}
      <div className='mb-6'>
        <PlanToggle subscription={subscription} />
      </div>

      {/* Usage indicator */}
      {limits && (
        <div className={cn(
          'flex items-center justify-between px-5 py-3.5 rounded-2xl border mb-6',
          isBlocked
            ? 'border-red-800/40 bg-red-950/20'
            : 'border-cream/8 bg-cream/3',
        )}>
          <div className='flex items-center gap-3'>
            <div className='flex gap-1'>
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'w-2 h-2 rounded-full',
                    i < (limits.submissionsUsed ?? 0)
                      ? isBlocked ? 'bg-red-500' : 'bg-gold'
                      : 'bg-cream/10',
                  )}
                />
              ))}
            </div>
            <span className='font-body text-xs text-cream/40'>
              {limits.submissionsUsed ?? 0}/10 reels used this cycle
            </span>
          </div>
          {isBlocked ? (
            <Badge variant='failed' dot>
              Limit reached
            </Badge>
          ) : (
            <Badge variant='gold' dot>
              {10 - (limits.submissionsUsed ?? 0)} remaining
            </Badge>
          )}
        </div>
      )}

      {/* Blocked banner */}
      <AnimatePresence>
        {isBlocked && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className='mb-6 p-5 rounded-2xl border border-red-800/40 bg-red-950/20'
          >
            <p className='font-body text-sm text-red-400 font-medium mb-1'>
              Submission limit reached for this cycle
            </p>
            <p className='font-body text-xs text-red-400/60'>
              Your next cycle starts{' '}
              {limits?.nextCycle
                ? new Date(limits.nextCycle).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
                : 'soon'
              }. Come back then to cook your next reel.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main form */}
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-10'>

        {/* ── Upload ────────────────────────────────────────────────────── */}
        <div className='bg-shadow/50 border border-gold/8 rounded-3xl p-6 sm:p-8 space-y-2'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='font-heading text-xl text-cream'>
              {isPremium ? 'Your Photos (4)' : 'Your Photo'}
            </h2>
            <Badge variant={isPremium ? 'premium' : 'classic'}>
              {isPremium ? 'Premium' : 'Classic'}
            </Badge>
          </div>
          <UploadZone />
        </div>

        {/* ── Form fields ───────────────────────────────────────────────── */}
        <div className='bg-shadow/50 border border-gold/8 rounded-3xl p-6 sm:p-8 space-y-8'>

          {/* Business Info */}
          <FormSection title='About You'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <Input
                label='Your Name'
                placeholder='Jane Smith'
                autoComplete='name'
                error={errors.name?.message}
                {...register('name')}
              />
              <Input
                label='Phone Number (optional)'
                placeholder='+1 234 567 8900'
                type='tel'
                autoComplete='tel'
                {...register('phone_number')}
              />
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <Input
                label='Business Name'
                placeholder='Bloom Skincare'
                error={errors.business_name?.message}
                {...register('business_name')}
              />
              <Input
                label='Business Niche'
                placeholder='Luxury skincare for women 25–45'
                error={errors.business_type_niche?.message}
                {...register('business_type_niche')}
              />
            </div>
          </FormSection>

          {/* Content Settings */}
          <FormSection title='Content Settings'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <Controller
                name='content_type'
                control={control}
                render={({ field }) => (
                  <SelectField
                    label='Content Type'
                    options={CONTENT_TYPES}
                    error={errors.content_type?.message}
                    {...field}
                  />
                )}
              />
              <Controller
                name='content_style'
                control={control}
                render={({ field }) => (
                  <SelectField
                    label='Content Style'
                    options={CONTENT_STYLES}
                    error={errors.content_style?.message}
                    {...field}
                  />
                )}
              />
              <Controller
                name='caption_type'
                control={control}
                render={({ field }) => (
                  <SelectField
                    label='Caption Type'
                    options={CAPTION_TYPES}
                    error={errors.caption_type?.message}
                    {...field}
                  />
                )}
              />
              <Controller
                name='platform'
                control={control}
                render={({ field }) => (
                  <SelectField
                    label='Platform'
                    options={PLATFORMS}
                    error={errors.platform?.message}
                    {...field}
                  />
                )}
              />
            </div>
          </FormSection>

          {/* Music Mood */}
          <FormSection title='Music Mood'>
            <Controller
              name='music_mood'
              control={control}
              render={({ field }) => (
                <MusicMoodPicker
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.music_mood?.message}
                />
              )}
            />
          </FormSection>

          {/* Premium-only fields */}
          <AnimatePresence>
            {isPremium && (
              <motion.div
                key='premium-fields'
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className='overflow-hidden'
              >
                <FormSection title='Cinematic Direction (Premium)'>
                  <div className='p-4 rounded-2xl bg-amber-950/20 border border-amber-800/25 mb-4'>
                    <p className='font-body text-xs text-amber-400/70 leading-relaxed'>
                      These fields guide Celestiva&apos;s cinematic storytelling across all 4 photos. Be specific — the more detail, the more personal your reel.
                    </p>
                  </div>
                  <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                    <Controller
                      name='emotion_in_2_sec'
                      control={control}
                      render={({ field }) => (
                        <SelectField
                          label='Opening Emotion'
                          placeholder='Viewer feels…'
                          options={EMOTIONS}
                          error={errors.emotion_in_2_sec?.message}
                          {...field}
                        />
                      )}
                    />
                    <Controller
                      name='reel_feeling'
                      control={control}
                      render={({ field }) => (
                        <SelectField
                          label='Overall Reel Feeling'
                          placeholder='Reel feels…'
                          options={REEL_FEELINGS}
                          error={errors.reel_feeling?.message}
                          {...field}
                        />
                      )}
                    />
                    <Controller
                      name='visual_world'
                      control={control}
                      render={({ field }) => (
                        <SelectField
                          label='Visual World'
                          placeholder='Visual aesthetic…'
                          options={VISUAL_WORLDS}
                          error={errors.visual_world?.message}
                          {...field}
                        />
                      )}
                    />
                  </div>
                </FormSection>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Optional extras */}
          <FormSection title='Optional'>
            <Textarea
              label='Story Context'
              placeholder='Any context that helps Celestiva tell your story better — product launch, seasonal campaign, specific message…'
              rows={3}
              {...register('story_context')}
            />

            {/* Logo upload */}
            <div>
              <label className='text-xs font-medium text-cream/60 font-body ml-0.5 block mb-1.5'>
                Brand Logo (optional)
              </label>
              {logoFile ? (
                <div className='flex items-center gap-3 p-3 rounded-xl border border-gold/15 bg-gold/5'>
                  <img
                    src={URL.createObjectURL(logoFile)}
                    alt='Logo'
                    className='w-10 h-10 object-contain rounded-lg bg-black/20'
                  />
                  <div className='flex-1 min-w-0'>
                    <p className='font-body text-xs text-cream/60 truncate'>{logoFile.name}</p>
                    <p className='font-body text-xs text-cream/25 mt-0.5'>
                      {(logoFile.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                  <button
                    type='button'
                    onClick={() => setLogoFile(null)}
                    className='text-cream/30 hover:text-red-400 transition-colors p-1'
                  >
                    <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                      <path d='M18 6L6 18M6 6l12 12' />
                    </svg>
                  </button>
                </div>
              ) : (
                <label className='flex items-center gap-3 px-4 py-3 rounded-xl border border-cream/8 bg-cream/3 cursor-pointer hover:border-gold/20 hover:bg-cream/5 transition-all duration-200 w-fit'>
                  <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(212,165,116,0.4)' strokeWidth='1.5'>
                    <path d='M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4' /><polyline points='17 8 12 3 7 8' /><line x1='12' y1='3' x2='12' y2='15' />
                  </svg>
                  <span className='font-body text-xs text-cream/35'>Upload logo</span>
                  <input
                    type='file'
                    className='sr-only'
                    accept='image/*'
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) setLogoFile(file)
                    }}
                  />
                </label>
              )}
            </div>
          </FormSection>
        </div>

        {/* Submit */}
        <div className='pb-4'>
          <Button
            type='submit'
            variant='gold'
            fullWidth
            size='xl'
            loading={submitReel.isPending}
            disabled={isBlocked || submitReel.isPending}
            className='shadow-gold-md hover:shadow-gold-lg'
          >
            {submitReel.isPending ? (
              <>
                <Spinner size='sm' className='text-primary mr-2' />
                Uploading & Submitting…
              </>
            ) : (
              <>
                Start Cooking
                <svg width='18' height='18' viewBox='0 0 14 14' fill='currentColor' className='ml-2'>
                  <path d='M3 2.5L11 7L3 11.5V2.5Z' />
                </svg>
              </>
            )}
          </Button>
          <p className='font-body text-xs text-cream/20 text-center mt-3'>
            Your reel will be delivered to <span className='text-cream/35'>{user?.email}</span>
          </p>
        </div>
      </form>
    </div>
  )
}