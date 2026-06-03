import { Webhooks } from '@dodopayments/nextjs'
import { createServiceClient } from '@/lib/supabase/service'

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function getUserIdByEmail(email: string): Promise<string | null> {
  const { data } = await createServiceClient()
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single()
  return data?.id ?? null
}

async function upsertSub(data: any, status: string) {
  const supabase = createServiceClient()

  // Log data once to confirm exact field names from Dodo
  console.log('[dodo] upsertSub data:', JSON.stringify(data, null, 2))

  const email      = data.customer?.email
                  ?? data.customer_email
                  ?? null

  const customerId = String(data.customer?.customer_id ?? data.customer_id ?? '')
  const subId      = String(data.subscription_id ?? data.id ?? '')
  const productId  = data.product_id
                  ?? data.items?.[0]?.product_id
                  ?? null

  if (!email) {
    console.error('[dodo] No customer email found in data')
    return
  }

  const userId = await getUserIdByEmail(email)
  if (!userId) {
    console.error('[dodo] No profile found for:', email)
    return
  }

  console.log('[dodo] userId', userId)

  const plan = productId === process.env.DODO_CLASSIC_PRODUCT_ID
    ? 'classic'
    : 'premium'

  const { data: result, error } = await supabase
    .from('subscriptions')
    .upsert(
      {
        user_id:                 userId,
        payment_customer_id:     customerId,
        payment_subscription_id: subId,
        payment_variant_id:      String(productId ?? ''),
        tier:                    plan,
        status,
        trial_end:               data.trial_period_end  ?? null,
        current_period_end:      data.next_billing_date
                                   ?? data.current_period_end
                                   ?? null,
        current_period_start:    data.created_at        ?? new Date().toISOString(),
        cancel_at_period_end:    data.cancelled_at      != null,
        updated_at:              new Date().toISOString(),
      },
    //   { onConflict: 'user_id' }
    {onConflict: 'payment_subscription_id'}
    )
    console.log('[dodo] result', result)

if (error) {
  console.error('[dodo] error', error)
}
}

async function resetLimits(data: any, plan: 'classic' | 'premium') {
  const supabase = createServiceClient()
  const email    = data.customer?.email ?? data.customer_email ?? null
  if (!email) return

  const table = plan === 'premium' ? 'premium_BMC_limit_usage' : 'BMC_limit_usage'

  await supabase
    .from(table)
    .upsert(
      {
        email,
        cycle_submission_number: 0,
        billing_cycle_start:     data.current_period_start ?? new Date().toISOString(),
        billing_cycle_end:       data.next_billing_date ?? data.current_period_end ?? null,
        plan_type:               plan,
        submitted_at:            new Date().toISOString(),
      },
      { onConflict: 'email' }
    )
}

// ─── Route ────────────────────────────────────────────────────────────────────
export const POST = Webhooks({
  webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_SECRET!,

  onPayload: async (payload) => {
    const eventType = payload.type
    const data      = (payload as any).data ?? payload

    console.log('[dodo webhook] event:', eventType)

    switch (eventType) {

      // Trial started / subscription activated
      case 'subscription.active': {
        const isOnTrial = !!(data.trial_period_end)
        await upsertSub(data, isOnTrial ? 'trialing' : 'active')
        break
      }

      // Monthly renewal
      case 'subscription.renewed': {
        const productId = data.product_id ?? data.items?.[0]?.product_id
        const plan      = productId === process.env.DODO_CLASSIC_PRODUCT_ID
          ? 'classic' as const
          : 'premium' as const
        await upsertSub(data, 'active')
        await resetLimits(data, plan)
        break
      }

      // Payment succeeded (covers trial → paid conversion)
      case 'payment.succeeded':
      case 'subscription.payment.succeeded': {
        await upsertSub(data, 'active')
        break
      }

      // Payment failed / on hold
      case 'payment.failed':
      case 'subscription.payment.failed':
      case 'subscription.on_hold': {
        await upsertSub(data, 'past_due')
        break
      }

      // Cancelled / expired
      case 'subscription.cancelled':
      case 'subscription.expired': {
        await upsertSub(data, 'canceled')
        break
      }

      default:
        console.log('[dodo webhook] unhandled event type:', eventType)
    }
  },
})