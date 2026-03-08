interface QuantitySelectorProps {
  value: number
  min?: number
  max?: number
  onChange: (value: number) => void
  disabled?: boolean
}

export default function QuantitySelector({
  value,
  min = 1,
  max = 99,
  onChange,
  disabled = false,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center border border-white/10 rounded overflow-hidden">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={disabled || value <= min}
        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        −
      </button>
      <span className="w-10 text-center text-sm text-white font-mono">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={disabled || value >= max}
        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        +
      </button>
    </div>
  )
}
