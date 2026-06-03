import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import Providers from '@/components/providers/Providers'
import './globals.css'
import AuthProvider from '@/components/providers/AuthProvider'

const cormorant = Cormorant_Garamond({
  subsets:  ['latin'],
  weight:   ['400', '500', '600', '700'],
  style:    ['normal', 'italic'],
  variable: '--font-heading',
  display:  'swap',
})

const inter = Inter({
  subsets:  ['latin'],
  weight:   ['300', '400', '500', '600'],
  variable: '--font-body',
  display:  'swap',
})

export const metadata: Metadata = {
  title: {
    default:  'Cook My Content — Cinematic Reels from One Photo',
    template: '%s | Cook My Content',
  },
  description:
    'Upload one photo. Get a cinematic, post-ready reel in minutes. No prompts, no editing — your content is chef\'s special every time.',
  keywords: [
    'photo to video',
    'AI video generator',
    'cinematic reels',
    'content creation',
    'social media reels',
    'Cook My Content',
  ],
  openGraph: {
    type:        'website',
    title:       'Cook My Content',
    description: 'Cinematic reels from one photo. No prompts. No hassle.',
    siteName:    'Cook My Content',
  },
  twitter: {
    card:  'summary_large_image',
    title: 'Cook My Content',
  },
  robots: {
    index:  true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang='en'
      className={`${cormorant.variable} ${inter.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body className='font-body bg-primary text-cream antialiased overflow-x-hidden'>
        <AuthProvider>
          <Providers>
            {children}
          </Providers>
        </AuthProvider>
      </body>
    </html>
  )
}