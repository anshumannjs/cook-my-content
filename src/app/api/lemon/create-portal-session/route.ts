import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(_request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('portal_url')
    .eq('user_id', user.id)
    .single()

  if (!sub?.portal_url) {
    return NextResponse.json({ error: 'No portal URL found' }, { status: 404 })
  }

  return NextResponse.json({ url: sub.portal_url })
}