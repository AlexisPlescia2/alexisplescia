import { useState } from 'react'
import { Category } from '../../types/product'

export interface FilterValues {
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
}

interface FiltersProps {
  categories: Category[]
  values: FilterValues
  onChange: (values: FilterValues) => void
}

const BRANDS = [
  'Eternal Ink',
  'Cheyenne',
  'FK Irons',
  'Bishop',
  'Critical',
  'Hustle Butter',
  'Kwadron',
  'Spirit',
]

export default function Filters({ categories, values, onChange }: FiltersProps) {
  const [priceMin, setPriceMin] = useState(
    values.minPrice !== undefined ? String(values.minPrice) : '',
  )
  const [priceMax, setPriceMax] = useState(
    values.maxPrice !== undefined ? String(values.maxPrice) : '',
  )

  const handleCategory = (slug: string) => {
    onChange({ ...values, category: values.category === slug ? undefined : slug })
  }

  const handleBrand = (brand: string) => {
    onChange({ ...values, brand: values.brand === brand ? undefined : brand })
  }

  const handlePriceApply = () => {
    onChange({
      ...values,
      minPrice: priceMin ? parseFloat(priceMin) : undefined,
      maxPrice: priceMax ? parseFloat(priceMax) : undefined,
    })
  }

  const handleClear = () => {
    setPriceMin('')
    setPriceMax('')
    onChange({})
  }

  const hasActiveFilters =
    values.category || values.brand || values.minPrice || values.maxPrice

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-display tracking-widest text-sm text-[#e8e8e8]">FILTROS</h3>
        {hasActiveFilters && (
          <button
            onClick={handleClear}
            className="text-xs font-mono text-accent hover:text-red-400 transition-colors"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-xs font-mono text-gold/60 uppercase tracking-[0.15em] mb-3">
          Categorías
        </h4>
        <div className="space-y-0.5">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => handleCategory(cat.slug)}
              className={`w-full flex items-center justify-between text-sm font-body px-3 py-2 rounded-md transition-colors ${
                values.category === cat.slug
                  ? 'bg-accent/10 text-accent'
                  : 'text-[#e8e8e8]/60 hover:text-[#e8e8e8] hover:bg-surface'
              }`}
            >
              <span>{cat.name}</span>
              {cat._count && (
                <span className="text-xs opacity-40 font-mono">{cat._count.products}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h4 className="text-xs font-mono text-gold/60 uppercase tracking-[0.15em] mb-3">
          Marcas
        </h4>
        <div className="space-y-0.5">
          {BRANDS.map((brand) => (
            <button
              key={brand}
              onClick={() => handleBrand(brand)}
              className={`w-full text-left text-sm font-body px-3 py-2 rounded-md transition-colors ${
                values.brand === brand
                  ? 'bg-accent/10 text-accent'
                  : 'text-[#e8e8e8]/60 hover:text-[#e8e8e8] hover:bg-surface'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h4 className="text-xs font-mono text-gold/60 uppercase tracking-[0.15em] mb-3">
          Precio (USD)
        </h4>
        <div className="flex gap-2 items-center mb-2">
          <input
            type="number"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            placeholder="Mín"
            min="0"
            className="input-field text-sm py-2"
          />
          <span className="text-[#e8e8e8]/30 flex-shrink-0 font-mono">—</span>
          <input
            type="number"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            placeholder="Máx"
            min="0"
            className="input-field text-sm py-2"
          />
        </div>
        <button onClick={handlePriceApply} className="btn-secondary w-full py-2 text-sm">
          Aplicar precio
        </button>
      </div>
    </div>
  )
}
