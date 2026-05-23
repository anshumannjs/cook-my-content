'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?:       string
  error?:       string
  helper?:      string
  leftIcon?:    React.ReactNode
  rightIcon?:   React.ReactNode
  containerClassName?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helper,
  leftIcon,
  rightIcon,
  containerClassName,
  className,
  id,
  ...props
}, ref) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className='text-xs font-medium text-cream/60 font-body ml-0.5'
        >
          {label}
        </label>
      )}

      <div className='relative flex items-center'>
        {leftIcon && (
          <span className='absolute left-4 text-cream/30 pointer-events-none'>
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          className={cn(
            'input-base',
            leftIcon  && 'pl-11',
            rightIcon && 'pr-11',
            error && 'border-red-700/60 focus:border-red-500/60 focus:shadow-none',
            className,
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />

        {rightIcon && (
          <span className='absolute right-4 text-cream/30'>
            {rightIcon}
          </span>
        )}
      </div>

      {error && (
        <p
          id={`${inputId}-error`}
          className='text-xs text-red-400 font-body ml-0.5 mt-0.5'
        >
          {error}
        </p>
      )}

      {helper && !error && (
        <p className='text-xs text-cream/40 font-body ml-0.5 mt-0.5'>
          {helper}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'
export default Input


// ─── Textarea variant ────────────────────────────────────────────────────────
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?:       string
  error?:       string
  helper?:      string
  containerClassName?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  helper,
  containerClassName,
  className,
  id,
  ...props
}, ref) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className='text-xs font-medium text-cream/60 font-body ml-0.5'
        >
          {label}
        </label>
      )}

      <textarea
        ref={ref}
        id={inputId}
        className={cn(
          'input-base resize-none min-h-[120px]',
          error && 'border-red-700/60',
          className,
        )}
        aria-invalid={!!error}
        {...props}
      />

      {error && (
        <p className='text-xs text-red-400 font-body ml-0.5'>
          {error}
        </p>
      )}
      {helper && !error && (
        <p className='text-xs text-cream/40 font-body ml-0.5'>
          {helper}
        </p>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'