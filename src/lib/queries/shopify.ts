import { createClient } from "../supabase/client"

export async function fetchSubscription(userId: string): Promise<UserSubscription | null> {
  console.log({userId})
  const { data, error } = await createClient()
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .in('status', ['trialing', 'active', 'past_due'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!data)  return null

  const row = data as any  // use any until types regenerate

  let trialDaysRemaining: number | null = null
  if (row.trial_end && row.status === 'trialing') {
    const ms = new Date(row.trial_end).getTime() - Date.now()
    trialDaysRemaining = Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)))
  }

  return {
    plan:              row.tier as 'classic' | 'premium',
    status:            row.status as UserSubscription['status'],
    stripeCustomerId:  row.payment_customer_id,   // renamed column
    trialEnd:          row.trial_end          ?? null,
    trialDaysRemaining,
    currentPeriodEnd:  row.current_period_end ?? null,
    cancelAtPeriodEnd: row.cancel_at_period_end ?? false,
  }
}