import type { Metadata } from 'next'
import HeroSection     from '@/components/landing/HeroSection'
import StatsBar        from '@/components/landing/StatsBar'
import HowItWorks      from '@/components/landing/HowItWorks'
import WorkShowcase    from '@/components/landing/WorkShowcase'
import ServicesSection from '@/components/landing/ServicesSection'
import Testimonials    from '@/components/landing/Testimonials'
import ProductVideo    from '@/components/landing/ProductVideo'
import FAQSection      from '@/components/landing/FAQSection'
import CTABand         from '@/components/landing/CTABand'

export const metadata: Metadata = {
  title: 'Cook My Content — Cinematic Reels from One Photo',
}

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <HowItWorks />
      <WorkShowcase />
      <ServicesSection />
      <Testimonials />
      <ProductVideo />
      <FAQSection />
      <CTABand />
    </>
  )
}