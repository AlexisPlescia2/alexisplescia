import { useEffect } from 'react'

const CERTS = [
  {
    title: 'Full Stack Developer',
    institution: 'Talento Tech — Ministerio de Economía',
    year: '2024',
    desc: 'Formación intensiva en desarrollo web full stack con Python, Flask, React y Docker.',
    icon: '🎓',
  },
  {
    title: 'Desarrollo Web con Python y Django',
    institution: 'Educación IT',
    year: '2024',
    desc: 'Especialización en desarrollo backend con Django, ORM, APIs REST y despliegue.',
    icon: '🐍',
  },
  {
    title: 'Tecnicatura Universitaria en Programación',
    institution: 'UTN — Facultad Regional Haedo',
    year: 'En curso',
    desc: 'Carrera universitaria con foco en algoritmos, estructuras de datos y POO.',
    icon: '🏛️',
  },
  {
    title: 'Analista de Datos',
    institution: 'Carrefour — Experiencia laboral',
    year: '2025',
    desc: 'Diseño de dashboards KPI con Looker Studio para eficiencia energética nacional.',
    icon: '📊',
  },
  {
    title: 'Power BI & Excel Avanzado',
    institution: 'Experiencia profesional',
    year: '2023–2025',
    desc: 'Tablas dinámicas, BUSCARV, automatización y visualización de datos empresariales.',
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
