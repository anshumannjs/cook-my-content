'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import Button from '@/components/ui/Button'
import { useAuthStore } from '@/lib/store/authStore'

const NAV_LINKS = [
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Our Work',     href: '/#work' },
  { label: 'Plans',        href: '/#plans' },
  { label: 'FAQ',          href: '/#faq' },
]

export default function Navbar() {
  const [scrolled,     setScrolled]     = useState(false)
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const pathname = usePathname()
  const user     = useAuthStore((s) => s.user)

  // Frost on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])
  console.log(useAuthStore())

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50',
          'transition-all duration-500 ease-out',
          scrolled
            ? 'bg-primary/80 backdrop-blur-xl border-b border-gold/8 shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
            : 'bg-transparent',
        )}
      >
        <nav className='max-w-7xl mx-auto px-6 lg:px-10 h-18 flex items-center justify-between'>

          {/* Logo */}
          <Link href='/' className='flex items-center gap-2.5 group flex-shrink-0'>
            <div className='w-8 h-8 rounded-lg bg-gold-gradient flex items-center justify-center shadow-gold-sm group-hover:shadow-gold-md transition-shadow'>
              <svg width='14' height='14' viewBox='0 0 14 14' fill='none'>
                <path d='M3 2.5L11 7L3 11.5V2.5Z' fill='#0A0A0A' />
              </svg>
            </div>
            <span className='font-heading text-xl font-semibold text-cream tracking-wide'>
              Cook My Content
            </span>
          </Link>

          {/* Desktop nav links */}
          <ul className='hidden md:flex items-center gap-8'>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className='font-body text-sm text-cream/55 hover:text-gold transition-colors duration-200'
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className='hidden md:flex items-center gap-3'>
            {user ? (
              <Link href='/studio'>
                <Button variant='gold' size='sm'>
                  Go to Studio
                </Button>
              </Link>
            ) : (
              <>
                <Link href='/login'>
                  <Button variant='ghost' size='sm'>
                    Sign In
                  </Button>
                </Link>
                <Link href='/signup'>
                  <Button variant='gold' size='sm'>
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className='md:hidden flex flex-col gap-1.5 p-2 group'
            onClick={() => setMobileOpen((v) => !v)}
            aria-label='Toggle menu'
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={cn(
                  'block h-px bg-cream/60 transition-all duration-300',
                  i === 0 && (mobileOpen ? 'w-5 rotate-45 translate-y-2' : 'w-5'),
                  i === 1 && (mobileOpen ? 'w-0 opacity-0' : 'w-4'),
                  i === 2 && (mobileOpen ? 'w-5 -rotate-45 -translate-y-2' : 'w-5'),
                )}
              />
            ))}
          </button>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key='mobile-menu'
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'fixed top-18 left-0 right-0 z-40 md:hidden',
              'bg-primary/95 backdrop-blur-xl',
              'border-b border-gold/10',
              'px-6 py-6 flex flex-col gap-5',
            )}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className='font-body text-base text-cream/70 hover:text-gold transition-colors'
              >
                {link.label}
              </Link>
            ))}

            <div className='flex flex-col gap-3 pt-4 border-t border-gold/10'>
              {user ? (
                <Link href='/studio'>
                  <Button variant='gold' fullWidth>Go to Studio</Button>
                </Link>
              ) : (
                <>
                  <Link href='/login'>
                    <Button variant='ghost' fullWidth>Sign In</Button>
                  </Link>
                  <Link href='/signup'>
                    <Button variant='gold' fullWidth>Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}