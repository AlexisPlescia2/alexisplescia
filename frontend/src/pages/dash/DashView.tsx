import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAuthStore } from '../../store/authStore'
import { useAuth } from '../../hooks/useAuth'
import gastosData from '../../data/gastos_2026.json'

const spring = { type: 'spring' as const, stiffness: 300, damping: 26, mass: 0.9 }
const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }

type Gasto = {
  id: string
  fecha: string
  desc: string
  categoria: string
  monto: number
  tipo: string
  mes: string
}

const CATEGORIAS = [
  'Supermercado', 'Vending/Comida', 'Farmacia', 'Combustible', 'Educación',
  'Mercado Libre', 'Suscripciones', 'Créditos MP', 'Pago QR', 'Otros pagos',
  'Transporte', 'Autos/Moto', 'Transferencia enviada', 'Transferencia recibida',
  'Rendimientos', 'Devolución', 'Otros', 'Ingreso',
]

const CAT_COLORS: Record<string, string> = {
  'Supermercado': '#3b82f6', 'Vending/Comida': '#60a5fa', 'Farmacia': '#a78bfa',
  'Combustible': '#f59e0b', 'Educación': '#10b981', 'Mercado Libre': '#f97316',
  'Suscripciones': '#ec4899', 'Créditos MP': '#6366f1', 'Pago QR': '#14b8a6',
  'Otros pagos': '#64748b', 'Otros': '#374151', 'Transporte': '#06b6d4',
  'Autos/Moto': '#84cc16', 'Transferencia enviada': '#ef4444',
  'Transferencia recibida': '#22c55e', 'Rendimientos': '#fbbf24',
  'Devolución': '#a3e635', 'Ingreso': '#4ade80',
}

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril']
const TRANSFERENCIAS = ['Transferencia enviada', 'Transferencia recibida', 'Rendimientos', 'Devolución', 'Ingreso']

function fmtARS(n: number) {
  return '$' + Math.abs(n).toLocaleString('es-AR', { maximumFractionDigits: 0 })
}

function fmtFecha(f: string) {
  const [y, m, d] = f.includes('-') ? (f.length === 10 && f[4] === '-' ? [f.slice(0,4), f.slice(5,7), f.slice(8,10)] : [f.slice(6), f.slice(3,5), f.slice(0,2)]) : ['', '', f]
  return `${d}/${m}`
}

const LS_EDITS = 'dash_edits'
const LS_NEW = 'dash_new'

