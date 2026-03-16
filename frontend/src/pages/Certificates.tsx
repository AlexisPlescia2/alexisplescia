import { useEffect } from 'react'

const CERTS = [
  {
    title: 'Tecnicatura Universitaria en Programación',
    institution: 'Universidad Tecnológica Nacional (UTN)',
    year: 'Jun 2022 – Presente',
    desc: 'Carrera universitaria en programación con foco en algoritmos, estructuras de datos, POO y desarrollo de software.',
    icon: '🏛️',
  },
  {
    title: 'Formación Profesional — Programación Informática',
    institution: 'Universidad de Buenos Aires (UBA) · EducacionIT',
    year: 'Dic 2023 – Ago 2024',
    desc: 'Desarrollo web full stack con Python y Django, APIs REST, ORM y despliegue en producción.',
    icon: '🎓',
  },
  {
    title: 'JavaScript Developer',
    institution: 'Coderhouse',
    year: 'Dic 2022 – Mar 2023',
    desc: 'Desarrollo de aplicaciones web con JavaScript moderno, DOM, eventos, fetch API y buenas prácticas.',
    icon: '🟨',
  },
  {
    title: 'Programación en JavaScript',
    institution: 'Coderhouse',
    year: 'Dic 2022 – Abr 2023',
    desc: 'Fundamentos de JavaScript ES6+, programación funcional y orientada a objetos, manipulación del DOM.',
    icon: '💻',
  },
  {
    title: 'Analista de Datos — KPIs & Dashboards',
    institution: 'Carrefour Argentina · Experiencia profesional',
    year: 'Oct 2025 – Presente',
    desc: 'Diseño de dashboards de eficiencia energética y operativa en Looker Studio para más de 500 locales a nivel nacional.',
    icon: '📊',
  },
  {
    title: 'Power BI, Excel Avanzado & Google Sheets',
    institution: 'TMT · Grupo Mirgor · Experiencia profesional',
    year: '2023–2025',
    desc: 'Tablas dinámicas, reportes automáticos, visualizaciones y KPIs de desempeño para equipos de +300 personas.',
    icon: '📈',
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
              <span className="text-3xl flex-shrink-0">{cert.icon}</span>
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
