'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/lib/store/authStore'
import { useLibrary } from '@/lib/hooks/useLibrary'
import SubmissionCard from '@/components/library/SubmissionCard'
import FilterBar from '@/components/library/FilterBar'
import EmptyState from '@/components/library/EmptyState'
import Spinner from '@/components/ui/Spinner'
import Button from '@/components/ui/Button'
import type { PlanType, LibraryEntry } from '@/lib/types'

type FilterPlan   = PlanType | 'all'
type FilterStatus = 'all' | 'submitted' | 'processing' | 'delivered' | 'failed'

export default function LibraryPage() {
  const user = useAuthStore((s) => s.user)

  const [planFilter,   setPlanFilter]   = useState<FilterPlan>('all')
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')

  const {
    data:       entries,
    isLoading,
    isError,
    refetch,
  } = useLibrary(user?.email, planFilter === 'all' ? undefined : planFilter)

  // Client-side status filter
  const filtered: LibraryEntry[] = useMemo(() => {
    if (!entries) return []
    if (statusFilter === 'all') return entries
    return entries.filter((e) => {
      const s = e.status?.toLowerCase() ?? ''
      if (statusFilter === 'delivered') return s === 'delivered' || s === 'completed'
      return s === statusFilter
    })
  }, [entries, statusFilter])

  const hasEntries   = (entries?.length ?? 0) > 0
  const hasFiltered  = filtered.length > 0
  const isFiltering  = planFilter !== 'all' || statusFilter !== 'all'

  return (
    <div>

      {/* Page header */}
      <div className='flex items-start justify-between mb-8 gap-4'>
        <div>
          <h1 className='font-heading text-4xl font-medium text-cream'>
            Your Library
          </h1>
          <p className='font-body text-sm text-cream/40 mt-1'>
            Every reel Celestiva has cooked for you.
          </p>
        </div>
        <Link href='/studio' className='flex-shrink-0'>
          <Button variant='gold' size='sm'>
            <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='mr-1.5'>
              <path d='M12 5v14M5 12h14' />
            </svg>
            New Reel
          </Button>
        </Link>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className='flex flex-col items-center justify-center py-24 gap-4'>
          <Spinner size='lg' className='text-gold/40' />
          <p className='font-body text-sm text-cream/30'>Loading your reels…</p>
        </div>
      )}

      {/* Error */}
      {isError && !isLoading && (
        <div className='flex flex-col items-center justify-center py-24 gap-4 text-center'>
          <div className='w-16 h-16 rounded-2xl bg-red-950/30 border border-red-800/30 flex items-center justify-center'>
            <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#f87171' strokeWidth='1.5'>
              <circle cx='12' cy='12' r='10' />
              <path d='M12 8v4M12 16h.01' />
            </svg>
          </div>
          <div>
            <p className='font-body text-sm text-red-400 font-medium'>
              Could not load your library
            </p>
            <p className='font-body text-xs text-cream/30 mt-1'>
              Check your connection and try again.
            </p>
          </div>
          <Button variant='ghost' size='sm' onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {/* Content */}
      {!isLoading && !isError && (
        <>
          {/* No reels at all */}
          {!hasEntries && <EmptyState filtered={false} />}

          {/* Has reels — show filters + grid */}
          {hasEntries && (
            <>
              <div className='mb-6'>
                <FilterBar
                  planFilter={planFilter}
                  statusFilter={statusFilter}
                  total={filtered.length}
                  onPlanChange={setPlanFilter}
                  onStatusChange={setStatusFilter}
                />
              </div>

              {/* Filtered empty */}
              {!hasFiltered && isFiltering && (
                <EmptyState filtered={true} />
              )}

              {/* Grid */}
              {hasFiltered && (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
                  {filtered.map((entry, i) => (
                    <SubmissionCard
                      key={entry.submissionId || i}
                      entry={entry}
                      index={i}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Refresh note */}
      {hasEntries && !isLoading && (
        <div className='flex items-center justify-center gap-3 mt-12 pb-4'>
          <p className='font-body text-xs text-cream/20'>
            Reels refresh automatically. Delivered reels appear in your email.
          </p>
          <button
            onClick={() => refetch()}
            className='font-body text-xs text-gold/40 hover:text-gold/70 transition-colors'
          >
            Refresh
          </button>
        </div>
      )}
    </div>
  )
}