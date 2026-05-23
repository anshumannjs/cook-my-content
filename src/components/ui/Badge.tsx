import { cn } from '@/lib/utils/cn'

type BadgeVariant =
  | 'submitted'
  | 'processing'
  | 'delivered'
  | 'failed'
  | 'classic'
  | 'premium'
  | 'gold'
  | 'neutral'

interface BadgeProps {
  variant?:   BadgeVariant
  children:   React.ReactNode
  className?: string
  dot?:       boolean
}

const variants: Record<BadgeVariant, string> = {
  submitted:  'bg-blue-950/60  text-blue-300  border-blue-800/50',
  processing: 'bg-amber-950/60 text-amber-300 border-amber-700/50',
  delivered:  'bg-emerald-950/60 text-emerald-300 border-emerald-800/50',
  failed:     'bg-red-950/60   text-red-400   border-red-800/50',
  classic:    'bg-gold/10      text-gold       border-gold/25',
  premium:    'bg-amber-500/10 text-amber-300  border-amber-500/25',
  gold:       'bg-gold/15      text-gold-200   border-gold/30',
  neutral:    'bg-cream/5      text-cream/60   border-cream/10',
}

const dotColors: Record<BadgeVariant, string> = {
  submitted:  'bg-blue-400',
  processing: 'bg-amber-400 animate-pulse',
  delivered:  'bg-emerald-400',
  failed:     'bg-red-400',
  classic:    'bg-gold',
  premium:    'bg-amber-400',
  gold:       'bg-gold',
  neutral:    'bg-cream/40',
}

export default function Badge({
  variant = 'neutral',
  children,
  className,
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5',
        'px-2.5 py-0.5 rounded-full',
        'text-xs font-medium font-body',
        'border',
        variants[variant],
        className,
      )}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', dotColors[variant])} />
      )}
      {children}
    </span>
  )
}