'use client'

import { useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Stat {
  prefix?: string
  value:   number
  suffix:  string
  label:   string
}

const STATS: Stat[] = [
  { value: 4200, suffix: '+',  label: 'Reels Created'    },
  { value: 98,   suffix: '%',  label: 'Satisfaction Rate' },
  { value: 20,   suffix: ' min', label: 'Avg. Delivery'   },
  { value: 4,    suffix: 'K',  label: 'Output Quality'    },
]

function CountUp({ value, suffix, prefix = '' }: { value: number; suffix: string; prefix?: string }) {
  const [display, setDisplay] = useState(0)
  const elRef    = useRef<HTMLSpanElement>(null)
  const triggered = useRef(false)

  useEffect(() => {
    const el = elRef.current
    if (!el) return

    const trigger = ScrollTrigger.create({
      trigger: el,
      start:   'top 85%',
      onEnter: () => {
        if (triggered.current) return
        triggered.current = true
        gsap.to({ val: 0 }, {
          val:      value,
          duration: 2,
          ease:     'power2.out',
          onUpdate() { setDisplay(Math.round(this.targets()[0].val)) },
        })
      },
    })

    return () => trigger.kill()
  }, [value])

  return (
    <span ref={elRef}>
      {prefix}{display}{suffix}
    </span>
  )
}

export default function StatsBar() {
  return (
    <section className='relative py-10 border-y border-gold/8 overflow-hidden'>
      {/* Subtle gradient bg */}
      <div className='absolute inset-0 bg-gradient-to-r from-transparent via-gold/3 to-transparent' />

      <div className='relative max-w-5xl mx-auto px-6'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0'>
          {STATS.map((stat, i) => (
            <div
              key={i}
              className='flex flex-col items-center text-center relative'
            >
              {/* Separator — not on last */}
              {i < STATS.length - 1 && (
                <div className='hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-10 bg-gold/10' />
              )}

              <div className='font-heading text-4xl sm:text-5xl font-medium text-gradient-gold'>
                <CountUp value={stat.value} suffix={stat.suffix} />
              </div>
              <p className='font-body text-xs text-cream/35 mt-2 tracking-wide uppercase'>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}