'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Accordion from '@/components/ui/Accordion'

gsap.registerPlugin(ScrollTrigger)

const FAQ_ITEMS = [
  {
    question: 'How does it work without any prompts?',
    answer:   'Celestiva, our AI cinematographer, analyses your photo automatically — reading the colours, subject, mood, and composition. It then writes a narrative, scores the music, applies cinematic motion, and grades the colours to match your brand, all without you typing a single word.',
  },
  {
    question: 'How long does delivery actually take?',
    answer:   'Classic plan reels are delivered in 20–35 minutes. Premium Chef\'s Special reels take 25–30 minutes due to the multi-photo storytelling and custom music composition. You\'ll receive your reel directly in your inbox — no need to stay on the page.',
  },
  {
    question: 'What photo quality do I need to submit?',
    answer:   'Any quality works — phone photos, professional shots, product images. The higher the quality, the sharper your 4K output. We recommend well-lit photos but Celestiva handles the colour grading regardless.',
  },
  {
    question: 'What is Celestiva?',
    answer:   'Celestiva is our AI cinematographer — the engine behind every reel. It was trained on thousands of hours of cinematic content and understands storytelling, colour theory, motion design, and music composition. Think of it as having a world-class director on call.',
  },
  {
    question: "What's the difference between Classic and Premium Chef's Special?",
    answer:   'Classic takes one photo and creates a 10-second cinematic reel with text overlays, music, and 4K output. Premium takes four photos, reads them as a single story, applies sequential cinematic motion so every clip connects, grades each photo professionally, and composes a custom brand song. The result feels like a short film, not just a reel.',
  },
  {
    question: 'Can I use the reels commercially?',
    answer:   'Yes. All reels you receive are fully owned by you and cleared for commercial use across all platforms — Instagram, TikTok, YouTube Shorts, Facebook, LinkedIn, and anywhere else.',
  },
  {
    question: 'How does Custom AI Filmmaking work?',
    answer:   "Custom AI Filmmaking is a hands-on service. After you submit your brief through our form, our team personally contacts you to discuss your project in detail. We handle everything — scripting, production, and delivery — within the agreed timeline. It's a fully bespoke service, not automated.",
  },
  {
    question: 'Can I submit multiple reels in one day?',
    answer:   'Both plans allow one submission per 24-hour period. This ensures every reel gets Celestiva\'s full attention and maintains the quality standard. Your 10 monthly reels reset with each billing cycle.',
  },
]

export default function FAQSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.fromTo(
      sectionRef.current?.querySelector('.faq-content'),
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      }
    )
  }, { scope: sectionRef })

  return (
    <section
      id='faq'
      ref={sectionRef}
      className='py-28 sm:py-36 px-6'
    >
      <div className='max-w-3xl mx-auto'>
        <div className='text-center mb-16'>
          <p className='font-body text-xs text-gold/60 tracking-widest uppercase mb-4'>
            FAQ
          </p>
          <h2 className='font-heading text-[clamp(2.5rem,5vw,4rem)] font-medium text-cream'>
            Questions from the kitchen.
          </h2>
        </div>

        <div className='faq-content opacity-0'>
          <Accordion items={FAQ_ITEMS} />
        </div>
      </div>
    </section>
  )
}