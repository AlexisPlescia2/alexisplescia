import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const EXPERIENCE = [
  {
    role: 'Analista de Datos',
    company: 'Carrefour — Área de Mantenimiento',
    period: 'Jul 2025 – Presente',
    location: 'Buenos Aires · Remoto',
    items: [
      'Dashboards interactivos en Looker Studio para KPIs de consumo eléctrico',
      'Análisis de grandes volúmenes de datos con Google Sheets, Excel y SQL',
      'Gestión de incidencias con Jira bajo metodología Scrum',
    ],
    stack: 'Looker Studio · Excel · Google Sheets · Jira',
  },
  {
    role: 'Administrativo / Coordinador',
    company: 'TMT Trade Marketing Technologies',
    period: 'Jul 2024 – Jul 2025',
    location: 'Buenos Aires · Remoto',
    items: [
      'Gestión integral de operaciones de +300 empleados',
      'Elaboración de reportes y seguimiento de KPIs con Excel y Power BI',
      'Creación de métricas de desempeño para optimizar productividad',
    ],
    stack: 'Power BI · Excel · Google Sheets · PowerPoint',
  },
  {
    role: 'Retail Shift Supervisor',
    company: 'Mirgor (Samsung)',
    period: 'May 2023 – Ago 2024',
    location: 'San Miguel, Buenos Aires',
    items: [
      'Análisis de datos de ventas con Excel, Power BI y SQL',
      'Migración de software CRM Odoo',
      'Control de inventario y supervisión de equipos',
    ],
    stack: 'Power BI · SQL · Excel · CRM Odoo',
  },
  {
    role: 'Back Office QA',
    company: 'Guru Solutions (Páginas Amarillas)',
    period: 'Jul 2021 – Ago 2022',
    location: 'San Isidro, Buenos Aires',
    items: [
      'QA manual: detección de bugs y pruebas funcionales',
      'Atención a clientes internacionales (Perú, Chile, Guatemala, Nicaragua)',
      'Gestión de clientes con Salesforce CRM',
    ],
    stack: 'Salesforce · QA Manual · Google Ads · Facebook Ads',
  },
]

const EDUCATION = [
  {
    title: 'Tecnicatura Universitaria en Programación',
    institution: 'UTN — Facultad Regional Haedo',
    period: 'Jun 2023 – Presente',
    items: ['Python, C, C++', 'Estructuras de datos y algoritmos', 'Programación Orientada a Objetos'],
  },
  {
    title: 'Full Stack Developer',
    institution: 'Talento Tech',
    period: 'Dic 2023 – Ago 2024',
    items: ['Python, Flask, React, Docker', 'APIs REST y POO', 'Metodologías ágiles y Git'],
  },
  {
    title: 'Desarrollo Web con Python y Django',
    institution: 'Educación IT',
    period: 'Ene 2024 – Dic 2024',
    items: ['Django, ORM, CRUD', 'Despliegue con PythonAnywhere', 'Formularios y autenticación'],
  },
]

export default function About() {
  useEffect(() => {
    document.title = 'Sobre mí — Alexis Plescia'
  }, [])

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <p className="font-mono text-gold/60 text-xs tracking-[0.3em] uppercase mb-2">Mi historia</p>
          <h1 className="section-title">Sobre mí</h1>
        </div>

        {/* Bio */}
        <div className="card-dark p-8 mb-10">
          <p className="font-body text-[#e8e8e8]/70 leading-relaxed mb-4">
            Soy <strong className="text-[#e8e8e8]">Alexis Plescia</strong>, Desarrollador Full Stack y Analista de Datos con base en Hurlingham, Buenos Aires. Me especializo en construir aplicaciones web completas y en transformar datos en insights accionables mediante dashboards y reportes.
          </p>
          <p className="font-body text-[#e8e8e8]/70 leading-relaxed mb-6">
            Actualmente trabajo como Analista de Datos en Carrefour, donde diseño dashboards para monitoreo de KPIs energéticos a nivel nacional. En paralelo, desarrollo proyectos full stack con React, Node.js y Python.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link to="/shop" className="btn-primary px-6 py-2">Ver proyectos</Link>
            <a href="https://www.linkedin.com/in/alexisplescia/" target="_blank" rel="noopener noreferrer" className="btn-secondary px-6 py-2">LinkedIn</a>
            <a href="https://github.com/AlexisPlescia" target="_blank" rel="noopener noreferrer" className="btn-secondary px-6 py-2">GitHub</a>
          </div>
        </div>

        {/* Experiencia */}
        <div className="mb-10">
          <h2 className="font-display text-2xl tracking-widest text-[#e8e8e8] mb-6">EXPERIENCIA</h2>
          <div className="space-y-4">
            {EXPERIENCE.map((exp) => (
              <div key={exp.role + exp.company} className="card-dark p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-body font-semibold text-[#e8e8e8]">{exp.role}</h3>
                    <p className="text-accent font-mono text-sm">{exp.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono text-[#e8e8e8]/40">{exp.period}</p>
                    <p className="text-xs text-[#e8e8e8]/30">{exp.location}</p>
                  </div>
                </div>
                <ul className="space-y-1 mb-3">
                  {exp.items.map((item) => (
                    <li key={item} className="text-sm text-[#e8e8e8]/60 flex gap-2">
                      <span className="text-accent/60 flex-shrink-0">›</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-xs font-mono text-gold/50">{exp.stack}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Educación */}
        <div>
          <h2 className="font-display text-2xl tracking-widest text-[#e8e8e8] mb-6">EDUCACIÓN</h2>
          <div className="space-y-4">
            {EDUCATION.map((edu) => (
              <div key={edu.title} className="card-dark p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-body font-semibold text-[#e8e8e8]">{edu.title}</h3>
                    <p className="text-accent font-mono text-sm">{edu.institution}</p>
                  </div>
                  <p className="text-xs font-mono text-[#e8e8e8]/40 sm:text-right">{edu.period}</p>
                </div>
                <ul className="space-y-1">
                  {edu.items.map((item) => (
                    <li key={item} className="text-sm text-[#e8e8e8]/60 flex gap-2">
                      <span className="text-accent/60">›</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
