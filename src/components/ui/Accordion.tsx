'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils/cn'
import { motion, AnimatePresence } from 'framer-motion'

interface AccordionItem {
  question: string
  answer:   string
}

interface AccordionProps {
  items:      AccordionItem[]
  className?: string
}

function AccordionRow({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item:     AccordionItem
  index:    number
  isOpen:   boolean
  onToggle: () => void
}) {
  return (
    <div
      className={cn(
        'border-b border-gold/10 last:border-b-0',
        'transition-colors duration-200',
        isOpen && 'border-gold/20',
      )}
    >
      <button
        onClick={onToggle}
        className={cn(
          'w-full flex items-center justify-between',
          'py-6 px-1 text-left',
          'group transition-colors duration-200',
        )}
        aria-expanded={isOpen}
      >
        {/* Number + Question */}
        <div className='flex items-start gap-4 flex-1 pr-6'>
          <span className={cn(
            'font-heading text-sm mt-0.5 transition-colors duration-200 flex-shrink-0',
            isOpen ? 'text-gold' : 'text-cream/20',
          )}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className={cn(
            'font-body text-base font-medium transition-colors duration-200',
            isOpen ? 'text-cream' : 'text-cream/70 group-hover:text-cream',
          )}>
            {item.question}
          </span>
        </div>

        {/* Icon */}
        <div className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center',
          'transition-all duration-300',
          isOpen
            ? 'border-gold/40 bg-gold/10 rotate-45'
            : 'border-cream/10 group-hover:border-gold/20',
        )}>
          <svg
            width='12' height='12'
            viewBox='0 0 12 12'
            fill='none'
            className={cn('transition-colors', isOpen ? 'stroke-gold' : 'stroke-cream/40')}
          >
            <path d='M6 1v10M1 6h10' strokeWidth='1.5' strokeLinecap='round' />
          </svg>
        </div>
      </button>

      {/* Answer — animated */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key='answer'
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className='overflow-hidden'
          >
            <p className='font-body text-sm text-cream/55 leading-relaxed pb-6 pl-10 pr-10'>
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Accordion({ items, className }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className={cn('w-full', className)}>
      {items.map((item, i) => (
        <AccordionRow
          key={i}
          item={item}
          index={i}
          isOpen={openIndex === i}
          onToggle={() => setOpenIndex(openIndex === i ? null : i)}
        />
      ))}
    </div>
  )
}