import type { Tables } from '@/supabase'

// ─── Plan ──────────────────────────────────────────────────────────────────
export type PlanType = 'classic' | 'premium'

// ─── Shopify subscription row ───────────────────────────────────────────────
export type ShopifyOrder = Tables<'shopify subs orders'>

// ─── Derived subscription info (what the app uses) ─────────────────────────
export interface UserSubscription {
  plan: PlanType
  orderIdName: string | null
  confirmationNumber: string | null
  email: string
  phoneNumber: string | null
  amountPaid: unknown
  createdAt: string | null
}

// ─── Submission rows ────────────────────────────────────────────────────────
export type ClassicSubmissionRow  = Tables<'TALLY BMC CLASSIC'>
export type PremiumSubmissionRow  = Tables<'TALLY BMC PREMIUM'>

// ─── What we insert for Classic ────────────────────────────────────────────
export interface ClassicSubmissionInsert {
  submission_id:      string
  name:               string
  email:              string
  phone_number:       string | null
  business_name:      string
  business_type_niche:string
  content_type:       string
  'content style':    string
  caption_type:       string
  platform:           string
  music_mood:         string
  story_context:      string | null
  image_url_quick_post: string[]   // array of public URLs
  logo_url:           string | null
  plan_type:          'classic'
  status:             'submitted'
}

// ─── What we insert for Premium ────────────────────────────────────────────
export interface PremiumSubmissionInsert extends Omit<ClassicSubmissionInsert, 'plan_type' | 'image_url_quick_post'> {
  plan_type:              'premium'
  image_url_quick_post:   string[]   // up to 4 photos
  image_url_AD_generation:string[]   // same 4 photos (backend uses this field)
  emotion_in_2_sec:       string
  reel_feeling:           string
  visual_world:           string
}

// ─── Usage limits ───────────────────────────────────────────────────────────
export type UsageLimitRow = Tables<'BMC_limit_usage'>
export type PremiumUsageLimitRow = Tables<'premium_BMC_limit_usage'>

export interface UsageSummary {
  submissionsUsed:    number
  billingCycleStart:  string | null
  billingCycleEnd:    string | null
  blockedUntil:       string | null
  nextCycle:          string | null
  isBlocked:          boolean
}

// ─── Music library ──────────────────────────────────────────────────────────
export type MusicLibraryRow = Tables<'music_library'>

export type MusicMoodKey =
  | 'calm_minimal'
  | 'energetic_bold_motivational'
  | 'soft_cinematic_emotional'
  | 'trend_style_modern_vibe'
  | 'uplifting_happy'
  | 'warm_acoustic_storytelling'

export interface MusicMoodOption {
  key:   MusicMoodKey
  label: string
  url:   string | null
}

// ─── Library entry (unified view of both tally tables) ─────────────────────
export interface LibraryEntry {
  submissionId:  string
  plan:          PlanType
  businessName:  string | null
  contentType:   string | null
  contentStyle:  string | null
  musicMood:     string | null
  status:        string | null
  createdAt:     string | null
  thumbnailUrl:  string | null  // first image from image_url_quick_post
}

// ─── Auth user ──────────────────────────────────────────────────────────────
export interface AuthUser {
  id:          string
  email:       string
  displayName: string | null
  avatarUrl:   string | null
}

// ─── Zustand auth store state ───────────────────────────────────────────────
export interface AuthState {
  user:            AuthUser | null
  subscription:    UserSubscription | null
  isLoading:       boolean
  setUser:         (user: AuthUser | null) => void
  setSubscription: (sub: UserSubscription | null) => void
  setLoading:      (v: boolean) => void
  reset:           () => void
}

// ─── Zustand studio store state ─────────────────────────────────────────────
export interface StudioState {
  activePlan:     PlanType
  uploadedFiles:  File[]
  logoFile:       File | null
  setActivePlan:  (plan: PlanType) => void
  setUploadedFiles:(files: File[]) => void
  setLogoFile:    (file: File | null) => void
  reset:          () => void
}

// ─── Custom filmmaking form ─────────────────────────────────────────────────
export type CustomTier = 'starter' | 'advance' | 'pro_master'

export interface CustomFilmFormData {
  tier:           CustomTier
  fullName:       string
  email:          string
  phone:          string
  businessName:   string
  projectGoals:   string
  videoStyle:     string
  targetAudience: string
  references:     string
  timeline:       string
  additionalNotes:string
}