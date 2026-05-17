import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { useAuthStore } from '../../store/authStore'
import { useAuth } from '../../hooks/useAuth'
import gastosData from '../../data/gastos_2026.json'

const PORTFOLIO_URL = (import.meta.env.VITE_PORTFOLIO_URL as string) || '/'
const CURRENT_YEAR = new Date().getFullYear()

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
  seriesId?: string
}

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const CATEGORIAS = [
  'Supermercado', 'Vending/Comida', 'Farmacia', 'Combustible', 'Educación',
  'Mercado Libre', 'Suscripciones', 'Créditos MP', 'Pago QR', 'Otros pagos',
  'Transporte', 'Autos/Moto', 'Transferencia enviada', 'Transferencia recibida',
  'Rendimientos', 'Devolución', 'Otros', 'Ingreso', 'Deuda', 'Ahorros',
]

const CAT_COLORS: Record<string, string> = {
  'Supermercado': '#3b82f6', 'Vending/Comida': '#60a5fa', 'Farmacia': '#a78bfa',
  'Combustible': '#f59e0b', 'Educación': '#10b981', 'Mercado Libre': '#f97316',
  'Suscripciones': '#ec4899', 'Créditos MP': '#6366f1', 'Pago QR': '#14b8a6',
  'Otros pagos': '#64748b', 'Otros': '#881337', 'Transporte': '#06b6d4',
  'Autos/Moto': '#84cc16', 'Transferencia enviada': '#ef4444',
  'Transferencia recibida': '#22c55e', 'Rendimientos': '#fbbf24',
  'Devolución': '#a3e635', 'Ingreso': '#4ade80',
  'Deuda': '#f43f5e', 'Ahorros': '#22d3ee',
}

const TRANSFERENCIAS = [
  'Transferencia enviada', 'Transferencia recibida', 'Rendimientos', 'Devolución', 'Ingreso',
]

function fmtARS(n: number) {
  return '$' + Math.abs(n).toLocaleString('es-AR', { maximumFractionDigits: 0 })
}

function fmtFecha(f: string) {
  const parts = f.length === 10 && f[4] === '-'
    ? [f.slice(0, 4), f.slice(5, 7), f.slice(8, 10)]
    : [f.slice(6), f.slice(3, 5), f.slice(0, 2)]
  return `${parts[2]}/${parts[1]}`
}

function isPaid(id: string, pagados: Record<string, boolean>) {
  return pagados[id] !== undefined ? pagados[id] : true
}

