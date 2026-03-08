import { Link } from 'react-router-dom'

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

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="font-display text-xl tracking-widest">
              <span className="text-accent">ALEXIS</span>
              <span className="text-[#e8e8e8]"> PLESCIA</span>
            </Link>
            <p className="mt-3 text-sm text-[#e8e8e8]/40 font-body leading-relaxed">
              Desarrollador Full Stack & Analista de Datos. Buenos Aires, Argentina.
            </p>
            {/* Social links */}
            <div className="flex gap-3 mt-4">
              <a
                href="https://github.com/AlexisPlescia"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded border border-border flex items-center justify-center text-[#e8e8e8]/40 hover:text-accent hover:border-accent transition-colors text-xs font-mono uppercase"
              >
                gh
              </a>
              <a
                href="https://www.linkedin.com/in/alexisplescia/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded border border-border flex items-center justify-center text-[#e8e8e8]/40 hover:text-accent hover:border-accent transition-colors text-xs font-mono uppercase"
              >
                in
              </a>
            </div>
          </div>

          {/* Columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-display tracking-widest text-gold text-sm mb-4 uppercase">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm font-body text-[#e8e8e8]/40 hover:text-[#e8e8e8] transition-colors"
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
          <p className="text-xs font-mono text-[#e8e8e8]/30 uppercase tracking-widest">
            © 2026 Alexis Plescia
          </p>
          <p className="text-xs font-mono text-[#e8e8e8]/20 tracking-wide">
            React + TypeScript + Node.js + Prisma
          </p>
        </div>
      </div>
    </footer>
  )
}
