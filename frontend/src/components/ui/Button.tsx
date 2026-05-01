import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

type ButtonBaseProps = Omit<HTMLMotionProps<'button'>, 'children'>

interface ButtonProps extends ButtonBaseProps {
  variant?: Variant
  size?: Size
  loading?: boolean
  fullWidth?: boolean
  children?: React.ReactNode
}

const variants: Record<Variant, string> = {
  primary: 'bg-accent hover:bg-blue-700 text-white border-transparent',
  secondary: 'bg-transparent hover:bg-accent/10 text-accent border border-accent',
  ghost: 'bg-transparent hover:bg-white/5 text-[#e8e8e8]/60 hover:text-[#e8e8e8] border-transparent',
  danger: 'bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-800/30',
}

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading
  return (
    <motion.button
      {...props}
      disabled={isDisabled}
      whileHover={{ scale: isDisabled ? 1 : 1.02 }}
      whileTap={{ scale: isDisabled ? 1 : 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
      className={[
        'inline-flex items-center justify-center gap-2 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:opacity-50 disabled:cursor-not-allowed',
        'rounded-btn',
        variants[variant],
        sizes[size],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
      {children}
    </motion.button>
  )
}
