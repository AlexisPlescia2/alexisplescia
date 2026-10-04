import { useEffect, useState } from 'react'

// Logo oficial de cada institución/empresa, servido como favicon de su propio
// sitio (no se redibuja ni se copia: se carga desde la fuente). Si no carga,
// se muestra el emoji de respaldo.
const logoUrl = (logo: string) =>
  logo.startsWith('http') ? logo : `https://www.google.com/s2/favicons?domain=${logo}&sz=128`

function CertLogo({ domain, fallback, alt }: { domain?: string; fallback: string; alt: string }) {
  const [failed, setFailed] = useState(false)
  if (!domain || failed) return <span className="text-3xl flex-shrink-0">{fallback}</span>
  return (
    <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-white p-1.5 flex items-center justify-center">
      <img
        src={logoUrl(domain)}
        alt={alt}
        width={36}
        height={36}
        loading="lazy"
        className="w-9 h-9 object-contain"
        onError={() => setFailed(true)}
      />
    </div>
  )
}

const CERTS = [
  {
    title: 'Analista de Datos — KPIs & Dashboards',
    institution: 'Carrefour Argentina · Experiencia profesional',
    year: 'Oct 2025 – Presente',
    desc: 'Diseño de dashboards de eficiencia energética y operativa en Looker Studio para más de 500 locales a nivel nacional.',
    icon: '📊',
    logo: 'carrefour.com.ar',
  },
  {
    title: 'Power BI, Excel Avanzado & Google Sheets',
    institution: 'TMT · Grupo Mirgor · Experiencia profesional',
    year: '2023–2025',
    desc: 'Tablas dinámicas, reportes automáticos, visualizaciones y KPIs de desempeño para equipos de +300 personas.',
    icon: '📈',
    logo: 'powerbi.microsoft.com',
  },
  {
    title: 'Carrera Business Analyst',
    institution: 'EducaciónIT · Certificación con Manhattan University',
    year: 'En curso',
    desc: 'Relevamiento de requerimientos, modelado de procesos con UML, user stories, gestión de proyectos, OKRs, rol de Product Owner y SQL. Incluye preparación para la certificación PMI-PBA. Ya completados: Análisis Funcional e Introducción a UX.',
    icon: '🧩',
    logo: 'educacionit.com',
  },
  {
    title: 'JavaScript Avanzado',
    institution: 'EducaciónIT',
    year: 'Dic 2022 – Abr 2023',
    desc: 'DOM y eventos, Promises y async/await, Fetch API y SPAs, closures, prototipos y clases, módulos, iteradores y generadores, storage APIs, Node.js, Webpack e introducción a TypeScript.',
    icon: '🟨',
    logo: 'educacionit.com',
  },
  {
    title: 'Desarrollo Web con Python & Django',
    institution: 'EducaciónIT',
    year: 'Finalizado',
    desc: 'Django desde cero: URLs y vistas, templates, formularios con validación, modelos y ORM, migraciones, querysets, panel de administración y deploy en producción.',
    icon: '🐍',
    logo: 'educacionit.com',
  },
  {
    title: 'Tecnicatura Universitaria en Programación',
    institution: 'Universidad Tecnológica Nacional (UTN)',
    year: 'Discontinuada',
    desc: 'Cursada parcial: bases de programación en C, programación orientada a objetos e inglés técnico.',
    icon: '🏛️',
    logo: 'https://utn.edu.ar/images/logo-utn.png',
  },
  {
    title: 'Formación Profesional — Programación Informática',
    institution: 'Universidad de Buenos Aires (UBA) · Talento Tech',
    year: 'Dic 2023 – Ago 2024',
    desc: 'Desarrollo web full stack con Python y Django, APIs REST, ORM y despliegue en producción.',
    icon: '🎓',
    logo: 'https://cdn.simpleicons.org/python/3776AB',
  },
]

export default function Certificates() {
  useEffect(() => {
    document.title = 'Certificados — Alexis Plescia'
  }, [])

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <p className="font-mono text-gold/60 text-xs tracking-[0.3em] uppercase mb-2">Logros y formación</p>
          <h1 className="section-title">Certificados</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {CERTS.map((cert) => (
            <div key={cert.title} className="card-dark p-6 flex gap-4">
              <CertLogo domain={cert.logo} fallback={cert.icon} alt={cert.institution} />
              <div>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-body font-semibold text-[#e8e8e8] leading-snug">{cert.title}</h3>
                  <span className="text-xs font-mono text-accent flex-shrink-0">{cert.year}</span>
                </div>
                <p className="text-xs font-mono text-gold/60 mb-2">{cert.institution}</p>
                <p className="text-sm text-[#e8e8e8]/50 leading-relaxed">{cert.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
