'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

interface ModalProps {
  open:       boolean
  onClose:    () => void
  children:   React.ReactNode
  title?:     string
  size?:      'sm' | 'md' | 'lg' | 'xl'
  className?: string
  // Prevent closing on overlay click
  persistent?: boolean
}

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
}

export default function Modal({
  open,
  onClose,
  children,
  title,
  size       = 'md',
  className,
  persistent = false,
}: ModalProps) {
  // Lock scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Escape key to close
  useEffect(() => {
    if (!open || persistent) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose, persistent])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            key='modal-overlay'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='fixed inset-0 z-50 bg-primary/80 backdrop-blur-md'
            onClick={persistent ? undefined : onClose}
          />

          {/* Panel */}
          <div className='fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none'>
            <motion.div
              key='modal-panel'
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{ opacity: 0,   scale: 0.95,  y: 8  }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                'relative w-full pointer-events-auto',
                'bg-shadow border border-gold/15 rounded-3xl shadow-card',
                'overflow-hidden',
                sizes[size],
                className,
              )}
            >
              {/* Header */}
              {(title) && (
                <div className='flex items-center justify-between px-8 pt-8 pb-0'>
                  <h2 className='font-heading text-2xl text-cream'>{title}</h2>
                  {!persistent && (
                    <button
                      onClick={onClose}
                      className='text-cream/30 hover:text-cream/70 transition-colors p-1 ml-4'
                      aria-label='Close'
                    >
                      <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                        <path d='M18 6L6 18M6 6l12 12' />
                      </svg>
                    </button>
                  )}
                </div>
              )}

              {/* Close button when no title */}
              {!title && !persistent && (
                <button
                  onClick={onClose}
                  className='absolute top-5 right-5 text-cream/30 hover:text-cream/70 transition-colors p-1 z-10'
                  aria-label='Close'
                >
                  <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                    <path d='M18 6L6 18M6 6l12 12' />
                  </svg>
                </button>
              )}

              {/* Content */}
              <div className='p-8'>
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}