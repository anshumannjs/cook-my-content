'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import { useSubscription } from '@/lib/hooks/useSubscription'
import { useUsageLimits } from '@/lib/hooks/useUsageLimits'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import Spinner from '@/components/ui/Spinner'
import { cn } from '@/lib/utils/cn'

const profileSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  phone:       z.string().optional(),
  businessName:       z.string().optional(),
  businessTypeNiche:  z.string().optional(),
})
type ProfileValues = z.infer<typeof profileSchema>

type Tab = 'profile' | 'billing'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const user         = useAuthStore((s) => s.user)
  const subscription = useAuthStore((s) => s.subscription)
  const setUser      = useAuthStore((s) => s.setUser)

  const { data: sub,    isLoading: subLoading }  = useSubscription(user?.email)
  const { data: limits, isLoading: limitsLoading } = useUsageLimits(
    user?.email,
    sub?.plan ?? null,
  )

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName:       user?.displayName ?? '',
      phone:             sub?.phoneNumber  ?? '',
      businessName:      '',
      businessTypeNiche: '',
    },
    // Load saved metadata async
    values: (() => {
      // Will be overridden by useEffect loading metadata
      return undefined
    })(),
  })

  async function onSaveProfile(values: ProfileValues) {
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name:           values.displayName,
        phone_number:        values.phone,
        business_name:       values.businessName,
        business_type_niche: values.businessTypeNiche,
      },
    })
    if (error) { toast.error(error.message); return }

    setUser({ ...user!, displayName: values.displayName })
    toast.success('Profile updated')
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: 'profile', label: 'Profile'  },
    { key: 'billing', label: 'Billing'  },
  ]

  return (
    <div className='max-w-2xl mx-auto'>

      {/* Header */}
      <div className='mb-8'>
        <h1 className='font-heading text-4xl font-medium text-cream'>Settings</h1>
        <p className='font-body text-sm text-cream/40 mt-1'>
          Manage your account and subscription.
        </p>
      </div>

      {/* Tabs */}
      <div className='flex gap-1 bg-cream/3 border border-cream/8 rounded-xl p-1 mb-8 w-fit'>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'px-5 py-2.5 rounded-lg font-body text-sm transition-all duration-200',
              activeTab === tab.key
                ? 'bg-gold/15 text-gold border border-gold/25'
                : 'text-cream/40 hover:text-cream/70',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Profile Tab ──────────────────────────────────────────────────── */}
      {activeTab === 'profile' && (
        <motion.div
          key='profile'
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ duration: 0.25 }}
        >
          <form onSubmit={handleSubmit(onSaveProfile)} className='space-y-6'>

            {/* Avatar */}
            <div className='bg-shadow/50 border border-gold/8 rounded-3xl p-6'>
              <p className='font-body text-xs text-cream/30 uppercase tracking-widest mb-5'>
                Identity
              </p>
              <div className='flex items-center gap-5 mb-6'>
                <div className='w-16 h-16 rounded-2xl border border-gold/20 flex items-center justify-center bg-gold/10 flex-shrink-0 overflow-hidden'>
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt='Avatar' className='w-full h-full object-cover' />
                  ) : (
                    <span className='font-heading text-2xl font-medium text-gold'>
                      {user?.displayName?.[0]?.toUpperCase() ?? '?'}
                    </span>
                  )}
                </div>
                <div>
                  <p className='font-body text-sm font-medium text-cream/80'>
                    {user?.displayName ?? 'User'}
                  </p>
                  <p className='font-body text-xs text-cream/35 mt-0.5'>{user?.email}</p>
                  {user?.avatarUrl && (
                    <p className='font-body text-xs text-cream/20 mt-1'>
                      Avatar synced from Google
                    </p>
                  )}
                </div>
              </div>

              <div className='space-y-4'>
                <Input
                  label='Display Name'
                  placeholder='Jane Smith'
                  error={errors.displayName?.message}
                  {...register('displayName')}
                />
                <Input
                  label='Email'
                  type='email'
                  value={user?.email ?? ''}
                  disabled
                  helper='Email cannot be changed — it is linked to your Shopify subscription.'
                />
                <Input
                  label='Phone Number (optional)'
                  type='tel'
                  placeholder='+1 234 567 8900'
                  {...register('phone')}
                />
              </div>
            </div>

            {/* Business info */}
            <div className='bg-shadow/50 border border-gold/8 rounded-3xl p-6 space-y-4'>
              <p className='font-body text-xs text-cream/30 uppercase tracking-widest mb-2'>
                Business Info
              </p>
              <p className='font-body text-xs text-cream/25 mb-4'>
                Saved to pre-fill the studio form for faster submissions.
              </p>
              <Input
                label='Business Name'
                placeholder='Bloom Skincare'
                {...register('businessName')}
              />
              <Input
                label='Business Niche'
                placeholder='Luxury skincare for women 25–45'
                {...register('businessTypeNiche')}
              />
            </div>

            <Button
              type='submit'
              variant='gold'
              loading={isSubmitting}
              disabled={!isDirty}
            >
              Save Changes
            </Button>
          </form>
        </motion.div>
      )}

      {/* ── Billing Tab ──────────────────────────────────────────────────── */}
      {activeTab === 'billing' && (
        <motion.div
          key='billing'
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ duration: 0.25 }}
          className='space-y-5'
        >

          {/* Current plan */}
          <div className='bg-shadow/50 border border-gold/8 rounded-3xl p-6'>
            <p className='font-body text-xs text-cream/30 uppercase tracking-widest mb-5'>
              Current Plan
            </p>

            {subLoading ? (
              <div className='flex items-center gap-3 py-4'>
                <Spinner size='sm' className='text-gold/40' />
                <span className='font-body text-xs text-cream/30'>Loading subscription…</span>
              </div>
            ) : sub ? (
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='font-heading text-2xl text-cream capitalize'>
                      {sub.plan === 'premium' ? "Premium Chef's Special" : 'Classic Menu'}
                    </p>
                    <p className='font-body text-xs text-cream/35 mt-1'>
                      {sub.plan === 'premium' ? '$169' : '$49'}/month · via Shopify
                    </p>
                  </div>
                  <Badge
                    variant={sub.plan === 'premium' ? 'premium' : 'classic'}
                    dot
                  >
                    Active
                  </Badge>
                </div>

                <div className='h-px bg-cream/5' />

                <div className='grid grid-cols-2 gap-4'>
                  {[
                    { label: 'Order Ref',      value: sub.orderIdName ?? '—' },
                    { label: 'Confirmation',   value: sub.confirmationNumber ?? '—' },
                    { label: 'Member Since',   value: sub.createdAt ? format(new Date(sub.createdAt), 'MMM d, yyyy') : '—' },
                    { label: 'Billing',        value: 'Managed via Shopify' },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className='font-body text-xs text-cream/25 mb-0.5'>{item.label}</p>
                      <p className='font-body text-sm text-cream/55 truncate'>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className='text-center py-4'>
                <p className='font-body text-sm text-cream/35 mb-4'>
                  No active subscription found.
                </p>
                <a href='/pricing'>
                  <Button variant='gold' size='sm'>View Plans</Button>
                </a>
              </div>
            )}
          </div>

          {/* Usage this cycle */}
          {sub && (
            <div className='bg-shadow/50 border border-gold/8 rounded-3xl p-6'>
              <p className='font-body text-xs text-cream/30 uppercase tracking-widest mb-5'>
                Usage This Cycle
              </p>

              {limitsLoading ? (
                <Spinner size='sm' className='text-gold/40' />
              ) : limits ? (
                <div className='space-y-4'>
                  {/* Progress bar */}
                  <div>
                    <div className='flex items-center justify-between mb-2'>
                      <span className='font-body text-xs text-cream/40'>Reels submitted</span>
                      <span className='font-body text-xs text-cream/60 font-medium'>
                        {limits.submissionsUsed}/10
                      </span>
                    </div>
                    <div className='h-1.5 bg-cream/8 rounded-full overflow-hidden'>
                      <motion.div
                        className={cn(
                          'h-full rounded-full',
                          limits.submissionsUsed >= 10 ? 'bg-red-500' : 'bg-gold',
                        )}
                        initial={{ width: '0%' }}
                        animate={{ width: `${(limits.submissionsUsed / 10) * 100}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    {[
                      {
                        label: 'Cycle Start',
                        value: limits.billingCycleStart
                          ? format(new Date(limits.billingCycleStart), 'MMM d, yyyy')
                          : '—',
                      },
                      {
                        label: 'Cycle End',
                        value: limits.billingCycleEnd
                          ? format(new Date(limits.billingCycleEnd), 'MMM d, yyyy')
                          : '—',
                      },
                      {
                        label: 'Remaining',
                        value: `${10 - (limits.submissionsUsed ?? 0)} reels`,
                      },
                      {
                        label: 'Status',
                        value: limits.isBlocked ? 'Limit reached' : 'Active',
                      },
                    ].map((item) => (
                      <div key={item.label}>
                        <p className='font-body text-xs text-cream/25 mb-0.5'>{item.label}</p>
                        <p className='font-body text-sm text-cream/55'>{item.value}</p>
                      </div>
                    ))}
                  </div>

                  {limits.isBlocked && (
                    <div className='p-3 rounded-xl bg-red-950/20 border border-red-800/30'>
                      <p className='font-body text-xs text-red-400/80'>
                        Submission limit reached. Resets{' '}
                        {limits.nextCycle
                          ? format(new Date(limits.nextCycle), 'MMM d, yyyy')
                          : 'next cycle'}.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className='font-body text-xs text-cream/30'>No usage data yet.</p>
              )}
            </div>
          )}

          {/* Manage subscription */}
          <div className='bg-shadow/50 border border-gold/8 rounded-3xl p-6'>
            <p className='font-body text-xs text-cream/30 uppercase tracking-widest mb-3'>
              Manage Subscription
            </p>
            <p className='font-body text-xs text-cream/35 leading-relaxed mb-5'>
              Your subscription is managed through Shopify. To upgrade, downgrade, or cancel, please visit your Shopify account or contact support.
            </p>
            <div className='flex flex-wrap gap-3'>
              <a href='/pricing' className='flex-1'>
                <Button variant='ghost' fullWidth size='sm'>
                  Upgrade Plan
                </Button>
              </a>
              
                href='mailto:support@cookmycontent.com'
                className='flex-1'
              >
                <Button variant='outline' fullWidth size='sm'>
                  Contact Support
                </Button>
              </a>
            </div>
          </div>

        </motion.div>
      )}
    </div>
  )
}