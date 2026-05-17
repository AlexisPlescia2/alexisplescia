import { Link } from 'react-router-dom'
import { Product } from '../../types/product'
import ImageCarousel from './ImageCarousel'

interface ProjectShowcaseProps {
  project: Product
  index: number
}

export default function ProjectShowcase({ project, index }: ProjectShowcaseProps) {
  const techs = project.brand.split('·').map((t) => t.trim()).filter(Boolean)
  const features = project.features ?? []

  return (
    <article
      style={{
        background: '#111111',
        border: '1px solid #222222',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      <div className="flex flex-col lg:flex-row">

        {/* ── IZQUIERDA: Info ── */}
        <div className="flex flex-col justify-between p-8 lg:p-10 lg:w-1/2 xl:w-[52%]">

          {/* Número de proyecto */}
          <div className="mb-6">
            <span style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 12,
              color: '#4fc3f7',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}>
              {String(index + 1).padStart(2, '0')} — Proyecto
            </span>
          </div>

          {/* Título */}
          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
              color: '#f0f0f0',
              lineHeight: 1.05,
              letterSpacing: '0.06em',
              marginBottom: 16,
            }}
          >
            {project.name.toUpperCase()}
          </h2>

          {/* Descripción */}
          <p
            className="font-body"
            style={{
              color: '#888888',
              fontSize: 14,
              lineHeight: 1.7,
              marginBottom: 20,
            }}
          >
            {project.description}
          </p>

          {/* Divisor */}
          <div style={{ height: 1, background: '#222222', marginBottom: 20 }} />

          {/* ¿Para qué sirve? */}
          {features.length > 0 && (
            <div className="mb-6">
              <p style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 10,
                color: '#555555',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginBottom: 12,
              }}>
                ¿Para qué sirve?
              </p>
              <ul className="space-y-2">
                {features.map((feat, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span style={{
                      color: '#c62828',
                      fontSize: 14,
                      lineHeight: 1.6,
                      flexShrink: 0,
                      marginTop: 1,
                    }}>●</span>
                    <span style={{
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: 13,
                      color: '#bbbbbb',
                      lineHeight: 1.6,
                    }}>
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags tecnologías */}
          <div className="flex flex-wrap gap-2 mb-8">
            {techs.map((tech) => (
              <span
                key={tech}
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 11,
                  color: '#888888',
                  background: '#1a1a1a',
                  border: '1px solid #2a2a2a',
                  padding: '4px 10px',
                  borderRadius: 4,
                  letterSpacing: '0.04em',
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Botón Ver proyecto */}
          <div>
            {project.projectUrl ? (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-body font-semibold transition-all"
                style={{
                  background: '#1e3a5f',
                  border: '1px solid #4fc3f7',
                  color: '#4fc3f7',
                  padding: '10px 22px',
                  borderRadius: 6,
                  fontSize: 13,
                  letterSpacing: '0.04em',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#4fc3f7'
                  e.currentTarget.style.color = '#0a0a0a'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#1e3a5f'
                  e.currentTarget.style.color = '#4fc3f7'
                }}
              >
                Ver proyecto
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            ) : (
              <Link
                to={`/product/${project.slug}`}
                className="inline-flex items-center gap-2 font-body font-semibold transition-all"
                style={{
                  background: '#1a1a1a',
                  border: '1px solid #333333',
                  color: '#888888',
                  padding: '10px 22px',
                  borderRadius: 6,
                  fontSize: 13,
                  letterSpacing: '0.04em',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#4fc3f7'
                  e.currentTarget.style.color = '#4fc3f7'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#333333'
                  e.currentTarget.style.color = '#888888'
                }}
              >
                Ver proyecto
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            )}
          </div>
        </div>

        {/* ── DERECHA: Carousel ── */}
        <div className="lg:w-1/2 xl:w-[48%] min-h-[280px] lg:min-h-[420px]">
          <ImageCarousel
            images={project.images}
            alt={project.name}
            badge={project.category?.name}
          />
        </div>

      </div>
    </article>
  )
}
