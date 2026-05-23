'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { useStudioStore } from '@/lib/store/studioStore'
import { toast } from 'sonner'

const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20MB

export default function UploadZone() {
  const activePlan    = useStudioStore((s) => s.activePlan)
  const uploadedFiles = useStudioStore((s) => s.uploadedFiles)
  const addFile       = useStudioStore((s) => s.addFile)
  const removeFile    = useStudioStore((s) => s.removeFile)
  const canAddFile    = useStudioStore((s) =>
    s.uploadedFiles.length < (s.activePlan === 'classic' ? 1 : 4)
  )

  const fileLimit = activePlan === 'classic' ? 1 : 4

  const onDrop = useCallback((accepted: File[], rejected: { errors: { message: string }[] }[]) => {
    rejected.forEach((r) => toast.error(r.errors[0]?.message ?? 'File rejected'))
    accepted.forEach((file) => addFile(file))
  }, [addFile])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:   { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxSize:  MAX_FILE_SIZE,
    maxFiles: fileLimit - uploadedFiles.length,
    disabled: !canAddFile,
  })

  return (
    <div className='space-y-4'>

      {/* Preview grid */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={cn(
              'grid gap-3',
              activePlan === 'premium'
                ? 'grid-cols-2 sm:grid-cols-4'
                : 'grid-cols-1',
            )}
          >
            {uploadedFiles.map((file, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1  }}
                exit={{ opacity: 0,   scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className='relative group aspect-square'
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Upload ${i + 1}`}
                  className='w-full h-full object-cover rounded-2xl border border-gold/15'
                />
                {/* Overlay */}
                <div className='absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center'>
                  <button
                    onClick={() => removeFile(i)}
                    className='w-8 h-8 rounded-full bg-red-950/80 border border-red-800/50 flex items-center justify-center text-red-400 hover:bg-red-900/80 transition-colors'
                  >
                    <svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5'>
                      <path d='M18 6L6 18M6 6l12 12' />
                    </svg>
                  </button>
                </div>
                {/* Photo number badge */}
                <div className='absolute top-2 left-2 w-5 h-5 rounded-full bg-black/60 border border-cream/15 flex items-center justify-center'>
                  <span className='font-body text-[10px] text-cream/70'>{i + 1}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drop zone */}
      {canAddFile && (
        <div
          {...getRootProps()}
          className={cn(
            'relative flex flex-col items-center justify-center gap-3',
            'border-2 border-dashed rounded-3xl cursor-pointer',
            'transition-all duration-300 py-12 px-6',
            isDragActive
              ? 'border-gold/60 bg-gold/8 scale-[1.01]'
              : 'border-cream/10 hover:border-gold/30 hover:bg-cream/2',
            !canAddFile && 'opacity-50 cursor-not-allowed',
          )}
        >
          <input {...getInputProps()} />

          {/* Animated ring on drag */}
          {isDragActive && (
            <div className='absolute inset-0 rounded-3xl border border-gold/30 animate-ping-slow pointer-events-none' />
          )}

          {/* Upload icon */}
          <div className={cn(
            'w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-300',
            isDragActive ? 'bg-gold/20' : 'bg-cream/5',
          )}>
            <svg
              width='24' height='24'
              viewBox='0 0 24 24' fill='none'
              stroke={isDragActive ? '#D4A574' : 'rgba(245,240,232,0.3)'}
              strokeWidth='1.5'
              className='transition-colors duration-300'
            >
              <path d='M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4' />
              <polyline points='17 8 12 3 7 8' />
              <line x1='12' y1='3' x2='12' y2='15' />
            </svg>
          </div>

          <div className='text-center'>
            <p className={cn(
              'font-body text-sm font-medium transition-colors',
              isDragActive ? 'text-gold' : 'text-cream/50',
            )}>
              {isDragActive
                ? 'Drop your photo here'
                : uploadedFiles.length === 0
                  ? `Drop ${activePlan === 'classic' ? 'your photo' : 'photos'} here`
                  : `Add ${fileLimit - uploadedFiles.length} more photo${fileLimit - uploadedFiles.length > 1 ? 's' : ''}`
              }
            </p>
            <p className='font-body text-xs text-cream/25 mt-1'>
              JPG, PNG, WEBP · Max 20MB each
            </p>
          </div>

          {!isDragActive && (
            <span className='px-4 py-2 rounded-xl border border-cream/10 bg-cream/3 font-body text-xs text-cream/40 hover:border-gold/25 hover:text-gold/60 transition-colors'>
              Browse files
            </span>
          )}
        </div>
      )}

      {/* File count indicator */}
      <div className='flex items-center justify-between px-1'>
        <p className='font-body text-xs text-cream/25'>
          {uploadedFiles.length}/{fileLimit} photo{fileLimit > 1 ? 's' : ''} uploaded
        </p>
        {uploadedFiles.length === fileLimit && (
          <p className='font-body text-xs text-gold/60'>
            ✓ Ready to cook
          </p>
        )}
      </div>
    </div>
  )
}