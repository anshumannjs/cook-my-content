import { cn } from '@/lib/utils/cn'

type CardVariant = 'default' | 'elevated' | 'premium' | 'flat'

interface CardProps {
  variant?:   CardVariant
  children:   React.ReactNode
  className?: string
  onClick?:   () => void
  as?:        React.ElementType
}

const variants: Record<CardVariant, string> = {
  default: [
    'bg-shadow/60 backdrop-blur-sm',
    'border border-gold/10',
    'shadow-card',
  ].join(' '),

  elevated: [
    'bg-shadow/80 backdrop-blur-md',
    'border border-gold/15',
    'shadow-card hover:shadow-card-hover',
    'transition-shadow duration-300',
  ].join(' '),

  // Gold gradient border — used for premium plan card
  premium: [
    'bg-shadow/80 backdrop-blur-md',
    'gold-border-gradient',
    'shadow-gold-md',
  ].join(' '),

  flat: [
    'bg-[#0F0C08]',
    'border border-gold/8',
  ].join(' '),
}

export default function Card({
  variant   = 'default',
  children,
  className,
  onClick,
  as: Tag   = 'div',
}: CardProps) {
  return (
    <Tag
      onClick={onClick}
      className={cn(
        'rounded-3xl overflow-hidden',
        variants[variant],
        onClick && 'cursor-pointer',
        className,
      )}
    >
      {children}
    </Tag>
  )
}