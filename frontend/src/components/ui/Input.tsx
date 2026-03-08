import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <input
        id={inputId}
        {...props}
        className={[
          'bg-[#1a1a1f] border rounded px-3 py-2 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-accent',
          error ? 'border-red-500' : 'border-white/10',
          className,
        ].join(' ')}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  )
}
