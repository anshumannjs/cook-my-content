import { NextRequest, NextResponse } from 'next/server'
import { createCheckout } from '@lemonsqueezy/lemonsqueezy.js'
import { createClient } from '@/lib/supabase/server'
import { LS_STORE_ID, LS_VARIANT_IDS } from '@/lib/dodopayments'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { plan } = await request.json() as { plan: 'classic' | 'premium' }
  const variantId = LS_VARIANT_IDS[plan]

  const { data, error } = await createCheckout(
    LS_STORE_ID,
    variantId,
    {
      checkoutData: {
        email: user.email,
        custom: {
          user_id: user.id,
          plan,
        },
      },
      checkoutOptions: {
        embed: false,
        media:  true,
        logo:   true,
      },
      productOptions: {
        redirectUrl:          `${process.env.NEXT_PUBLIC_SITE_URL}/pricing/success`,
        receiptThankYouNote:  'Welcome to Cook My Content! Your trial starts now.',
        enabledVariants:      [Number(variantId)],
      },
    }
  )

  if (error || !data?.data?.attributes?.url) {
    console.error('LemonSqueezy checkout error:', error)
    return NextResponse.json(
      { error: 'Could not create checkout session' },
      { status: 500 }
    )
  }

  return NextResponse.json({ url: data.data.attributes.url })
}