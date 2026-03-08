import { useState, useEffect, useRef } from 'react'
import { useDebounce } from '../../hooks/useDebounce'

interface SearchBarProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function SearchBar({
  value = '',
  onChange,
  placeholder = 'Buscar tintas, agujas, máquinas...',
  className = '',
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value)
  const debouncedValue = useDebounce(localValue, 300)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  // Sync debounced value up to parent
  useEffect(() => {
    onChangeRef.current(debouncedValue)
  }, [debouncedValue])

  // Sync external value changes (e.g. clear all filters)
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleClear = () => {
    setLocalValue('')
    onChangeRef.current('')
  }

  return (
    <div className={`relative ${className}`}>
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#e8e8e8]/30 pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>

      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="input-field pl-10 pr-10"
      />

      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#e8e8e8]/40 hover:text-[#e8e8e8] transition-colors"
          aria-label="Limpiar búsqueda"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}
