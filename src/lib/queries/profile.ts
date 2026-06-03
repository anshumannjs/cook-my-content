import { createClient } from '@/lib/supabase/client'
import type { Tables, TablesUpdate } from '@/supabase'
import type { Profile } from '@/lib/types'

type ProfileRow = Tables<'profiles'>

function mapProfile(row: ProfileRow): Profile {
  return {
    id:               row.id,
    email:            row.email,
    fullName:         row.full_name        ?? null,
    phone:            row.phone            ?? null,
    businessName:     row.business_name    ?? null,
    businessNiche:    row.business_niche   ?? null,  // fixed
    logoUrl:          row.logo_url         ?? null,
    stripeCustomerId: row.stripe_customer_id ?? null,
  }
}

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await createClient()
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!data)  return null
  return mapProfile(data as ProfileRow)
}

export async function updateProfile(
  userId:  string,
  updates: Partial<Omit<Profile, 'id' | 'email'>>
): Promise<Profile> {
  const payload: TablesUpdate<'profiles'> = {
    updated_at: new Date().toISOString(),
  }

  if (updates.fullName      !== undefined) payload.full_name      = updates.fullName
  if (updates.phone         !== undefined) payload.phone          = updates.phone
  if (updates.businessName  !== undefined) payload.business_name  = updates.businessName
  if (updates.businessNiche !== undefined) payload.business_niche = updates.businessNiche  // fixed
  if (updates.logoUrl       !== undefined) payload.logo_url       = updates.logoUrl

  const { data, error } = await createClient()
    .from('profiles')
    .update(payload)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return mapProfile(data as ProfileRow)
}