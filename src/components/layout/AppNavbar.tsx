'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import Badge from '@/components/ui/Badge'
import { useAuthStore } from '@/lib/store/authStore'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

const APP_LINKS = [
  { label: 'Studio',  href: '/studio'  },
  { label: 'Library', href: '/library' },
]

export default function AppNavbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const pathname     = usePathname()
  const router       = useRouter()
  const user         = useAuthStore((s) => s.user)
  const subscription = useAuthStore((s) => s.subscription)
  const reset        = useAuthStore((s) => s.reset)

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    reset()
    router.push('/')
    toast.success('Signed out successfully')
  }

  // Avatar initials fallback
  const initials = user?.displayName
    ? user.displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? '??'

  return (
    <header className='sticky top-0 z-40 bg-primary/90 backdrop-blur-xl border-b border-gold/8'>
      <nav className='max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-6'>

        {/* Logo */}
        <Link href='/studio' className='flex items-center gap-2.5 flex-shrink-0'>
          <div className='w-7 h-7 rounded-md bg-gold-gradient flex items-center justify-center'>
            <svg width='12' height='12' viewBox='0 0 14 14' fill='none'>
              <path d='M3 2.5L11 7L3 11.5V2.5Z' fill='#0A0A0A' />
            </svg>
          </div>
          <span className='font-heading text-lg font-semibold text-cream tracking-wide hidden sm:block'>
            Cook My Content
          </span>
        </Link>

        {/* App links */}
        <ul className='flex items-center gap-1'>
          {APP_LINKS.map((link) => {
            const active = pathname.startsWith(link.href)
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium font-body transition-all duration-200',
                    active
                      ? 'bg-gold/12 text-gold border border-gold/20'
                      : 'text-cream/50 hover:text-cream/80 hover:bg-cream/5',
                  )}
                >
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Right: plan badge + avatar */}
        <div className='flex items-center gap-3'>
          {subscription?.plan && (
            <Badge
              variant={subscription.plan === 'premium' ? 'premium' : 'classic'}
              className='hidden sm:inline-flex capitalize'
            >
              {subscription.plan}
            </Badge>
          )}

          {/* Avatar dropdown */}
          <div className='relative'>
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className={cn(
                'w-9 h-9 rounded-full flex items-center justify-center',
                'text-xs font-semibold font-body',
                'border transition-all duration-200',
                dropdownOpen
                  ? 'border-gold/50 bg-gold/15 text-gold'
                  : 'border-cream/15 bg-cream/5 text-cream/70 hover:border-gold/30 hover:text-gold',
              )}
              aria-label='Account menu'
            >
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.displayName ?? 'Avatar'}
                  className='w-full h-full rounded-full object-cover'
                />
              ) : (
                initials
              )}
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <>
                  {/* Click-away overlay */}
                  <div
                    className='fixed inset-0 z-40'
                    onClick={() => setDropdownOpen(false)}
                  />
                  <motion.div
                    key='dropdown'
                    initial={{ opacity: 0, scale: 0.95, y: -8 }}
                    animate={{ opacity: 1, scale: 1,    y: 0  }}
                    exit={{ opacity: 0,   scale: 0.95,  y: -8 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className={cn(
                      'absolute right-0 top-12 z-50 w-52',
                      'bg-shadow border border-gold/15 rounded-2xl',
                      'shadow-card overflow-hidden',
                    )}
                  >
                    {/* User info */}
                    <div className='px-4 py-3 border-b border-gold/8'>
                      <p className='text-xs font-medium text-cream/80 truncate'>
                        {user?.displayName ?? 'User'}
                      </p>
                      <p className='text-xs text-cream/35 truncate mt-0.5'>
                        {user?.email}
                      </p>
                    </div>

                    {/* Menu items */}
                    <div className='p-1.5'>
                      <Link
                        href='/settings'
                        onClick={() => setDropdownOpen(false)}
                        className='flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-cream/60 hover:text-cream hover:bg-cream/5 transition-colors font-body'
                      >
                        <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5'>
                          <circle cx='12' cy='8' r='4' />
                          <path d='M4 20c0-4 3.6-7 8-7s8 3 8 7' />
                        </svg>
                        Settings
                      </Link>

                      <Link
                        href='/pricing'
                        onClick={() => setDropdownOpen(false)}
                        className='flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-cream/60 hover:text-cream hover:bg-cream/5 transition-colors font-body'
                      >
                        <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5'>
                          <path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' />
                        </svg>
                        Upgrade Plan
                      </Link>

                      <button
                        onClick={() => { setDropdownOpen(false); handleSignOut() }}
                        className='w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-950/30 transition-colors font-body'
                      >
                        <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5'>
                          <path d='M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9' />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>
    </header>
  )
}