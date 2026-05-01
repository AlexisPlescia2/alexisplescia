import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const EXPERIENCE = [
  {
    role: 'Analista de Datos',
    company: 'Carrefour Argentina — Área de Mantenimiento',
    period: 'Oct 2025 – Presente',
    location: 'Provincia de Buenos Aires',
    items: [
      'Diseño y desarrollo de dashboards en Looker Studio para KPIs de eficiencia energética y consumo eléctrico a nivel nacional',
      'Gestión y depuración de datos con Google Sheets, Excel y Looker Studio garantizando calidad y trazabilidad',
      'Implementación y parametrización de módulos en app Mantech para digitalización de procesos de mantenimiento',
      'Control y análisis de grupos electrógenos: relevamiento, consumo y reportes de optimización energética',
      'Gestión de tareas con Jira bajo metodología Scrum: sprints, backlog y control de incidencias',
    ],
    stack: 'Looker Studio · Google Sheets · Excel · Jira · Scrum · Mantech',
  },
  {
    role: 'Coordinador Administrativo',
    company: 'TMT Trade Marketing Technologies',
    period: 'Jun 2024 – Nov 2025',
    location: 'General Belgrano, Buenos Aires',
    items: [
      'Gestión integral de operaciones de más de 300 empleados (turnos, asistencia, objetivos)',
      'Elaboración de reportes y seguimiento de KPIs con Google Sheets, Excel y Power BI',
      'Creación de reportes dinámicos con tablas dinámicas y visualizaciones para seguimiento en tiempo real',
      'Colaboración en selección, capacitación y onboarding de personal',
    ],
    stack: 'Power BI · Excel · Google Sheets',
  },
  {
    role: 'Retail Shift Supervisor',
    company: 'Grupo Mirgor',
    period: 'May 2023 – Ago 2024',
    location: 'Provincia de Buenos Aires',
    items: [
      'Análisis de datos de ventas y rendimiento con Power BI, SQL y Google Sheets',
      'Migración de bases de datos al sistema Odoo e implementación de módulos',
      'Optimización de planificación, horarios y stock de inventario',
    ],
    stack: 'Power BI · SQL · Excel · Odoo CRM',
  },
  {
    role: 'Atención al Cliente',
    company: 'DDM Interaction Agency',
    period: 'Nov 2022 – May 2023',
    location: 'Provincia de Buenos Aires',
    items: [
      'Ventas telefónicas de seguros para Zurich y Sancor Seguros',
      'Gestión de clientes con sistema CRM asegurando seguimiento y calidad de atención',
    ],
    stack: 'CRM · Salesforce',
  },
  {
    role: 'Empleado de Back Office',
    company: 'gurú',
    period: 'Feb 2021 – Mar 2022',
    location: 'Villa Adelina, Buenos Aires',
    items: [
      'QA manual: detección de errores, documentación de bugs y pruebas funcionales',
      'Atención a clientes internacionales en Perú, Chile, Nicaragua y Guatemala',
      'Gestión de relaciones con clientes en Salesforce CRM',
      'Promoción de servicios de marketing digital: Google Ads y Facebook Ads',
    ],
    stack: 'Salesforce · QA Manual · Google Ads · Facebook Ads',
  },
  {
    role: 'Supervisor',
    company: 'Grupo NetMart',
    period: 'Feb 2018 – Dic 2020',
    location: 'Ramos Mejía, Buenos Aires',
    items: [
      'Liderazgo y supervisión de equipo de ventas de 10 personas',
      'Diseño de programas de capacitación en técnicas de venta y negociación',
      'Análisis de datos de ventas para identificar áreas de mejora y oportunidades de crecimiento',
    ],
    stack: 'Excel · Análisis de datos · Liderazgo',
  },
]

const EDUCATION = [
  {
    title: 'Tecnicatura Universitaria en Programación',
    institution: 'Universidad Tecnológica Nacional (UTN)',
    period: 'Jun 2022 – Presente',
    items: ['Algoritmos y estructuras de datos', 'Programación Orientada a Objetos', 'Python, C, C++'],
  },
  {
    title: 'Formación Profesional — Programación Informática',
    institution: 'Universidad de Buenos Aires (UBA) · EducacionIT',
    period: 'Dic 2023 – Ago 2024',
    items: ['Desarrollo web Full Stack con Python y Django', 'APIs REST, ORM y despliegue', 'Formularios, autenticación y Docker'],
  },
  {
    title: 'JavaScript Developer',
    institution: 'Coderhouse',
    period: 'Dic 2022 – Mar 2023',
    items: ['Desarrollo de aplicaciones web con JavaScript', 'DOM, eventos y APIs', 'Buenas prácticas y control de versiones con Git'],
  },
  {
    title: 'Programación en JavaScript',
    institution: 'Coderhouse',
    period: 'Dic 2022 – Abr 2023',
    items: ['Fundamentos de JavaScript ES6+', 'Programación funcional y orientada a objetos', 'Manipulación del DOM y fetch API'],
  },
]

