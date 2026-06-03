import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/dodopayments'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { plan } = await request.json() as { plan: 'classic' | 'premium' }

  const priceId = plan === 'premium'
    ? process.env.STRIPE_PREMIUM_PRICE_ID!
    : process.env.STRIPE_CLASSIC_PRICE_ID!

  // Reuse existing Stripe customer if they have one
  const { data: existing } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .maybeSingle()

  let customerId = existing?.stripe_customer_id

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    })
    customerId = customer.id
  }

  const session = await stripe.checkout.sessions.create({
    customer:                   customerId,
    mode:                       'subscription',
    payment_method_collection:  'always',   // card required upfront
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: {
      trial_period_days: 3,
      metadata: {
        supabase_user_id: user.id,
        plan,
      },
    },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  `${process.env.NEXT_PUBLIC_SITE_URL}/pricing/cancel`,
    metadata: {
      supabase_user_id: user.id,
      plan,
    },
  })

  return NextResponse.json({ url: session.url })
}