import { Link } from 'react-router-dom'
import { Product } from '../../types/product'
import ImageCarousel from './ImageCarousel'

interface ProjectShowcaseProps {
  project: Product
  index: number
}

export default function ProjectShowcase({ project, index }: ProjectShowcaseProps) {
  const techs = project.brand.split('·').map((t) => t.trim()).filter(Boolean)

  return (
    <article className="card-dark overflow-hidden">
      {/* Carrusel */}
      <ImageCarousel images={project.images} alt={project.name} />

      {/* Info */}
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          <div>
            <p className="font-mono text-gold/50 text-xs tracking-[0.25em] uppercase mb-1">
              Proyecto {String(index + 1).padStart(2, '0')}
            </p>
            <h2 className="font-display text-xl md:text-2xl tracking-widest text-[#e8e8e8]">
              {project.name.toUpperCase()}
            </h2>
          </div>
          {project.category && (
            <span className="text-xs font-mono text-accent/70 bg-accent/10 border border-accent/20 px-3 py-1 rounded-full self-start">
              {project.category.name}
            </span>
          )}
        </div>

        {/* Descripción */}
        <p className="font-body text-[#e8e8e8]/60 leading-relaxed mb-6 text-sm md:text-base">
          {project.description}
        </p>

        {/* Tecnologías */}
        <div className="flex flex-wrap gap-2 mb-6">
          {techs.map((tech) => (
            <span
              key={tech}
              className="text-xs font-mono text-gold/70 bg-gold/5 border border-gold/15 px-2.5 py-1 rounded"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Botón */}
        <Link
          to={`/projects/${project.slug}`}
          className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 text-sm"
        >
          Ver proyecto
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </article>
  )
}