const springBase = { type: 'spring' as const, stiffness: 320, damping: 26, mass: 0.9 }
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
}

export default function About() {
  useEffect(() => {
    document.title = 'Sobre mí — Alexis Plescia'
  }, [])

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springBase}
        >
          <span className="label-caps block mb-3">Mi historia</span>
          <h1 className="section-title">Sobre mí</h1>
        </motion.div>

        {/* Bio */}
        <motion.div
          className="card-dark p-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springBase, delay: 0.1 }}
        >
          <p className="text-[#e8e8e8]/65 leading-relaxed mb-4 text-[15px]">
            Soy <strong className="text-[#e8e8e8] font-semibold">Alexis Plescia</strong>, Desarrollador Full Stack y Analista de Datos con base en Hurlingham, Buenos Aires. Me especializo en construir aplicaciones web completas y en transformar datos en insights accionables mediante dashboards y reportes.
          </p>
          <p className="text-[#e8e8e8]/65 leading-relaxed mb-8 text-[15px]">
            Actualmente trabajo como Analista de Datos en Carrefour, donde diseño dashboards para monitoreo de KPIs energéticos a nivel nacional. En paralelo, desarrollo proyectos full stack con React, Node.js y Python.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link to="/shop" className="btn-primary px-5 py-2.5 text-sm">Ver proyectos</Link>
            <a href="https://www.linkedin.com/in/alexisplescia/" target="_blank" rel="noopener noreferrer" className="btn-secondary px-5 py-2.5 text-sm">LinkedIn</a>
            <a href="https://github.com/AlexisPlescia" target="_blank" rel="noopener noreferrer" className="btn-secondary px-5 py-2.5 text-sm">GitHub</a>
          </div>
        </motion.div>

        {/* Experiencia */}
        <motion.section
          className="mb-12"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.h2
            className="text-xl font-semibold text-[#e8e8e8] mb-6 tracking-tight"
            variants={fadeUp}
            transition={springBase}
          >
            Experiencia
          </motion.h2>
          <div className="space-y-3">
            {EXPERIENCE.map((exp) => (
              <motion.div
                key={exp.role + exp.company}
                className="card-dark p-6"
                variants={fadeUp}
                transition={springBase}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-semibold text-[#e8e8e8] text-[15px] tracking-tight">{exp.role}</h3>
                    <p className="text-accent text-sm mt-0.5">{exp.company}</p>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <p className="text-xs font-mono text-[#e8e8e8]/40">{exp.period}</p>
                    <p className="text-xs text-[#e8e8e8]/25 mt-0.5">{exp.location}</p>
                  </div>
                </div>
                <ul className="space-y-1.5 mb-3">
                  {exp.items.map((item) => (
                    <li key={item} className="text-sm text-[#e8e8e8]/55 flex gap-2">
                      <span className="text-accent/50 flex-shrink-0 mt-0.5">›</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-xs font-mono text-gold/40">{exp.stack}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Educación */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.h2
            className="text-xl font-semibold text-[#e8e8e8] mb-6 tracking-tight"
            variants={fadeUp}
            transition={springBase}
          >
            Educación
          </motion.h2>
          <div className="space-y-3">
            {EDUCATION.map((edu) => (
              <motion.div
                key={edu.title}
                className="card-dark p-6"
                variants={fadeUp}
                transition={springBase}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-semibold text-[#e8e8e8] text-[15px] tracking-tight">{edu.title}</h3>
                    <p className="text-accent text-sm mt-0.5">{edu.institution}</p>
                  </div>
                  <p className="text-xs font-mono text-[#e8e8e8]/40 sm:text-right shrink-0">{edu.period}</p>
                </div>
                <ul className="space-y-1.5">
                  {edu.items.map((item) => (
                    <li key={item} className="text-sm text-[#e8e8e8]/55 flex gap-2">
                      <span className="text-accent/50 shrink-0 mt-0.5">›</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  )
}
