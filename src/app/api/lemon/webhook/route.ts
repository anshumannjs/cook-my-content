import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createServiceClient } from '@/lib/supabase/service'

// ─── Verify Lemon Squeezy webhook signature ──────────────────────────────────
function verifySignature(rawBody: string, signature: string, secret: string): boolean {
  const hmac   = crypto.createHmac('sha256', secret)
  const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8')
  const sig    = Buffer.from(signature, 'utf8')

  if (digest.length !== sig.length) return false
  return crypto.timingSafeEqual(digest, sig)
}

// ─── Map LS status to our status ─────────────────────────────────────────────
function mapStatus(lsStatus: string): string {
  switch (lsStatus) {
    case 'on_trial':   return 'trialing'
    case 'active':     return 'active'
    case 'past_due':
    case 'unpaid':     return 'past_due'
    case 'cancelled':
    case 'expired':    return 'canceled'
    case 'paused':     return 'past_due'
    default:           return 'canceled'
  }
}

// ─── Upsert subscription from LS payload ─────────────────────────────────────
async function upsertSubscription(
  attributes: Record<string, any>,
  customData: Record<string, any>
) {
  const supabase = createServiceClient()
  const userId   = customData?.user_id as string
  const plan     = customData?.plan    as string ?? 'classic'

  if (!userId) {
    console.error('Webhook missing user_id in custom_data')
    return
  }

  const status       = mapStatus(attributes.status)
  const trialEndsAt  = attributes.trial_ends_at  ?? null
  const renewsAt     = attributes.renews_at       ?? null
  const portalUrl    = attributes.urls?.customer_portal ?? null
  const lsSubId      = String(attributes.id ?? '')
  const lsCustomerId = String(attributes.customer_id ?? '')
  const lsVariantId  = String(attributes.variant_id ?? '')

  await supabase
    .from('subscriptions')
    .upsert(
      {
        user_id:              userId,
        payment_customer_id:  lsCustomerId,
        payment_subscription_id: lsSubId,
        payment_variant_id:   lsVariantId,
        tier:                 plan,
        status,
        trial_end:            trialEndsAt,
        current_period_end:   renewsAt,
        current_period_start: attributes.created_at ?? null,
        cancel_at_period_end: attributes.cancelled   ?? false,
        portal_url:           portalUrl,
        updated_at:           new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )
}

// ─── Reset BMC limits on renewal ─────────────────────────────────────────────
async function resetBMCLimits(
  attributes: Record<string, any>,
  customData:  Record<string, any>
) {
  const supabase = createServiceClient()
  const userId   = customData?.user_id as string
  const plan     = (customData?.plan ?? 'classic') as 'classic' | 'premium'

  if (!userId) return

  const { data: profile } = await supabase
    .from('profiles')
    .select('email')
    .eq('id', userId)
    .single()

  if (!profile?.email) return

  const table      = plan === 'premium' ? 'premium_BMC_limit_usage' : 'BMC_limit_usage'
  const cycleStart = attributes.created_at ?? new Date().toISOString()
  const cycleEnd   = attributes.renews_at  ?? null

  await supabase
    .from(table)
    .upsert(
      {
        email:                   profile.email,
        cycle_submission_number: 0,
        billing_cycle_start:     cycleStart,
        billing_cycle_end:       cycleEnd,
        plan_type:               plan,
        submitted_at:            new Date().toISOString(),
      },
      { onConflict: 'email' }
    )
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const rawBody  = await request.text()
  const signature = request.headers.get('x-signature') ?? ''

  if (!verifySignature(rawBody, signature, process.env.LEMONSQUEEZY_WEBHOOK_SECRET!)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  let payload: Record<string, any>
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const eventName  = payload.meta?.event_name   as string
  const customData = payload.meta?.custom_data  as Record<string, any> ?? {}
  const attributes = payload.data?.attributes   as Record<string, any> ?? {}

  try {
    switch (eventName) {

      case 'subscription_created': {
        await upsertSubscription(attributes, customData)
        break
      }

      case 'subscription_updated': {
        await upsertSubscription(attributes, customData)
        break
      }

      case 'subscription_cancelled':
      case 'subscription_expired': {
        const supabase = createServiceClient()
        const userId   = customData?.user_id as string
        if (userId) {
          await supabase
            .from('subscriptions')
            .update({ status: 'canceled', updated_at: new Date().toISOString() })
            .eq('user_id', userId)
        }
        break
      }

      case 'subscription_payment_success': {
        // Fires on trial conversion and monthly renewals
        const isTrial = attributes.status === 'on_trial'
        if (!isTrial) {
          // Monthly renewal — reset generation count
          await resetBMCLimits(attributes, customData)
        }
        await upsertSubscription(attributes, customData)
        break
      }

      case 'subscription_payment_failed': {
        const supabase = createServiceClient()
        const userId   = customData?.user_id as string
        if (userId) {
          await supabase
            .from('subscriptions')
            .update({ status: 'past_due', updated_at: new Date().toISOString() })
            .eq('user_id', userId)
        }
        break
      }
    }
  } catch (err) {
    console.error('Webhook handler error:', err)
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}