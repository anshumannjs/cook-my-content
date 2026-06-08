import { Webhooks } from '@dodopayments/nextjs'
import { createServiceClient } from '@/lib/supabase/service'

// ─── Types ────────────────────────────────────────────────────────────────────
type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'canceled'

type DodoSubscriptionData = {
  subscription_id:      string
  customer_id:          string
  product_id:           string
  customer:             { email: string; customer_id: string }
  status:               string
  trial_period_end:     string | null
  next_billing_date:    string | null
  current_period_start: string | null
  cancelled_at:         string | null
  created_at:           string
}

// ─── Status map ───────────────────────────────────────────────────────────────
const EVENT_STATUS_MAP: Record<string, SubscriptionStatus> = {
  'subscription.active':       'active',     // overridden below if on trial
  'subscription.renewed':      'active',
  'subscription.plan_changed': 'active',
  'subscription.on_hold':      'past_due',
  'subscription.failed':       'past_due',
  'subscription.cancelled':    'canceled',
  'subscription.expired':      'canceled',
}

// ─── Resolve customer email from payload ─────────────────────────────────────
function resolveEmail(data: any): string | null {
  return data?.customer?.email
      ?? data?.customer_email
      ?? null
}

// ─── Get our user ID from email ───────────────────────────────────────────────
async function getUserId(email: string): Promise<string | null> {
  const { data } = await createServiceClient()
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single()
  return data?.id ?? null
}

// ─── Upsert subscription row ──────────────────────────────────────────────────
async function upsertSubscription(
  data:    any,
  status:  SubscriptionStatus
): Promise<void> {
  const email = resolveEmail(data)
  if (!email) {
    console.error('[webhook] Missing customer email in payload')
    return
  }

  const userId = await getUserId(email)
  if (!userId) {
    console.error('[webhook] No profile found for email:', email)
    return
  }

  const plan = data.product_id === process.env.DODO_CLASSIC_PRODUCT_ID
    ? 'classic'
    : 'premium'

  const { error } = await createServiceClient()
    .from('subscriptions')
    .upsert(
      {
        user_id:                 userId,
        payment_customer_id:     String(data.customer?.customer_id ?? data.customer_id ?? ''),
        payment_subscription_id: String(data.subscription_id ?? ''),
        payment_variant_id:      String(data.product_id ?? ''),
        tier:                    plan,
        status,
        trial_end:               data.trial_period_end  ?? null,
        current_period_end:      data.next_billing_date ?? null,
        current_period_start:    data.current_period_start ?? data.created_at ?? null,
        cancel_at_period_end:    data.cancelled_at != null,
        updated_at:              new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )

  if (error) console.error('[webhook] Supabase upsert error:', error.message)
}

// ─── Reset monthly generation limits on renewal ───────────────────────────────
async function resetGenerationLimits(
  data:  any,
  plan:  'classic' | 'premium'
): Promise<void> {
  const email = resolveEmail(data)
  if (!email) return

  const table = plan === 'premium'
    ? 'premium_BMC_limit_usage'
    : 'BMC_limit_usage'

  const { error } = await createServiceClient()
    .from(table)
    .upsert(
      {
        email,
        cycle_submission_number: 0,
        billing_cycle_start:     data.current_period_start ?? new Date().toISOString(),
        billing_cycle_end:       data.next_billing_date    ?? null,
        plan_type:               plan,
        submitted_at:            new Date().toISOString(),
      },
      { onConflict: 'email' }
    )

  if (error) console.error('[webhook] BMC limit reset error:', error.message)
}

// ─── Route handler ────────────────────────────────────────────────────────────
export const POST = Webhooks({
  webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_SECRET!,

  onPayload: async (payload) => {
    const eventType = payload.type
    const data      = (payload as any).data ?? {}

    console.log(`[webhook] ${eventType}`)

    // Ignore any event not in our subscribed list
    if (!(eventType in EVENT_STATUS_MAP)) return

    let status = EVENT_STATUS_MAP[eventType]

    // Special case: subscription.active during trial period
    if (eventType === 'subscription.active' && data.trial_period_end) {
      status = 'trialing'
    }

    // await upsertSubscription(data, status)

    // On renewal — also reset the generation count for the new cycle
    if (eventType === 'subscription.renewed') {
      const plan = data.product_id === process.env.DODO_CLASSIC_PRODUCT_ID
        ? 'classic' as const
        : 'premium' as const
      await resetGenerationLimits(data, plan)
    }

    // On plan change — update tier without touching period dates
    if (eventType === 'subscription.plan_changed') {
      console.log('[webhook] Plan changed to:', data.product_id)
    }
  },
})