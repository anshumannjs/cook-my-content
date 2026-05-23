import { cn } from '@/lib/utils/cn'

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg'

interface SpinnerProps {
  size?:      SpinnerSize
  className?: string
}

const sizes: Record<SpinnerSize, string> = {
  xs: 'w-3 h-3 border',
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-[3px]',
}

export default function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <span
      role='status'
      aria-label='Loading'
      className={cn(
        'inline-block rounded-full animate-spin',
        'border-current border-t-transparent opacity-80',
        sizes[size],
        className,
      )}
    />
  )
}