import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { useAuthStore } from '../../store/authStore'
import { useAuth } from '../../hooks/useAuth'

const springBase = { type: 'spring' as const, stiffness: 300, damping: 26, mass: 0.9 }
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }

/* ── Datos de ejemplo — reemplazar con fetch real cuando conectes Supabase ── */
const MONTHLY_SPEND = [
  { mes: 'Nov', gastos: 82000, ingresos: 210000 },
  { mes: 'Dic', gastos: 95000, ingresos: 210000 },
  { mes: 'Ene', gastos: 71000, ingresos: 230000 },
  { mes: 'Feb', gastos: 88000, ingresos: 230000 },
  { mes: 'Mar', gastos: 102000, ingresos: 245000 },
  { mes: 'Abr', gastos: 79000, ingresos: 245000 },
]

const CATEGORY_SPEND = [
  { name: 'Alimentación', value: 28000, color: '#1e40af' },
  { name: 'Transporte', value: 12000, color: '#60a5fa' },
  { name: 'Servicios', value: 18000, color: '#3b82f6' },
  { name: 'Ocio', value: 9000, color: '#93c5fd' },
  { name: 'Otros', value: 12000, color: '#374151' },
]

const RECENT_EXPENSES = [
  { id: 1, concepto: 'Supermercado Carrefour', categoria: 'Alimentación', monto: 8400, fecha: '28/04' },
  { id: 2, concepto: 'SUBE', categoria: 'Transporte', monto: 2000, fecha: '27/04' },
  { id: 3, concepto: 'Netflix', categoria: 'Servicios', monto: 4500, fecha: '26/04' },
  { id: 4, concepto: 'Farmacia', categoria: 'Salud', monto: 3200, fecha: '25/04' },
  { id: 5, concepto: 'Spotify', categoria: 'Servicios', monto: 1800, fecha: '25/04' },
]

const KPI_CARDS = [
  { label: 'Gastos del mes', value: '$79.000', delta: '-22%', up: false },
  { label: 'Ingreso mensual', value: '$245.000', delta: '+6.5%', up: true },
  { label: 'Ahorro neto', value: '$166.000', delta: '+18%', up: true },
  { label: 'Tasa de ahorro', value: '67.7%', delta: '+8pp', up: true },
  { label: 'Gasto diario prom.', value: '$2.633', delta: '-12%', up: false },
]

function fmtARS(n: number) {
  return '$' + n.toLocaleString('es-AR')
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: {value: number; name: string; color: string}[]; label?: string }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-card border border-border rounded-lg p-3 text-xs" style={{ borderRadius: '10px' }}>
      <p className="text-[#e8e8e8]/50 mb-1.5">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: {fmtARS(p.value)}
        </p>
      ))}
    </div>
  )
}

