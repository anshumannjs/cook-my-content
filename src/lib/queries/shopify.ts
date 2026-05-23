import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/supabase'
import type { UserSubscription, PlanType } from '@/lib/types'

type Client = SupabaseClient<Database>

// ─── Fetch the user's latest subscription from Shopify orders table ─────────
export async function fetchSubscription(
  client: Client,
  email: string
): Promise<UserSubscription | null> {
  const { data, error } = await client
    .from('shopify subs orders')
    .select('*')
    .eq('email', email)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!data)  return null

  // Map product_title to our PlanType — "classic" | "premium"
  const raw = (data.product_title ?? '').toLowerCase()
  let plan: PlanType | null = null

  if (raw.includes('classic')) plan = 'classic'
  if (raw.includes('premium')) plan = 'premium'

  // No recognised plan → treat as no subscription
  if (!plan) return null

  return {
    plan,
    orderIdName:        data.order_id_name   ?? null,
    confirmationNumber: data.confirmation_number ?? null,
    email:              data.email           ?? email,
    phoneNumber:        data.phone_number    ?? null,
    amountPaid:         data.amount_paid,
    createdAt:          data.created_at      ?? null,
  }
}