// Botón pagado definido fuera del componente principal para evitar remounts
function PagadoBtn({
  id, pagados, onToggle,
}: {
  id: string
  pagados: Record<string, boolean>
  onToggle: (id: string) => void
}) {
  const paid = isPaid(id, pagados)
  return (
    <motion.button
      onClick={() => onToggle(id)}
      whileTap={{ scale: 0.82 }}
      title={paid ? 'Marcar como pendiente' : 'Marcar como pagado'}
      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all shrink-0 ${
        paid
          ? 'bg-green-500/15 border-green-500/40 text-green-400'
          : 'border-[#e8e8e8]/20 text-[#e8e8e8]/0 hover:border-[#e8e8e8]/40 hover:text-[#e8e8e8]/25'
      }`}
    >
      <span className="text-[9px] leading-none select-none">✓</span>
    </motion.button>
  )
}

// Badge de serie multi-mes
function SerieBadge() {
  return (
    <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/20 shrink-0">
      serie
    </span>
  )
}

const LS_EDITS = 'dash_edits'
const LS_NEW = 'dash_new'
const LS_PAGADO = 'dash_pagado'

export default function DashView() {
  const { user } = useAuthStore()
  const { logout } = useAuth()

  const [tab, setTab] = useState<'resumen' | 'movimientos' | 'nuevo'>('resumen')
  const [mesFiltro, setMesFiltro] = useState('Todos')
  const [catFiltro, setCatFiltro] = useState('Todas')
  const [busqueda, setBusqueda] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editCat, setEditCat] = useState('')
  const [deudaVista, setDeudaVista] = useState<'nopagadas' | 'pagadas'>('nopagadas')

  const [edits, setEdits] = useState<Record<string, string>>(() => {
    try { return JSON.parse(localStorage.getItem(LS_EDITS) || '{}') } catch { return {} }
  })
  const [nuevosGastos, setNuevosGastos] = useState<Gasto[]>(() => {
    try { return JSON.parse(localStorage.getItem(LS_NEW) || '[]') } catch { return [] }
  })
  const [pagados, setPagados] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem(LS_PAGADO) || '{}') } catch { return {} }
  })

  const [form, setForm] = useState({
    desc: '',
    categoria: 'Otros pagos',
    monto: '',
    tipo: 'Gasto',
    mes: MESES[new Date().getMonth()],
    anio: CURRENT_YEAR,
    multiMes: false,
    mesesSeleccionados: [] as string[],
  })
  const [saved, setSaved] = useState(false)

  function togglePagado(id: string) {
    setPagados(prev => ({ ...prev, [id]: !isPaid(id, prev) }))
  }

  const allGastos: Gasto[] = useMemo(() => {
    const base = (gastosData as Gasto[]).map(g => ({
      ...g,
      categoria: edits[g.id] ?? g.categoria,
    }))
    return [...base, ...nuevosGastos]
  }, [edits, nuevosGastos])

  useEffect(() => { localStorage.setItem(LS_EDITS, JSON.stringify(edits)) }, [edits])
  useEffect(() => { localStorage.setItem(LS_NEW, JSON.stringify(nuevosGastos)) }, [nuevosGastos])
  useEffect(() => { localStorage.setItem(LS_PAGADO, JSON.stringify(pagados)) }, [pagados])

  const gastosFiltrados = useMemo(() => {
    return allGastos.filter(g => {
      if (mesFiltro !== 'Todos' && g.mes !== mesFiltro) return false
      if (catFiltro !== 'Todas' && g.categoria !== catFiltro) return false
      if (busqueda && !g.desc.toLowerCase().includes(busqueda.toLowerCase())) return false
      return true
    })
  }, [allGastos, mesFiltro, catFiltro, busqueda])

  const kpi = useMemo(() => {
    const fuente = mesFiltro === 'Todos' ? allGastos : allGastos.filter(g => g.mes === mesFiltro)

    const gastosOp = fuente.filter(g => g.tipo === 'Gasto' && !TRANSFERENCIAS.includes(g.categoria))
    const pagadosList = gastosOp.filter(g => isPaid(g.id, pagados))
    const pendientesList = gastosOp.filter(g => !isPaid(g.id, pagados))

    const ingresosList = fuente.filter(g => g.tipo === 'Ingreso' || g.categoria === 'Transferencia recibida')
    const ahorrosList = fuente.filter(g => g.categoria === 'Ahorros')
    const deudasList = fuente.filter(g => g.categoria === 'Deuda')

    const totalGastos = pagadosList.reduce((s, g) => s + Math.abs(g.monto), 0)
    const totalPendiente = pendientesList.reduce((s, g) => s + Math.abs(g.monto), 0)
    const totalTodos = totalGastos + totalPendiente
    const totalIngresos = ingresosList.reduce((s, g) => s + Math.abs(g.monto), 0)
    const saldo = totalIngresos - totalGastos
    const pctPendiente = totalTodos > 0 ? (totalPendiente / totalTodos) * 100 : 0
    const totalAhorros = ahorrosList.reduce((s, g) => s + Math.abs(g.monto), 0)
    const deudasNoPagadas = deudasList.filter(g => !isPaid(g.id, pagados)).reduce((s, g) => s + Math.abs(g.monto), 0)
    const deudasPagadas = deudasList.filter(g => isPaid(g.id, pagados)).reduce((s, g) => s + Math.abs(g.monto), 0)
    // No pagados excluyendo deudas (solo visible en "Todos")
    const pendienteSinDeudas = pendientesList
      .filter(g => g.categoria !== 'Deuda')
      .reduce((s, g) => s + Math.abs(g.monto), 0)

    return { totalGastos, totalIngresos, saldo, pctPendiente, totalAhorros, deudasPagadas, deudasNoPagadas, pendienteSinDeudas }
  }, [allGastos, mesFiltro, pagados])

  const porMes = useMemo(() => {
    return MESES.map(mes => {
      const g = allGastos.filter(x =>
        x.mes === mes && x.tipo === 'Gasto' &&
        !TRANSFERENCIAS.includes(x.categoria) &&
        isPaid(x.id, pagados)
      )
      return { mes: mes.slice(0, 3), gastos: g.reduce((s, x) => s + Math.abs(x.monto), 0) }
    })
  }, [allGastos, pagados])

  const porCategoria = useMemo(() => {
    const fuente = mesFiltro === 'Todos' ? allGastos : allGastos.filter(g => g.mes === mesFiltro)
    const map: Record<string, number> = {}
    fuente
      .filter(g => g.tipo === 'Gasto' && !TRANSFERENCIAS.includes(g.categoria))
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

  function toggleMes(mes: string) {
    setForm(f => ({
      ...f,
      mesesSeleccionados: f.mesesSeleccionados.includes(mes)
        ? f.mesesSeleccionados.filter(m => m !== mes)
        : [...f.mesesSeleccionados, mes],
    }))
  }

  function addGasto() {
    if (!form.desc || !form.monto) return
    const mesesTarget = form.multiMes && form.mesesSeleccionados.length > 0
      ? form.mesesSeleccionados
      : [form.mes]
    const seriesId = mesesTarget.length > 1 ? `series-${Date.now()}` : undefined
    const ts = Date.now()

    const nuevos: Gasto[] = mesesTarget.map((mes, i) => {
      const mesIdx = MESES.indexOf(mes) + 1
      return {
        id: `nuevo-${ts}-${i}`,
        fecha: `${form.anio}-${String(mesIdx).padStart(2, '0')}-01`,
        desc: form.desc,
        categoria: form.categoria,
        monto: form.tipo === 'Gasto'
          ? -Math.abs(parseFloat(form.monto))
          : Math.abs(parseFloat(form.monto)),
        tipo: form.tipo,
        mes,
        ...(seriesId ? { seriesId } : {}),
      }
    })

    setNuevosGastos(prev => [...prev, ...nuevos])
    setForm(f => ({ ...f, desc: '', monto: '', multiMes: false, mesesSeleccionados: [] }))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function deleteGasto(id: string) {
    setNuevosGastos(prev => prev.filter(g => g.id !== id))
  }

  const chartTooltipStyle = {
    background: '#1a1a1a', border: '1px solid #222', borderRadius: 10, fontSize: 12,
  }

  return (
    <div
      className="min-h-screen bg-background text-[#e8e8e8]"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
    >
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-40 border-b border-border"
        style={{ background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(20px)' }}
      >
        <div className="w-full px-4 lg:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            <a
              href={PORTFOLIO_URL}
              className="text-xs text-[#e8e8e8]/40 hover:text-[#e8e8e8] transition-colors flex items-center gap-1"
            >
              <span>←</span>
              <span className="hidden sm:inline">Portfolio</span>
            </a>
            <span className="text-[#e8e8e8]/20 hidden sm:inline">·</span>
            <span className="text-sm font-semibold tracking-tight">Finanzas personales</span>
            <span className="text-[#e8e8e8]/20">·</span>
            {(['resumen', 'movimientos', 'nuevo'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  tab === t
                    ? 'text-[#e8e8e8] bg-white/[0.08]'
                    : 'text-[#e8e8e8]/40 hover:text-[#e8e8e8]'
                }`}
              >
                {t === 'resumen' ? 'Resumen' : t === 'movimientos' ? 'Movimientos' : '+ Nuevo gasto'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#e8e8e8]/30">{user?.name}</span>
            <button
              onClick={logout}
              className="text-xs text-[#e8e8e8]/30 hover:text-[#e8e8e8] transition-colors px-2 py-1 rounded"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="w-full px-4 lg:px-6 py-6">

        {/* ── Filtro mes ── */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['Todos', ...MESES].map(m => (
            <button
              key={m}
              onClick={() => setMesFiltro(m)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                mesFiltro === m
                  ? 'border-accent text-accent'
                  : 'border-border text-[#e8e8e8]/40 hover:text-[#e8e8e8]'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* ── 6 KPI Cards ── */}
        <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 ${mesFiltro === 'Todos' ? 'lg:grid-cols-7' : 'lg:grid-cols-6'}`}>

          {/* 1 — Gastos */}
          <motion.div className="card-dark p-4" variants={fadeUp} initial="hidden" animate="show" transition={spring}>
            <p className="text-[11px] text-[#e8e8e8]/40 mb-1.5 tracking-wide">Gastos</p>
            <p className="text-lg font-semibold font-mono tracking-tight text-red-400">
              {fmtARS(kpi.totalGastos)}
            </p>
          </motion.div>

          {/* 2 — Ingresos */}
          <motion.div className="card-dark p-4" variants={fadeUp} initial="hidden" animate="show" transition={spring}>
            <p className="text-[11px] text-[#e8e8e8]/40 mb-1.5 tracking-wide">Ingresos</p>
            <p className="text-lg font-semibold font-mono tracking-tight text-green-400">
              {fmtARS(kpi.totalIngresos)}
            </p>
          </motion.div>

          {/* 3 — Saldo disponible */}
          <motion.div className="card-dark p-4" variants={fadeUp} initial="hidden" animate="show" transition={spring}>
            <p className="text-[11px] text-[#e8e8e8]/40 mb-1.5 tracking-wide leading-tight">Saldo disponible</p>
            <p className={`text-lg font-semibold font-mono tracking-tight ${kpi.saldo >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
              {fmtARS(kpi.saldo)}
            </p>
          </motion.div>

          {/* 4 — Deudas (interactiva: hover dock + click flip) */}
          <motion.div
            className="card-dark p-4 cursor-pointer select-none"
            variants={fadeUp} initial="hidden" animate="show" transition={spring}
            whileHover={{
              scale: 1.04,
              boxShadow: '0 0 0 1px rgba(244,63,94,0.18), 0 8px 24px rgba(244,63,94,0.10), 0 2px 8px rgba(0,0,0,0.5)',
            }}
            onClick={() => setDeudaVista(v => v === 'nopagadas' ? 'pagadas' : 'nopagadas')}
          >
            <p className="text-[11px] text-[#e8e8e8]/40 mb-1.5 tracking-wide">Deudas</p>
            <AnimatePresence mode="wait">
              <motion.div
                key={deudaVista}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.16 }}
              >
                <p className={`text-lg font-semibold font-mono tracking-tight ${deudaVista === 'pagadas' ? 'text-green-400' : 'text-rose-400'}`}>
                  {fmtARS(deudaVista === 'nopagadas' ? kpi.deudasNoPagadas : kpi.deudasPagadas)}
                </p>
                <p className="text-[10px] text-[#e8e8e8]/25 mt-0.5 leading-tight">
                  {deudaVista === 'nopagadas' ? 'pendientes' : 'pagadas'}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* 5 — % Pendiente */}
          <motion.div className="card-dark p-4" variants={fadeUp} initial="hidden" animate="show" transition={spring}>
            <p className="text-[11px] text-[#e8e8e8]/40 mb-1.5 tracking-wide leading-tight">% Pendiente</p>
            <p className={`text-lg font-semibold font-mono tracking-tight ${kpi.pctPendiente > 20 ? 'text-orange-400' : 'text-[#e8e8e8]/80'}`}>
              {kpi.pctPendiente.toFixed(1)}%
            </p>
          </motion.div>

          {/* 6 — Ahorros */}
          <motion.div className="card-dark p-4" variants={fadeUp} initial="hidden" animate="show" transition={spring}>
            <p className="text-[11px] text-[#e8e8e8]/40 mb-1.5 tracking-wide">Ahorros</p>
            <p className="text-lg font-semibold font-mono tracking-tight text-cyan-400">
              {fmtARS(kpi.totalAhorros)}
            </p>
          </motion.div>

          {/* 7 — Pendiente sin deudas (solo visible en "Todos") */}
          <AnimatePresence>
            {mesFiltro === 'Todos' && (
              <motion.div
                className="card-dark p-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={spring}
              >
                <p className="text-[11px] text-[#e8e8e8]/40 mb-1.5 tracking-wide leading-tight">Pendiente anual</p>
                <p className="text-lg font-semibold font-mono tracking-tight text-orange-400">
                  {fmtARS(kpi.pendienteSinDeudas)}
                </p>
                <p className="text-[10px] text-[#e8e8e8]/25 mt-0.5">sin deudas</p>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* ── Tabs ── */}
        <AnimatePresence mode="wait">

          {/* RESUMEN */}
          {tab === 'resumen' && (
            <motion.div
              key="resumen"
              className="grid grid-cols-1 lg:grid-cols-3 gap-4"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={spring}
            >
              <div className="card-dark p-6 lg:col-span-2">
                <h3 className="text-sm font-semibold mb-1 tracking-tight">Gastos por mes</h3>
                <p className="text-[11px] text-[#e8e8e8]/35 mb-5">Solo pagados · sin transferencias</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={porMes} barSize={18}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                    <XAxis dataKey="mes" tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={v => fmtARS(Number(v))} contentStyle={chartTooltipStyle} />
                    <Bar dataKey="gastos" name="Gastos" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="card-dark p-6">
                <h3 className="text-sm font-semibold mb-1 tracking-tight">Por categoría</h3>
                <p className="text-[11px] text-[#e8e8e8]/35 mb-3">
                  {mesFiltro === 'Todos' ? 'Todo el año' : mesFiltro}
                </p>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie data={porCategoria} dataKey="value" cx="50%" cy="50%" innerRadius={38} outerRadius={62} paddingAngle={2}>
                      {porCategoria.map(e => <Cell key={e.name} fill={e.color} />)}
                    </Pie>
                    <Tooltip formatter={v => fmtARS(Number(v))} contentStyle={chartTooltipStyle} />
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

              <div className="card-dark lg:col-span-3">
                <div className="px-5 py-3 border-b border-border">
                  <h3 className="text-sm font-semibold tracking-tight">Últimos movimientos</h3>
                </div>
                <div className="divide-y divide-border">
                  {allGastos.filter(g => g.tipo === 'Gasto').slice(-10).reverse().map(g => (
                    <div key={g.id} className="px-5 py-3 flex items-center gap-3">
                      <PagadoBtn id={g.id} pagados={pagados} onToggle={togglePagado} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-[#e8e8e8]/80 truncate">{g.desc}</p>
                          {g.seriesId && <SerieBadge />}
                        </div>
                        <p className="text-[11px] text-[#e8e8e8]/35 mt-0.5">
                          <span
                            className="inline-block px-1.5 py-0.5 rounded text-[10px]"
                            style={{ background: (CAT_COLORS[g.categoria] || '#555') + '22', color: CAT_COLORS[g.categoria] || '#aaa' }}
                          >
                            {g.categoria}
                          </span>
                          <span className="ml-2">{fmtFecha(g.fecha)} · {g.mes}</span>
                        </p>
                      </div>
                      <span className={`text-sm font-medium font-mono shrink-0 ${isPaid(g.id, pagados) ? 'text-red-400' : 'text-[#e8e8e8]/25'}`}>
                        {fmtARS(g.monto)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* MOVIMIENTOS */}
          {tab === 'movimientos' && (
            <motion.div
              key="movimientos"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={spring}
            >
              <div className="flex gap-2 mb-4 flex-wrap">
                <input
                  value={busqueda}
                  onChange={e => setBusqueda(e.target.value)}
                  placeholder="Buscar..."
                  className="bg-surface border border-border rounded-lg px-3 py-1.5 text-xs text-[#e8e8e8] placeholder-[#e8e8e8]/30 outline-none focus:border-accent/50 w-48"
                />
                <select
                  value={catFiltro}
                  onChange={e => setCatFiltro(e.target.value)}
                  className="bg-surface border border-border rounded-lg px-3 py-1.5 text-xs text-[#e8e8e8] outline-none focus:border-accent/50"
                >
                  <option value="Todas">Todas las categorías</option>
                  {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <span className="text-xs text-[#e8e8e8]/30 self-center ml-2">
                  {gastosFiltrados.length} movimientos
                </span>
              </div>

              <div className="card-dark overflow-hidden">
                <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
                  {gastosFiltrados.map(g => (
                    <div key={g.id} className="px-4 py-3 flex items-center gap-3">
                      <PagadoBtn id={g.id} pagados={pagados} onToggle={togglePagado} />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-[#e8e8e8]/80 truncate">{g.desc}</p>
                          {g.seriesId && <SerieBadge />}
                        </div>
                        <p className="text-[11px] text-[#e8e8e8]/35 mt-0.5">{fmtFecha(g.fecha)} · {g.mes}</p>
                      </div>

                      {editingId === g.id ? (
                        <div className="flex items-center gap-2 shrink-0">
                          <select
                            value={editCat}
                            onChange={e => setEditCat(e.target.value)}
                            className="bg-surface border border-accent/50 rounded px-2 py-1 text-xs text-[#e8e8e8] outline-none"
                          >
                            {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                          <button onClick={() => saveEdit(g.id)} className="text-xs text-accent hover:text-blue-300 px-2 py-1">✓</button>
                          <button onClick={() => setEditingId(null)} className="text-xs text-[#e8e8e8]/30 hover:text-[#e8e8e8] px-1">✕</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setEditingId(g.id); setEditCat(g.categoria) }}
                          className="text-[11px] px-2 py-0.5 rounded shrink-0 transition-colors hover:opacity-80 cursor-pointer"
                          style={{ background: (CAT_COLORS[g.categoria] || '#555') + '22', color: CAT_COLORS[g.categoria] || '#aaa' }}
                        >
                          {g.categoria}
                        </button>
                      )}

                      <span className={`text-sm font-medium font-mono shrink-0 ${
                        g.tipo === 'Ingreso'
                          ? 'text-green-400'
                          : isPaid(g.id, pagados) ? 'text-[#e8e8e8]/70' : 'text-[#e8e8e8]/25'
                      }`}>
                        {g.tipo === 'Ingreso' ? '+' : ''}{fmtARS(g.monto)}
                      </span>

                      {g.id.startsWith('nuevo-') && (
                        <button
                          onClick={() => deleteGasto(g.id)}
                          className="text-[#e8e8e8]/20 hover:text-red-400 text-xs transition-colors shrink-0"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* NUEVO GASTO */}
          {tab === 'nuevo' && (
            <motion.div
              key="nuevo"
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={spring}
            >
              {/* Columna izquierda: formulario */}
              <div>
                <div className="card-dark p-6">
                  <h3 className="text-sm font-semibold mb-5 tracking-tight">Agregar gasto</h3>
                  <div className="space-y-4">

                    {/* Mes + Año */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-[#e8e8e8]/40 block mb-1.5">Mes</label>
                        <select
                          value={form.mes}
                          onChange={e => setForm(f => ({ ...f, mes: e.target.value }))}
                          className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-[#e8e8e8] outline-none focus:border-accent/50"
                        >
                          {MESES.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] text-[#e8e8e8]/40 block mb-1.5">Año</label>
                        <select
                          value={form.anio}
                          onChange={e => setForm(f => ({ ...f, anio: parseInt(e.target.value) }))}
                          className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-[#e8e8e8] outline-none focus:border-accent/50"
                        >
                          {[CURRENT_YEAR - 1, CURRENT_YEAR, CURRENT_YEAR + 1].map(y =>
                            <option key={y} value={y}>{y}</option>
                          )}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-[#e8e8e8]/40 block mb-1.5">Descripción</label>
                      <input
                        value={form.desc}
                        onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
                        placeholder="Ej: Supermercado Coto"
                        className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-[#e8e8e8] placeholder-[#e8e8e8]/20 outline-none focus:border-accent/50"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-[#e8e8e8]/40 block mb-1.5">Categoría</label>
                        <select
                          value={form.categoria}
                          onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}
                          className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-[#e8e8e8] outline-none focus:border-accent/50"
                        >
                          {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] text-[#e8e8e8]/40 block mb-1.5">Tipo</label>
                        <select
                          value={form.tipo}
                          onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}
                          className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-[#e8e8e8] outline-none focus:border-accent/50"
                        >
                          <option value="Gasto">Gasto</option>
                          <option value="Ingreso">Ingreso</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-[#e8e8e8]/40 block mb-1.5">Monto ($)</label>
                      <input
                        type="number"
                        value={form.monto}
                        onChange={e => setForm(f => ({ ...f, monto: e.target.value }))}
                        placeholder="0"
                        className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-[#e8e8e8] placeholder-[#e8e8e8]/20 outline-none focus:border-accent/50"
                      />
                    </div>

                    {/* Multi-mes toggle */}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.multiMes}
                        onChange={e => setForm(f => ({ ...f, multiMes: e.target.checked, mesesSeleccionados: [] }))}
                        className="rounded border-border accent-blue-500"
                      />
                      <span className="text-xs text-[#e8e8e8]/50 select-none">Repetir en varios meses</span>
                    </label>

                    {/* Chips meses */}
                    <AnimatePresence>
                      {form.multiMes && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="text-[11px] text-[#e8e8e8]/40 mb-2">Seleccioná los meses</p>
                          <div className="flex flex-wrap gap-1.5">
                            {MESES.map(m => (
                              <button
                                key={m}
                                type="button"
                                onClick={() => toggleMes(m)}
                                className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                                  form.mesesSeleccionados.includes(m)
                                    ? 'border-accent bg-accent/10 text-accent'
                                    : 'border-border text-[#e8e8e8]/40 hover:text-[#e8e8e8]'
                                }`}
                              >
                                {m.slice(0, 3)}
                              </button>
                            ))}
                          </div>
                          {form.mesesSeleccionados.length > 1 && (
                            <p className="text-[10px] text-[#e8e8e8]/30 mt-2">
                              Se crearán {form.mesesSeleccionados.length} registros · todos con badge «serie»
                            </p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.button
                      onClick={addGasto}
                      whileTap={{ scale: 0.97 }}
                      transition={spring}
                      className="w-full btn-primary py-2.5 text-sm"
                    >
                      {saved
                        ? '✓ Guardado'
                        : form.multiMes && form.mesesSeleccionados.length > 1
                          ? `Agregar en ${form.mesesSeleccionados.length} meses`
                          : 'Agregar gasto'}
                    </motion.button>
                  </div>
                </div>

                {/* Gastos agregados */}
                {nuevosGastos.length > 0 && (
                  <div className="card-dark mt-4 overflow-hidden">
                    <div className="px-5 py-3 border-b border-border">
                      <h4 className="text-xs font-semibold text-[#e8e8e8]/60 tracking-wide uppercase">
                        Gastos agregados
                      </h4>
                    </div>
                    <div className="divide-y divide-border">
                      {nuevosGastos.map(g => (
                        <div key={g.id} className="px-4 py-3 flex items-center gap-3">
                          <PagadoBtn id={g.id} pagados={pagados} onToggle={togglePagado} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-[#e8e8e8]/80 truncate">{g.desc}</p>
                              {g.seriesId && <SerieBadge />}
                            </div>
                            <p className="text-[11px] text-[#e8e8e8]/35 mt-0.5">{g.categoria} · {g.mes}</p>
                          </div>
                          <span className={`text-sm font-medium font-mono ${
                            g.tipo === 'Ingreso' ? 'text-green-400' : isPaid(g.id, pagados) ? 'text-[#e8e8e8]/70' : 'text-[#e8e8e8]/25'
                          }`}>
                            {fmtARS(g.monto)}
                          </span>
                          <button
                            onClick={() => deleteGasto(g.id)}
                            className="text-[#e8e8e8]/20 hover:text-red-400 text-xs transition-colors shrink-0"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Columna derecha: mini-dashboard */}
              <div className="space-y-4">
                <div className="card-dark p-5">
                  <h3 className="text-sm font-semibold mb-1 tracking-tight">Gastos por mes</h3>
                  <p className="text-[11px] text-[#e8e8e8]/35 mb-4">Solo pagados</p>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={porMes} barSize={14}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                      <XAxis dataKey="mes" tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={v => fmtARS(Number(v))} contentStyle={chartTooltipStyle} />
                      <Bar dataKey="gastos" name="Gastos" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="card-dark p-5">
                  <h3 className="text-sm font-semibold mb-1 tracking-tight">Por categoría</h3>
                  <p className="text-[11px] text-[#e8e8e8]/35 mb-3">
                    {mesFiltro === 'Todos' ? 'Todo el año' : mesFiltro}
                  </p>
                  <div className="flex gap-4 items-center">
                    <div className="shrink-0">
                      <ResponsiveContainer width={110} height={110}>
                        <PieChart>
                          <Pie data={porCategoria} dataKey="value" cx="50%" cy="50%" innerRadius={30} outerRadius={52} paddingAngle={2}>
                            {porCategoria.map(e => <Cell key={e.name} fill={e.color} />)}
                          </Pie>
                          <Tooltip formatter={v => fmtARS(Number(v))} contentStyle={chartTooltipStyle} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {porCategoria.slice(0, 5).map(c => (
                        <div key={c.name} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                            <span className="text-[#e8e8e8]/50 truncate max-w-[90px]">{c.name}</span>
                          </div>
                          <span className="text-[#e8e8e8]/70 font-mono">{fmtARS(c.value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  )
}