export default function DashView() {
  const { user } = useAuthStore()
  const { logout } = useAuth()
  const [activeTab, setActiveTab] = useState<'overview' | 'gastos'>('overview')

  return (
    <div className="min-h-screen bg-background text-[#e8e8e8]"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>

      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b border-border"
        style={{ background: 'rgba(10,10,10,0.8)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-[#e8e8e8] tracking-tight">Panel personal</span>
            <span className="text-[#e8e8e8]/20">·</span>
            <div className="flex gap-1">
              {(['overview', 'gastos'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    activeTab === tab
                      ? 'text-[#e8e8e8] bg-white/[0.08]'
                      : 'text-[#e8e8e8]/40 hover:text-[#e8e8e8]'
                  }`}
                >
                  {tab === 'overview' ? 'Resumen' : 'Gastos'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#e8e8e8]/30">{user?.name}</span>
            <motion.button
              onClick={logout}
              className="text-xs text-[#e8e8e8]/30 hover:text-[#e8e8e8] transition-colors px-2 py-1 rounded"
              whileTap={{ scale: 0.96 }}
              transition={springBase}
            >
              Salir
            </motion.button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* KPI Cards */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {KPI_CARDS.map((kpi) => (
            <motion.div
              key={kpi.label}
              className="card-dark p-4"
              variants={fadeUp}
              transition={springBase}
            >
              <p className="text-[11px] text-[#e8e8e8]/40 mb-1.5 tracking-wide">{kpi.label}</p>
              <p className="text-xl font-semibold text-[#e8e8e8] tracking-tight">{kpi.value}</p>
              <span className={`text-[11px] font-medium mt-1 block ${kpi.up ? 'text-green-400' : 'text-red-400'}`}>
                {kpi.delta}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {activeTab === 'overview' && (
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springBase}
          >
            {/* Línea ingresos vs gastos */}
            <div className="card-dark p-6 lg:col-span-2">
              <h3 className="text-sm font-semibold text-[#e8e8e8] mb-1 tracking-tight">Ingresos vs Gastos</h3>
              <p className="text-[11px] text-[#e8e8e8]/35 mb-5">Últimos 6 meses</p>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={MONTHLY_SPEND}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222222" />
                  <XAxis dataKey="mes" tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="ingresos" name="Ingresos" stroke="#1e40af" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="gastos" name="Gastos" stroke="#60a5fa" strokeWidth={2} dot={false} strokeDasharray="4 2" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Pie categorías */}
            <div className="card-dark p-6">
              <h3 className="text-sm font-semibold text-[#e8e8e8] mb-1 tracking-tight">Por categoría</h3>
              <p className="text-[11px] text-[#e8e8e8]/35 mb-4">Mes actual</p>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={CATEGORY_SPEND} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={2}>
                    {CATEGORY_SPEND.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => fmtARS(Number(v))} contentStyle={{ background: '#1a1a1a', border: '1px solid #222', borderRadius: '10px', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-3">
                {CATEGORY_SPEND.map((c) => (
                  <div key={c.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                      <span className="text-[#e8e8e8]/50">{c.name}</span>
                    </div>
                    <span className="text-[#e8e8e8]/70 font-mono">{fmtARS(c.value)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bar chart mensual */}
            <div className="card-dark p-6 lg:col-span-2">
              <h3 className="text-sm font-semibold text-[#e8e8e8] mb-1 tracking-tight">Gastos mensuales</h3>
              <p className="text-[11px] text-[#e8e8e8]/35 mb-5">Comparativa por mes</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={MONTHLY_SPEND} barSize={22}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222222" vertical={false} />
                  <XAxis dataKey="mes" tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="gastos" name="Gastos" fill="#1e40af" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Últimos gastos */}
            <div className="card-dark p-6">
              <h3 className="text-sm font-semibold text-[#e8e8e8] mb-1 tracking-tight">Últimos gastos</h3>
              <p className="text-[11px] text-[#e8e8e8]/35 mb-4">Esta semana</p>
              <div className="space-y-3">
                {RECENT_EXPENSES.map((exp) => (
                  <div key={exp.id} className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[13px] text-[#e8e8e8]/80 leading-tight">{exp.concepto}</p>
                      <p className="text-[11px] text-[#e8e8e8]/35 mt-0.5">{exp.categoria} · {exp.fecha}</p>
                    </div>
                    <span className="text-[13px] font-medium text-[#e8e8e8] shrink-0">{fmtARS(exp.monto)}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'gastos' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springBase}
          >
            <div className="card-dark overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="text-sm font-semibold text-[#e8e8e8] tracking-tight">Todos los gastos</h3>
              </div>
              <div className="divide-y divide-border">
                {RECENT_EXPENSES.map((exp) => (
                  <div key={exp.id} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#e8e8e8]/80">{exp.concepto}</p>
                      <p className="text-xs text-[#e8e8e8]/35 mt-0.5">{exp.categoria} · {exp.fecha}</p>
                    </div>
                    <span className="text-sm font-medium text-[#e8e8e8]">{fmtARS(exp.monto)}</span>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 border-t border-border bg-surface/50 text-right">
                <span className="text-xs text-[#e8e8e8]/35 italic">Conectar Supabase para datos reales</span>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}
