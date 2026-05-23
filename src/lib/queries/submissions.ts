import { v4 as uuidv4 } from 'uuid'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/supabase'
import type { ClassicSubmissionInsert, PremiumSubmissionInsert } from '@/lib/types'

type Client = SupabaseClient<Database>

const BUCKET = 'processed'

// ─── Upload a single file to Supabase Storage ────────────────────────────────
async function uploadFile(
  client: Client,
  file: File,
  submissionId: string,
  email: string
): Promise<string> {
  const ext  = file.name.split('.').pop() ?? 'jpg'
  const path = `submissions/${email}/${submissionId}/${uuidv4()}.${ext}`

  const { error } = await client.storage
    .from(BUCKET)
    .upload(path, file, { upsert: false, cacheControl: '3600' })

  if (error) throw new Error(`Upload failed: ${error.message}`)

  const { data } = client.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

// ─── Upload all photo files and return URLs ──────────────────────────────────
export async function uploadPhotos(
  client: Client,
  files: File[],
  submissionId: string,
  email: string
): Promise<string[]> {
  return Promise.all(files.map((f) => uploadFile(client, f, submissionId, email)))
}

// ─── Upload logo file ────────────────────────────────────────────────────────
export async function uploadLogo(
  client: Client,
  file: File,
  email: string
): Promise<string> {
  const ext  = file.name.split('.').pop() ?? 'png'
  const path = `logos/${email}/${uuidv4()}.${ext}`

  const { error } = await client.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true, cacheControl: '86400' })

  if (error) throw new Error(`Logo upload failed: ${error.message}`)

  const { data } = client.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

// ─── Insert Classic submission ───────────────────────────────────────────────
export async function insertClassicSubmission(
  client: Client,
  payload: ClassicSubmissionInsert
): Promise<void> {
  const { error } = await client
    .from('TALLY BMC CLASSIC')
    .insert({
      submission_id:        payload.submission_id,
      name:                 payload.name,
      email:                payload.email,
      phone_number:         payload.phone_number,
      business_name:        payload.business_name,
      business_type_niche:  payload.business_type_niche,
      content_type:         payload.content_type,
      'content style':      payload['content style'],
      caption_type:         payload.caption_type,
      platform:             payload.platform,
      music_mood:           payload.music_mood,
      story_context:        payload.story_context,
      image_url_quick_post: payload.image_url_quick_post,
      logo_url:             payload.logo_url,
      plan_type:            payload.plan_type,
      status:               payload.status,
    })

  if (error) throw new Error(error.message)
}

// ─── Insert Premium submission ───────────────────────────────────────────────
export async function insertPremiumSubmission(
  client: Client,
  payload: PremiumSubmissionInsert
): Promise<void> {
  const { error } = await client
    .from('TALLY BMC PREMIUM')
    .insert({
      submission_id:           payload.submission_id,
      name:                    payload.name,
      email:                   payload.email,
      phone_number:            payload.phone_number,
      business_name:           payload.business_name,
      business_type_niche:     payload.business_type_niche,
      content_type:            payload.content_type,
      'content style':         payload['content style'],
      caption_type:            payload.caption_type,
      platform:                payload.platform,
      music_mood:              payload.music_mood,
      story_context:           payload.story_context,
      image_url_quick_post:    payload.image_url_quick_post,
      image_url_AD_generation: payload.image_url_AD_generation,
      logo_url:                payload.logo_url,
      plan_type:               payload.plan_type,
      status:                  payload.status,
      emotion_in_2_sec:        payload.emotion_in_2_sec,
      reel_feeling:            payload.reel_feeling,
      visual_world:            payload.visual_world,
    })

  if (error) throw new Error(error.message)
}

// ─── Generate a fresh submission ID ─────────────────────────────────────────
export function generateSubmissionId(): string {
  return `cmc_${uuidv4().replace(/-/g, '').slice(0, 16)}`
}