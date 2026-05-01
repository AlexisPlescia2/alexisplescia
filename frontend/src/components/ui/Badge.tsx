import { ReactNode } from 'react'

type BadgeVariant = 'default' | 'accent' | 'gold' | 'success' | 'error' | 'info'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-surface text-[#e8e8e8]/60 border border-border',
  accent: 'bg-accent/10 text-accent border border-accent/20',
  gold: 'bg-gold/10 text-gold border border-gold/20',
  success: 'bg-green-900/30 text-green-400 border border-green-700/30',
  error: 'bg-red-900/30 text-red-400 border border-red-700/30',
  info: 'bg-blue-900/30 text-blue-400 border border-blue-700/30',
}

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium tracking-wide ${variantStyles[variant]} ${className}`}
      style={{ borderRadius: '4px' }}
    >
      {children}
    </span>
  )
}
