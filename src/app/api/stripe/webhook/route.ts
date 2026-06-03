import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { stripe } from '@/lib/dodopayments'
import { createServiceClient } from '@/lib/supabase/service'

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function upsertSubscription(
  sub: Stripe.Subscription
) {
  const supabase = createServiceClient()
  const userId   = sub.metadata?.supabase_user_id
  const plan     = sub.metadata?.plan ?? 'classic'

  if (!userId) return

  await supabase
    .from('subscriptions')
    .upsert(
      {
        user_id:                userId,
        stripe_customer_id:     sub.customer as string,
        stripe_subscription_id: sub.id,
        stripe_price_id:        sub.items.data[0].price.id,
        tier:                   plan,
        status:                 sub.status,
        current_period_start:   new Date(sub.current_period_start * 1000).toISOString(),
        current_period_end:     new Date(sub.current_period_end   * 1000).toISOString(),
        trial_end:              sub.trial_end
                                  ? new Date(sub.trial_end * 1000).toISOString()
                                  : null,
        cancel_at_period_end:   sub.cancel_at_period_end,
        updated_at:             new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )
}

async function resetBMCLimits(sub: Stripe.Subscription) {
  const supabase = createServiceClient()
  const userId   = sub.metadata?.supabase_user_id
  const plan     = (sub.metadata?.plan ?? 'classic') as 'classic' | 'premium'

  if (!userId) return

  const { data: profile } = await supabase
    .from('profiles')
    .select('email')
    .eq('id', userId)
    .single()

  if (!profile?.email) return

  const table      = plan === 'premium' ? 'premium_BMC_limit_usage' : 'BMC_limit_usage'
  const cycleStart = new Date(sub.current_period_start * 1000).toISOString()
  const cycleEnd   = new Date(sub.current_period_end   * 1000).toISOString()

  await supabase
    .from(table)
    .upsert(
      {
        email:                    profile.email,
        cycle_submission_number:  0,
        billing_cycle_start:      cycleStart,
        billing_cycle_end:        cycleEnd,
        plan_type:                plan,
        submitted_at:             new Date().toISOString(),
      },
      { onConflict: 'email' }
    )
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig  = request.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createServiceClient()

  try {
    switch (event.type) {

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        await upsertSubscription(sub)

        // Trial converted to active → reset monthly BMC limits
        const prev = event.data.previous_attributes as Partial<Stripe.Subscription>
        const trialJustEnded = prev?.status === 'trialing' && sub.status === 'active'
        if (trialJustEnded) {
          await resetBMCLimits(sub)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        await supabase
          .from('subscriptions')
          .update({ status: 'canceled', updated_at: new Date().toISOString() })
          .eq('stripe_subscription_id', sub.id)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        // Only reset on recurring renewals, not the initial trial charge
        if (
          invoice.billing_reason === 'subscription_cycle' &&
          invoice.subscription
        ) {
          const sub = await stripe.subscriptions.retrieve(
            invoice.subscription as string
          )
          await upsertSubscription(sub)
          await resetBMCLimits(sub)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        if (invoice.subscription) {
          await supabase
            .from('subscriptions')
            .update({ status: 'past_due', updated_at: new Date().toISOString() })
            .eq('stripe_subscription_id', invoice.subscription as string)
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