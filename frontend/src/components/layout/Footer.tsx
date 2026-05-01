import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const columns = [
  {
    title: 'Proyectos',
    links: [
      { label: 'Aplicaciones Web', to: '/shop?category=web-apps' },
      { label: 'Dashboards', to: '/shop?category=dashboards' },
      { label: 'Análisis de Datos', to: '/shop?category=data-analysis' },
    ],
  },
  {
    title: 'Info',
    links: [
      { label: 'Sobre mí', to: '/about' },
      { label: 'Contacto', to: '/contact' },
      { label: 'Certificados', to: '/certificates' },
    ],
  },
]

const springFast = { type: 'spring' as const, stiffness: 450, damping: 32 }

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="font-display text-base font-semibold tracking-tight">
              <span className="text-accent">Alexis</span>
              <span className="text-[#e8e8e8]"> Plescia</span>
            </Link>
            <p className="mt-3 text-sm text-[#e8e8e8]/35 leading-relaxed">
              Desarrollador Full Stack & Analista de Datos. Buenos Aires, Argentina.
            </p>
            <div className="flex gap-2 mt-4">
              <motion.a
                href="https://github.com/AlexisPlescia"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-md border border-border flex items-center justify-center text-[#e8e8e8]/35 hover:text-accent hover:border-accent transition-colors text-xs font-mono uppercase"
                style={{ borderRadius: '8px' }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                transition={springFast}
              >
                gh
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/alexisplescia/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-md border border-border flex items-center justify-center text-[#e8e8e8]/35 hover:text-accent hover:border-accent transition-colors text-xs font-mono uppercase"
                style={{ borderRadius: '8px' }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                transition={springFast}
              >
                in
              </motion.a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold text-[#e8e8e8]/40 tracking-widest uppercase mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-[#e8e8e8]/35 hover:text-[#e8e8e8] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs font-mono text-[#e8e8e8]/25 uppercase tracking-widest">
            © 2026 Alexis Plescia
          </p>
          <p className="text-xs font-mono text-[#e8e8e8]/15">
            React · TypeScript · Node.js · Prisma
          </p>
        </div>
      </div>
    </footer>
  )
}
