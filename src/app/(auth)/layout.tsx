import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: {
    template: '%s | Cook My Content',
    default:  'Auth | Cook My Content',
  },
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='relative min-h-screen flex flex-col items-center justify-center overflow-hidden'>

      {/* Ambient background glows */}
      <div className='absolute inset-0 bg-hero-glow pointer-events-none' />
      <div className='absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] pointer-events-none' />
      <div className='absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none' />

      {/* Logo — top left on desktop, top center on mobile */}
      <div className='absolute top-6 left-6 sm:left-10'>
        <Link href='/' className='flex items-center gap-2.5 group'>
          <div className='w-7 h-7 rounded-md bg-gold-gradient flex items-center justify-center shadow-gold-sm'>
            <svg width='12' height='12' viewBox='0 0 14 14' fill='none'>
              <path d='M3 2.5L11 7L3 11.5V2.5Z' fill='#0A0A0A' />
            </svg>
          </div>
          <span className='font-heading text-lg font-semibold text-cream/80 group-hover:text-cream transition-colors'>
            Cook My Content
          </span>
        </Link>
      </div>

      {/* Page content */}
      <div className='relative z-10 w-full px-4 py-24 flex items-center justify-center'>
        {children}
      </div>

      {/* Footer links */}
      <div className='absolute bottom-6 left-0 right-0 flex justify-center gap-6'>
        {['Privacy Policy', 'Terms of Service', 'Help Center'].map((item) => (
          <a
            key={item}
            href='#'
            className='font-body text-xs text-cream/25 hover:text-gold/70 transition-colors'
          >
            {item}
          </a>
        ))}
      </div>
    </div>
  )
}