import { NextRequest, NextResponse } from 'next/server'
import { dodo, DODO_PRODUCT_IDS } from '@/lib/dodopayments'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { plan } = await request.json() as { plan: 'classic' | 'premium' }

  try {
    const session = await dodo.checkoutSessions.create({
      product_cart: [
        { product_id: DODO_PRODUCT_IDS[plan], quantity: 1 }
      ],
      subscription_data: {
        trial_period_days: 3,
      },
      customer: {
        email: user.email!,
        name:  user.user_metadata?.full_name ?? user.email!,
      },
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing/success`,
    })

    if (!session.checkout_url) {
      return NextResponse.json(
        { error: 'Could not create checkout session' },
        { status: 500 }
      )
    }

    return NextResponse.json({ url: session.checkout_url })
  } catch (err) {
    console.error('Dodo checkout error:', err)
    return NextResponse.json(
      { error: 'Checkout creation failed' },
      { status: 500 }
    )
  }
}