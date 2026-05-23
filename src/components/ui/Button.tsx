'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'
import Spinner from './Spinner'

type Variant = 'gold' | 'ghost' | 'outline' | 'danger' | 'cream'
type Size    = 'sm' | 'md' | 'lg' | 'xl'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  Variant
  size?:     Size
  loading?:  boolean
  fullWidth?: boolean
  leftIcon?:  React.ReactNode
  rightIcon?: React.ReactNode
}

const variants: Record<Variant, string> = {
  gold: [
    'bg-gold text-primary font-semibold',
    'hover:bg-gold-200 hover:shadow-gold-md',
    'active:bg-gold-dark',
    'shadow-gold-sm',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
  ].join(' '),

  ghost: [
    'bg-transparent text-gold border border-gold/30',
    'hover:bg-gold/8 hover:border-gold/60',
    'active:bg-gold/15',
    'disabled:opacity-40 disabled:cursor-not-allowed',
  ].join(' '),

  outline: [
    'bg-transparent text-cream border border-cream/20',
    'hover:bg-cream/5 hover:border-cream/40',
    'active:bg-cream/10',
    'disabled:opacity-40 disabled:cursor-not-allowed',
  ].join(' '),

  danger: [
    'bg-red-900/30 text-red-400 border border-red-800/40',
    'hover:bg-red-900/50 hover:border-red-700/60',
    'disabled:opacity-40 disabled:cursor-not-allowed',
  ].join(' '),

  cream: [
    'bg-cream text-primary font-semibold',
    'hover:bg-cream-200',
    'active:bg-cream-300',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' '),
}

const sizes: Record<Size, string> = {
  sm:  'h-9  px-4  text-xs  gap-1.5 rounded-lg',
  md:  'h-11 px-6  text-sm  gap-2   rounded-xl',
  lg:  'h-13 px-8  text-base gap-2.5 rounded-xl',
  xl:  'h-15 px-10 text-lg  gap-3   rounded-2xl',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant   = 'gold',
  size      = 'md',
  loading   = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  children,
  disabled,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        // Base
        'inline-flex items-center justify-center',
        'font-body tracking-wide',
        'transition-all duration-200 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50',
        'select-none cursor-pointer',
        // Variant + Size
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {loading ? (
        <Spinner size='sm' className='text-current' />
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  )
})

Button.displayName = 'Button'
export default Button