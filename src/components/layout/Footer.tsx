import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

const FOOTER_LINKS = {
  Product: [
    { label: 'Studio',            href: '/studio'            },
    { label: 'Library',           href: '/library'           },
    { label: 'Pricing',           href: '/pricing'           },
    { label: 'Custom Filmmaking', href: '/custom-filmmaking' },
  ],
  Plans: [
    { label: 'Classic Menu',        href: '/pricing#classic'  },
    { label: "Premium Chef's Special", href: '/pricing#premium' },
    { label: 'Custom AI Filmmaking',   href: '/pricing#custom'  },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Help Center',    href: '/help'    },
  ],
}

export default function Footer() {
  return (
    <footer className='relative bg-[#080806] border-t border-gold/8'>

      {/* Film-frame border strip */}
      <div className='absolute top-0 left-0 right-0 h-px'>
        <div className='h-full bg-gradient-to-r from-transparent via-gold/30 to-transparent' />
      </div>

      <div className='max-w-7xl mx-auto px-6 lg:px-10 py-16'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12'>

          {/* Brand column — 2 cols */}
          <div className='lg:col-span-2'>
            <Link href='/' className='flex items-center gap-2.5 mb-5'>
              <div className='w-8 h-8 rounded-lg bg-gold-gradient flex items-center justify-center shadow-gold-sm'>
                <svg width='14' height='14' viewBox='0 0 14 14' fill='none'>
                  <path d='M3 2.5L11 7L3 11.5V2.5Z' fill='#0A0A0A' />
                </svg>
              </div>
              <span className='font-heading text-xl font-semibold text-cream tracking-wide'>
                Cook My Content
              </span>
            </Link>

            <p className='font-body text-sm text-cream/40 leading-relaxed max-w-xs'>
              Upload one photo. Get a cinematic reel. No prompts, no editing, no hassle — your content is chef&apos;s special every time.
            </p>

            {/* Social links */}
            <div className='flex items-center gap-3 mt-6'>
              {[
                { label: 'Instagram', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
                { label: 'Twitter',   icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                { label: 'TikTok',   icon: 'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z' },
              ].map((social) => (
                <a
                  key={social.label}
                  href='#'
                  aria-label={social.label}
                  className='w-9 h-9 rounded-lg border border-cream/10 flex items-center justify-center text-cream/30 hover:text-gold hover:border-gold/30 transition-all duration-200'
                >
                  <svg width='16' height='16' viewBox='0 0 24 24' fill='currentColor'>
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {(Object.entries(FOOTER_LINKS) as [string, { label: string; href: string }[]][]).map(([group, links]) => (
            <div key={group}>
              <h4 className='font-body text-xs font-semibold text-cream/25 uppercase tracking-widest mb-5'>
                {group}
              </h4>
              <ul className='space-y-3'>
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className='font-body text-sm text-cream/45 hover:text-gold transition-colors duration-200'
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className='mt-14 pt-6 border-t border-cream/5 flex flex-col sm:flex-row items-center justify-between gap-4'>
          <p className='font-body text-xs text-cream/20'>
            © {new Date().getFullYear()} Cook My Content. All rights reserved.
          </p>
          <p className='font-body text-xs text-cream/15 font-heading italic'>
            Every frame is chef&apos;s special.
          </p>
        </div>
      </div>
    </footer>
  )
}