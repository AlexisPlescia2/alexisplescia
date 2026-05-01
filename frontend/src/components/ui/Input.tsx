import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[#e8e8e8]/70">
          {label}
        </label>
      )}
      <input
        id={inputId}
        {...props}
        className={[
          'input-field',
          error ? '!border-red-500 focus:!ring-red-500/20' : '',
          className,
        ].join(' ')}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  )
}