export default function DashView() {
  const { user } = useAuthStore()
  const { logout } = useAuth()
  const [tab, setTab] = useState<'resumen' | 'movimientos' | 'nuevo'>('resumen')
  const [mesFiltro, setMesFiltro] = useState<string>('Todos')
  const [catFiltro, setCatFiltro] = useState<string>('Todas')
  const [busqueda, setBusqueda] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editCat, setEditCat] = useState('')
  const [edits, setEdits] = useState<Record<string, string>>(() => {
    try { return JSON.parse(localStorage.getItem(LS_EDITS) || '{}') } catch { return {} }
  })
  const [nuevosGastos, setNuevosGastos] = useState<Gasto[]>(() => {
    try { return JSON.parse(localStorage.getItem(LS_NEW) || '[]') } catch { return [] }
  })
  const [form, setForm] = useState({ fecha: '', desc: '', categoria: 'Otros pagos', monto: '', tipo: 'Gasto', mes: 'Mayo' })
  const [saved, setSaved] = useState(false)

  const allGastos: Gasto[] = useMemo(() => {
    const base = (gastosData as Gasto[]).map(g => ({
      ...g,
      categoria: edits[g.id] ?? g.categoria,
    }))
    return [...base, ...nuevosGastos]
  }, [edits, nuevosGastos])

  useEffect(() => { localStorage.setItem(LS_EDITS, JSON.stringify(edits)) }, [edits])
  useEffect(() => { localStorage.setItem(LS_NEW, JSON.stringify(nuevosGastos)) }, [nuevosGastos])

  const gastosFiltrados = useMemo(() => {
    return allGastos.filter(g => {
      if (mesFiltro !== 'Todos' && g.mes !== mesFiltro) return false
      if (catFiltro !== 'Todas' && g.categoria !== catFiltro) return false
      if (busqueda && !g.desc.toLowerCase().includes(busqueda.toLowerCase())) return false
      return true
    })
  }, [allGastos, mesFiltro, catFiltro, busqueda])

  // KPIs por mes seleccionado (o total)
  const kpiData = useMemo(() => {
    const fuente = mesFiltro === 'Todos' ? allGastos : allGastos.filter(g => g.mes === mesFiltro)
    const gastos = fuente.filter(g => g.tipo === 'Gasto' && !TRANSFERENCIAS.includes(g.categoria))
    const ingresos = fuente.filter(g => g.tipo === 'Ingreso' || g.categoria === 'Transferencia recibida')
    const totalGastos = gastos.reduce((s, g) => s + Math.abs(g.monto), 0)
    const totalIngresos = ingresos.reduce((s, g) => s + Math.abs(g.monto), 0)
    const ahorro = totalIngresos - totalGastos
    const tasa = totalIngresos > 0 ? (ahorro / totalIngresos) * 100 : 0
    const dias = mesFiltro === 'Todos' ? 120 : 30
    return { totalGastos, totalIngresos, ahorro, tasa, promDiario: totalGastos / dias }
  }, [allGastos, mesFiltro])

  // Datos por mes para el bar chart
  const porMes = useMemo(() => {
    return [...MESES, ...Array.from(new Set(nuevosGastos.map(g => g.mes)))].map(mes => {
      const g = allGastos.filter(x => x.mes === mes && x.tipo === 'Gasto' && !TRANSFERENCIAS.includes(x.categoria))
      return { mes: mes.slice(0, 3), gastos: g.reduce((s, x) => s + Math.abs(x.monto), 0) }
    })
  }, [allGastos, nuevosGastos])

  // Pie por categoría
  const porCategoria = useMemo(() => {
    const fuente = mesFiltro === 'Todos' ? allGastos : allGastos.filter(g => g.mes === mesFiltro)
    const map: Record<string, number> = {}
    fuente.filter(g => g.tipo === 'Gasto' && !TRANSFERENCIAS.includes(g.categoria))
      .forEach(g => { map[g.categoria] = (map[g.categoria] || 0) + Math.abs(g.monto) })
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value]) => ({ name, value, color: CAT_COLORS[name] || '#555' }))
  }, [allGastos, mesFiltro])

  function saveEdit(id: string) {
    setEdits(prev => ({ ...prev, [id]: editCat }))
    setEditingId(null)
  }

  function addGasto() {
    if (!form.fecha || !form.desc || !form.monto) return
    const nuevo: Gasto = {
      id: `nuevo-${Date.now()}`,
      fecha: form.fecha,
      desc: form.desc,
      categoria: form.categoria,
      monto: form.tipo === 'Gasto' ? -Math.abs(parseFloat(form.monto)) : Math.abs(parseFloat(form.monto)),
      tipo: form.tipo,
      mes: form.mes,
    }
    setNuevosGastos(prev => [...prev, nuevo])
    setForm({ fecha: '', desc: '', categoria: 'Otros pagos', monto: '', tipo: 'Gasto', mes: form.mes })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function deleteGasto(id: string) {
    setNuevosGastos(prev => prev.filter(g => g.id !== id))
  }

  const allMeses = ['Todos', ...MESES, ...Array.from(new Set(nuevosGastos.map(g => g.mes).filter(m => !MESES.includes(m))))]

  return (
    <div className="min-h-screen bg-background text-[#e8e8e8]"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>

      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b border-border"
        style={{ background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-semibold tracking-tight">Finanzas personales</span>
            <span className="text-[#e8e8e8]/20">·</span>
            {(['resumen', 'movimientos', 'nuevo'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${tab === t ? 'text-[#e8e8e8] bg-white/[0.08]' : 'text-[#e8e8e8]/40 hover:text-[#e8e8e8]'}`}>
                {t === 'resumen' ? 'Resumen' : t === 'movimientos' ? 'Movimientos' : '+ Nuevo gasto'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#e8e8e8]/30">{user?.name}</span>
            <button onClick={logout} className="text-xs text-[#e8e8e8]/30 hover:text-[#e8e8e8] transition-colors px-2 py-1 rounded">
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">

        {/* Filtro de mes global */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {allMeses.map(m => (
            <button key={m} onClick={() => setMesFiltro(m)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${mesFiltro === m ? 'border-accent text-accent' : 'border-border text-[#e8e8e8]/40 hover:text-[#e8e8e8]'}`}>
              {m}
            </button>
          ))}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          {[
            { label: 'Gastos reales', value: fmtARS(kpiData.totalGastos) },
            { label: 'Ingresos', value: fmtARS(kpiData.totalIngresos) },
            { label: 'Ahorro neto', value: fmtARS(kpiData.ahorro) },
            { label: 'Tasa de ahorro', value: kpiData.tasa.toFixed(1) + '%' },
            { label: 'Gasto diario prom.', value: fmtARS(kpiData.promDiario) },
          ].map(k => (
            <motion.div key={k.label} className="card-dark p-4" variants={fadeUp} initial="hidden" animate="show" transition={spring}>
              <p className="text-[11px] text-[#e8e8e8]/40 mb-1.5 tracking-wide">{k.label}</p>
              <p className="text-lg font-semibold tracking-tight">{k.value}</p>
            </motion.div>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ── RESUMEN ── */}
          {tab === 'resumen' && (
            <motion.div key="resumen" className="grid grid-cols-1 lg:grid-cols-3 gap-4"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={spring}>

              {/* Bar chart */}
              <div className="card-dark p-6 lg:col-span-2">
                <h3 className="text-sm font-semibold mb-1 tracking-tight">Gastos por mes</h3>
                <p className="text-[11px] text-[#e8e8e8]/35 mb-5">Sin transferencias</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={porMes} barSize={24}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                    <XAxis dataKey="mes" tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v) => fmtARS(Number(v))} contentStyle={{ background: '#1a1a1a', border: '1px solid #222', borderRadius: 10, fontSize: 12 }} />
                    <Bar dataKey="gastos" name="Gastos" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie */}
              <div className="card-dark p-6">
                <h3 className="text-sm font-semibold mb-1 tracking-tight">Por categoría</h3>
                <p className="text-[11px] text-[#e8e8e8]/35 mb-3">{mesFiltro === 'Todos' ? 'Enero–Abril' : mesFiltro}</p>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie data={porCategoria} dataKey="value" cx="50%" cy="50%" innerRadius={38} outerRadius={62} paddingAngle={2}>
                      {porCategoria.map((e) => <Cell key={e.name} fill={e.color} />)}
                    </Pie>
                    <Tooltip formatter={(v) => fmtARS(Number(v))} contentStyle={{ background: '#1a1a1a', border: '1px solid #222', borderRadius: 10, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5 mt-2">
                  {porCategoria.map(c => (
                    <div key={c.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                        <span className="text-[#e8e8e8]/50 truncate max-w-[100px]">{c.name}</span>
                      </div>
                      <span className="text-[#e8e8e8]/70 font-mono">{fmtARS(c.value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Últimos 10 movimientos */}
              <div className="card-dark lg:col-span-3">
                <div className="px-5 py-3 border-b border-border">
                  <h3 className="text-sm font-semibold tracking-tight">Últimos movimientos</h3>
                </div>
                <div className="divide-y divide-border">
                  {allGastos.filter(g => g.tipo === 'Gasto').slice(-10).reverse().map(g => (
                    <div key={g.id} className="px-5 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[#e8e8e8]/80">{g.desc}</p>
                        <p className="text-[11px] text-[#e8e8e8]/35 mt-0.5">
                          <span className="inline-block px-1.5 py-0.5 rounded text-[10px]" style={{ background: (CAT_COLORS[g.categoria] || '#555') + '22', color: CAT_COLORS[g.categoria] || '#aaa' }}>
                            {g.categoria}
                          </span>
                          <span className="ml-2">{fmtFecha(g.fecha)} · {g.mes}</span>
                        </p>
                      </div>
                      <span className="text-sm font-medium text-red-400">{fmtARS(g.monto)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── MOVIMIENTOS ── */}
          {tab === 'movimientos' && (
            <motion.div key="movimientos" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={spring}>
              {/* Filtros */}
              <div className="flex gap-2 mb-4 flex-wrap">
                <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar..."
                  className="bg-surface border border-border rounded-lg px-3 py-1.5 text-xs text-[#e8e8e8] placeholder-[#e8e8e8]/30 outline-none focus:border-accent/50 w-48" />
                <select value={catFiltro} onChange={e => setCatFiltro(e.target.value)}
                  className="bg-surface border border-border rounded-lg px-3 py-1.5 text-xs text-[#e8e8e8] outline-none focus:border-accent/50">
                  <option value="Todas">Todas las categorías</option>
                  {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <span className="text-xs text-[#e8e8e8]/30 self-center ml-2">{gastosFiltrados.length} movimientos</span>
              </div>

              <div className="card-dark overflow-hidden">
                <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
                  {gastosFiltrados.map(g => (
                    <div key={g.id} className="px-5 py-3 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#e8e8e8]/80 truncate">{g.desc}</p>
                        <p className="text-[11px] text-[#e8e8e8]/35 mt-0.5">{fmtFecha(g.fecha)} · {g.mes}</p>
                      </div>

                      {/* Categoría editable */}
                      {editingId === g.id ? (
                        <div className="flex items-center gap-2 shrink-0">
                          <select value={editCat} onChange={e => setEditCat(e.target.value)}
                            className="bg-surface border border-accent/50 rounded px-2 py-1 text-xs text-[#e8e8e8] outline-none">
                            {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                          <button onClick={() => saveEdit(g.id)} className="text-xs text-accent hover:text-blue-300 px-2 py-1">✓</button>
                          <button onClick={() => setEditingId(null)} className="text-xs text-[#e8e8e8]/30 hover:text-[#e8e8e8] px-1">✕</button>
                        </div>
                      ) : (
                        <button onClick={() => { setEditingId(g.id); setEditCat(g.categoria) }}
                          className="text-[11px] px-2 py-0.5 rounded shrink-0 transition-colors hover:opacity-80 cursor-pointer"
                          style={{ background: (CAT_COLORS[g.categoria] || '#555') + '22', color: CAT_COLORS[g.categoria] || '#aaa' }}>
                          {g.categoria}
                        </button>
                      )}

                      <span className={`text-sm font-medium shrink-0 ${g.tipo === 'Ingreso' ? 'text-green-400' : 'text-[#e8e8e8]/70'}`}>
                        {g.tipo === 'Ingreso' ? '+' : ''}{fmtARS(g.monto)}
                      </span>

                      {g.id.startsWith('nuevo-') && (
                        <button onClick={() => deleteGasto(g.id)} className="text-[#e8e8e8]/20 hover:text-red-400 text-xs transition-colors">✕</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── NUEVO GASTO ── */}
          {tab === 'nuevo' && (
            <motion.div key="nuevo" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={spring}
              className="max-w-lg">
              <div className="card-dark p-6">
                <h3 className="text-sm font-semibold mb-5 tracking-tight">Agregar gasto</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-[#e8e8e8]/40 block mb-1.5">Fecha</label>
                      <input type="date" value={form.fecha} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))}
                        className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-[#e8e8e8] outline-none focus:border-accent/50" />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#e8e8e8]/40 block mb-1.5">Mes</label>
                      <input value={form.mes} onChange={e => setForm(f => ({ ...f, mes: e.target.value }))}
                        placeholder="Mayo, Junio..."
                        className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-[#e8e8e8] placeholder-[#e8e8e8]/20 outline-none focus:border-accent/50" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-[#e8e8e8]/40 block mb-1.5">Descripción</label>
                    <input value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
                      placeholder="Ej: Supermercado Coto"
                      className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-[#e8e8e8] placeholder-[#e8e8e8]/20 outline-none focus:border-accent/50" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-[#e8e8e8]/40 block mb-1.5">Categoría</label>
                      <select value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}
                        className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-[#e8e8e8] outline-none focus:border-accent/50">
                        {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] text-[#e8e8e8]/40 block mb-1.5">Tipo</label>
                      <select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}
                        className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-[#e8e8e8] outline-none focus:border-accent/50">
                        <option value="Gasto">Gasto</option>
                        <option value="Ingreso">Ingreso</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-[#e8e8e8]/40 block mb-1.5">Monto ($)</label>
                    <input type="number" value={form.monto} onChange={e => setForm(f => ({ ...f, monto: e.target.value }))}
                      placeholder="0"
                      className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-[#e8e8e8] placeholder-[#e8e8e8]/20 outline-none focus:border-accent/50" />
                  </div>

                  <motion.button onClick={addGasto} whileTap={{ scale: 0.97 }} transition={spring}
                    className="w-full btn-primary py-2.5 text-sm">
                    {saved ? '✓ Guardado' : 'Agregar gasto'}
                  </motion.button>
                </div>
              </div>

              {/* Lista de gastos nuevos agregados */}
              {nuevosGastos.length > 0 && (
                <div className="card-dark mt-4 overflow-hidden">
                  <div className="px-5 py-3 border-b border-border">
                    <h4 className="text-xs font-semibold text-[#e8e8e8]/60 tracking-wide uppercase">Gastos agregados</h4>
                  </div>
                  <div className="divide-y divide-border">
                    {nuevosGastos.map(g => (
                      <div key={g.id} className="px-5 py-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm text-[#e8e8e8]/80">{g.desc}</p>
                          <p className="text-[11px] text-[#e8e8e8]/35 mt-0.5">{g.categoria} · {g.mes}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-sm font-medium ${g.tipo === 'Ingreso' ? 'text-green-400' : 'text-[#e8e8e8]/70'}`}>
                            {fmtARS(g.monto)}
                          </span>
                          <button onClick={() => deleteGasto(g.id)} className="text-[#e8e8e8]/20 hover:text-red-400 text-xs transition-colors">✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  )
}
