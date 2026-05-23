'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { cn } from '@/lib/utils/cn'
import Badge from '@/components/ui/Badge'
import type { LibraryEntry } from '@/lib/types'

interface SubmissionCardProps {
  entry: LibraryEntry
  index: number
}

function statusVariant(status: string | null): React.ComponentProps<typeof Badge>['variant'] {
  switch (status?.toLowerCase()) {
    case 'submitted':  return 'submitted'
    case 'processing': return 'processing'
    case 'completed':
    case 'delivered':  return 'delivered'
    case 'failed':     return 'failed'
    default:           return 'neutral'
  }
}

function statusLabel(status: string | null): string {
  if (!status) return 'Unknown'
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
}

export default function SubmissionCard({ entry, index }: SubmissionCardProps) {
  const [imgError, setImgError] = useState(false)
  const isPremium = entry.plan === 'premium'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'group relative rounded-3xl border overflow-hidden',
        'bg-shadow/60 backdrop-blur-sm',
        'hover:border-gold/20 transition-all duration-300',
        'hover:shadow-gold-sm hover:-translate-y-0.5',
        isPremium ? 'border-amber-800/20' : 'border-gold/8',
      )}
    >
      {/* Thumbnail */}
      <div className='relative aspect-[4/3] bg-[#0F0C08] overflow-hidden'>
        {entry.thumbnailUrl && !imgError ? (
          <img
            src={entry.thumbnailUrl}
            alt={entry.businessName ?? 'Submission'}
            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
            onError={() => setImgError(true)}
          />
        ) : (
          /* Fallback placeholder */
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='text-center'>
              <div className='w-12 h-12 rounded-2xl bg-cream/5 border border-cream/8 flex items-center justify-center mx-auto mb-2'>
                <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='rgba(245,240,232,0.15)' strokeWidth='1.5'>
                  <rect x='3' y='3' width='18' height='18' rx='2' />
                  <circle cx='8.5' cy='8.5' r='1.5' />
                  <path d='M21 15l-5-5L5 21' />
                </svg>
              </div>
              <p className='font-body text-[10px] text-cream/15'>No preview</p>
            </div>
          </div>
        )}

        {/* Gradient overlay */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />

        {/* Status badge — bottom left of thumbnail */}
        <div className='absolute bottom-3 left-3'>
          <Badge variant={statusVariant(entry.status)} dot>
            {statusLabel(entry.status)}
          </Badge>
        </div>

        {/* Plan badge — top right */}
        <div className='absolute top-3 right-3'>
          <Badge variant={isPremium ? 'premium' : 'classic'}>
            {isPremium ? 'Premium' : 'Classic'}
          </Badge>
        </div>

        {/* Processing shimmer overlay */}
        {entry.status?.toLowerCase() === 'processing' && (
          <div
            className='absolute inset-0 pointer-events-none'
            style={{
              background: 'linear-gradient(105deg, transparent 40%, rgba(212,165,116,0.06) 50%, transparent 60%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2.5s linear infinite',
            }}
          />
        )}
      </div>

      {/* Card body */}
      <div className='p-5'>
        {/* Business name */}
        <h3 className='font-heading text-lg font-medium text-cream truncate mb-1'>
          {entry.businessName ?? 'Untitled Reel'}
        </h3>

        {/* Meta row */}
        <div className='flex flex-wrap items-center gap-2 mb-4'>
          {entry.contentType && (
            <span className='font-body text-xs text-cream/30 bg-cream/4 px-2.5 py-1 rounded-lg border border-cream/6'>
              {entry.contentType}
            </span>
          )}
          {entry.musicMood && (
            <span className='font-body text-xs text-cream/30 bg-cream/4 px-2.5 py-1 rounded-lg border border-cream/6'>
              🎵 {entry.musicMood.replace(/_/g, ' ')}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className='flex items-center justify-between pt-4 border-t border-cream/5'>
          <p className='font-body text-xs text-cream/25'>
            {entry.createdAt
              ? format(new Date(entry.createdAt), 'MMM d, yyyy · h:mm a')
              : '—'
            }
          </p>

          {/* Submission ID */}
          {entry.submissionId && (
            <p className='font-mono text-[10px] text-cream/15 truncate max-w-[100px]'>
              #{entry.submissionId.slice(-8)}
            </p>
          )}
        </div>
      </div>

      {/* Delivered indicator — bottom border glow */}
      {(entry.status?.toLowerCase() === 'completed' ||
        entry.status?.toLowerCase() === 'delivered') && (
        <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent' />
      )}
    </motion.div>
  )
}