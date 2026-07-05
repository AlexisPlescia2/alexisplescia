import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { adminService, AdminCategory } from '../../services/adminService'
import api from '../../services/api'

interface FormData {
  name: string
  description: string
  price: string
  comparePrice: string
  stock: string
  categoryId: string
  brand: string
  projectUrl: string
  githubUrl: string
  featured: boolean
  onSale: boolean
}

const EMPTY: FormData = {
  name: '', description: '', price: '', comparePrice: '', stock: '',
  categoryId: '', brand: '', projectUrl: '', githubUrl: '', featured: false, onSale: false,
}

export default function AdminProductForm() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<FormData>(EMPTY)
  const [images, setImages] = useState<string[]>([])
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    document.title = isEdit ? 'Editar producto — Admin' : 'Nuevo producto — Admin'
    adminService.getCategories().then(setCategories).catch(console.error)

    if (isEdit && id) {
      adminService.getProducts().then((products) => {
        const product = products.find((p) => p.id === id)
        if (product) {
          setForm({
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            comparePrice: product.comparePrice?.toString() || '',
            stock: product.stock.toString(),
            categoryId: product.categoryId,
            brand: product.brand,
            projectUrl: product.projectUrl || '',
            githubUrl: product.githubUrl || '',
            featured: product.featured,
            onSale: product.onSale,
          })
          setImages(product.images)
        }
      })
    }
  }, [id, isEdit])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return

    setUploading(true)
    setError('')
    try {
      const formData = new FormData()
      Array.from(files).forEach((f) => formData.append('images', f))
      const { data } = await api.post<{ urls: string[] }>('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setImages((prev) => [...prev, ...data.urls])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir imágenes')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const moveImage = (from: number, to: number) => {
    setImages((prev) => {
      const next = [...prev]
      const [item] = next.splice(from, 1)
      next.splice(to, 0, item)
      return next
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.name || !form.description || !form.price || !form.stock || !form.categoryId || !form.brand) {
      setError('Completá todos los campos requeridos')
      return
    }

    const price = parseFloat(form.price)
    const stock = parseInt(form.stock)
    if (isNaN(price) || price <= 0) { setError('Precio inválido'); return }
    if (isNaN(stock) || stock < 0) { setError('Stock inválido'); return }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price,
      comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null,
      stock,
      categoryId: form.categoryId,
      brand: form.brand.trim(),
      images,
      projectUrl: form.projectUrl.trim() || null,
      githubUrl: form.githubUrl.trim() || null,
      featured: form.featured,
      onSale: form.onSale,
    }

    setLoading(true)
    try {
      if (isEdit && id) {
        await adminService.updateProduct(id, payload)
        setSuccess('Producto actualizado correctamente')
      } else {
        await adminService.createProduct(payload)
        setSuccess('Producto creado correctamente')
        setTimeout(() => navigate('/admin/products'), 1200)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  const set = (field: keyof FormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/products')} className="text-white/40 hover:text-white transition-colors text-sm">
          ← Volver
        </button>
        <h1 className="font-display text-2xl tracking-widest text-white">
          {isEdit ? 'EDITAR PRODUCTO' : 'NUEVO PRODUCTO'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#0d0d10] border border-white/5 rounded-lg p-6 space-y-5">
        {error && <div className="bg-red-900/20 border border-red-800/30 rounded px-4 py-2 text-sm text-red-400">{error}</div>}
        {success && <div className="bg-green-900/20 border border-green-800/30 rounded px-4 py-2 text-sm text-green-400">{success}</div>}

        <Field label="Nombre *">
          <input className="input-admin" value={form.name} onChange={(e) => set('name', e.target.value)} required />
        </Field>

        <Field label="Descripción *">
          <textarea className="input-admin resize-none h-28" value={form.description} onChange={(e) => set('description', e.target.value)} required />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Precio ARS *">
            <input className="input-admin" type="number" min="0" step="1" value={form.price} onChange={(e) => set('price', e.target.value)} required />
          </Field>
          <Field label="Precio comparación (tachado)">
            <input className="input-admin" type="number" min="0" step="1" value={form.comparePrice} onChange={(e) => set('comparePrice', e.target.value)} placeholder="Opcional" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Stock *">
            <input className="input-admin" type="number" min="0" value={form.stock} onChange={(e) => set('stock', e.target.value)} required />
          </Field>
          <Field label="Marca *">
            <input className="input-admin" value={form.brand} onChange={(e) => set('brand', e.target.value)} required />
          </Field>
        </div>

        <Field label="Categoría *">
          <select className="input-admin" value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)} required>
            <option value="">Seleccioná una categoría</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>

        <Field label="URL de GitHub (botón 'Ver en GitHub')">
          <input
            className="input-admin"
            type="url"
            value={form.githubUrl}
            onChange={(e) => set('githubUrl', e.target.value)}
            placeholder="https://github.com/alexisplescia"
          />
          <p className="text-xs text-white/30 mt-1">Si está vacío el botón no se muestra</p>
        </Field>

        <Field label="URL del proyecto (botón 'Ir a la web')">
          <input
            className="input-admin"
            type="url"
            value={form.projectUrl}
            onChange={(e) => set('projectUrl', e.target.value)}
            placeholder="https://mi-proyecto.vercel.app"
          />
          <p className="text-xs text-white/30 mt-1">Si está vacío el botón no se muestra</p>
        </Field>

        {/* Image uploader */}
        <Field label="Imágenes del producto">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full border border-dashed border-white/15 rounded-lg py-4 text-sm text-white/40 hover:border-white/30 hover:text-white/60 transition-colors disabled:opacity-50"
          >
            {uploading ? 'Subiendo...' : '+ Seleccionar imágenes (JPG, PNG, WebP · máx. 5 MB c/u)'}
          </button>
          <p className="text-xs text-white/30 mt-1">La primera imagen es la principal. Podés reordenar arrastrando.</p>
        </Field>

        {images.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {images.map((url, i) => (
              <div key={url} className="relative group">
                <img
                  src={url}
                  alt=""
                  className="w-20 h-20 object-cover rounded border border-white/10"
                  onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.3' }}
                />
                {i === 0 && (
                  <span className="absolute top-1 left-1 text-[9px] bg-accent text-white px-1 rounded leading-4">principal</span>
                )}
                <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 bg-black/60 rounded transition-opacity">
                  {i > 0 && (
                    <button type="button" onClick={() => moveImage(i, i - 1)} className="text-white/80 hover:text-white text-xs px-1" title="Mover izquierda">
                      ←
                    </button>
                  )}
                  <button type="button" onClick={() => removeImage(i)} className="text-red-400 hover:text-red-300 text-xs px-1" title="Eliminar">
                    ✕
                  </button>
                  {i < images.length - 1 && (
                    <button type="button" onClick={() => moveImage(i, i + 1)} className="text-white/80 hover:text-white text-xs px-1" title="Mover derecha">
                      →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 accent-accent" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} />
            <span className="text-sm text-white/60">Producto destacado</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 accent-accent" checked={form.onSale} onChange={(e) => set('onSale', e.target.checked)} />
            <span className="text-sm text-white/60">En oferta</span>
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => navigate('/admin/products')} className="px-4 py-2 bg-white/10 text-white text-sm rounded hover:bg-white/15 transition-colors">
            Cancelar
          </button>
          <button type="submit" disabled={loading || uploading} className="px-6 py-2 bg-accent text-white text-sm rounded hover:bg-red-700 transition-colors disabled:opacity-50">
            {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear producto'}
          </button>
        </div>
      </form>

      <style>{`
        .input-admin {
          width: 100%;
          background: #070709;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 6px;
          padding: 8px 12px;
          color: #e8e8e8;
          font-size: 14px;
          outline: none;
          transition: border-color 0.15s;
        }
        .input-admin:focus { border-color: #c62828; }
        .input-admin option { background: #0d0d10; }
      `}</style>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-white/40 mb-1.5">{label}</label>
      {children}
    </div>
  )
}
