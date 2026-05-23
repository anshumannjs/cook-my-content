import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/supabase'
import type { LibraryEntry, PlanType } from '@/lib/types'

type Client = SupabaseClient<Database>

// ─── Extract thumbnail from image_url_quick_post JSON field ─────────────────
function extractThumbnail(raw: unknown): string | null {
  if (!raw) return null
  if (Array.isArray(raw) && typeof raw[0] === 'string') return raw[0]
  if (typeof raw === 'string') return raw
  return null
}

// ─── Fetch Classic submission history for a user ─────────────────────────────
async function fetchClassicHistory(
  client: Client,
  email: string
): Promise<LibraryEntry[]> {
  const { data, error } = await client
    .from('TALLY BMC CLASSIC')
    .select(
      'submission_id, business_name, content_type, "content style", music_mood, status, created_at, image_url_quick_post'
    )
    .eq('email', email)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)

  return (data ?? []).map((row) => ({
    submissionId:  row.submission_id ?? '',
    plan:          'classic' as PlanType,
    businessName:  row.business_name  ?? null,
    contentType:   row.content_type   ?? null,
    contentStyle:  row['content style'] ?? null,
    musicMood:     row.music_mood     ?? null,
    status:        row.status         ?? null,
    createdAt:     row.created_at     ?? null,
    thumbnailUrl:  extractThumbnail(row.image_url_quick_post),
  }))
}

// ─── Fetch Premium submission history for a user ─────────────────────────────
async function fetchPremiumHistory(
  client: Client,
  email: string
): Promise<LibraryEntry[]> {
  const { data, error } = await client
    .from('TALLY BMC PREMIUM')
    .select(
      'submission_id, business_name, content_type, "content style", music_mood, status, created_at, image_url_quick_post'
    )
    .eq('email', email)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)

  return (data ?? []).map((row) => ({
    submissionId:  row.submission_id ?? '',
    plan:          'premium' as PlanType,
    businessName:  row.business_name  ?? null,
    contentType:   row.content_type   ?? null,
    contentStyle:  row['content style'] ?? null,
    musicMood:     row.music_mood     ?? null,
    status:        row.status         ?? null,
    createdAt:     row.created_at     ?? null,
    thumbnailUrl:  extractThumbnail(row.image_url_quick_post),
  }))
}

// ─── Fetch + merge both plans, sorted by date desc ──────────────────────────
export async function fetchLibrary(
  client: Client,
  email: string,
  planFilter?: PlanType
): Promise<LibraryEntry[]> {
  const fetchers: Promise<LibraryEntry[]>[] = []

  if (!planFilter || planFilter === 'classic') {
    fetchers.push(fetchClassicHistory(client, email))
  }
  if (!planFilter || planFilter === 'premium') {
    fetchers.push(fetchPremiumHistory(client, email))
  }

  const results  = await Promise.all(fetchers)
  const combined = results.flat()

  // Sort by createdAt descending
  return combined.sort((a, b) => {
    if (!a.createdAt) return  1
    if (!b.createdAt) return -1
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}

// ─── Fetch usage limits ──────────────────────────────────────────────────────
export async function fetchUsageLimits(
  client: Client,
  email: string,
  plan: PlanType
) {
  const table = plan === 'classic' ? 'BMC_limit_usage' : 'premium_BMC_limit_usage'

  const { data, error } = await client
    .from(table)
    .select('*')
    .eq('email', email)
    .order('submitted_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!data)  return null

  const blockedUntil = data['blocked until'] ?? null
  const isBlocked    = blockedUntil
    ? new Date(blockedUntil) > new Date()
    : false

  return {
    submissionsUsed:   data.cycle_submission_number ?? 0,
    billingCycleStart: data.billing_cycle_start     ?? null,
    billingCycleEnd:   data.billing_cycle_end       ?? null,
    blockedUntil,
    nextCycle:         data['next cycle']           ?? null,
    isBlocked,
  }
}