import { useState, useEffect, useRef, useCallback } from 'react'

interface ImageCarouselProps {
  images: string[]
  alt: string
  badge?: string
}

export default function ImageCarousel({ images, alt, badge }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0)
  const [prev, setPrev] = useState(-1)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const dragStartX = useRef(0)

  const total = images.length

  const goTo = useCallback((index: number) => {
    setPrev(current)
    setCurrent(index)
  }, [current])

  const goNext = useCallback(() => goTo((current + 1) % total), [goTo, current, total])
  const goPrev = useCallback(() => goTo((current - 1 + total) % total), [goTo, current, total])

  const resetInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(goNext, 4500)
  }, [goNext])

  useEffect(() => {
    resetInterval()
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [resetInterval])

  useEffect(() => {
    if (prev !== -1) {
      const t = setTimeout(() => setPrev(-1), 320)
      return () => clearTimeout(t)
    }
  }, [prev])

  const handlePrev = () => { goPrev(); resetInterval() }
  const handleNext = () => { goNext(); resetInterval() }
  const handleDotClick = (i: number) => { goTo(i); resetInterval() }

  if (total === 0) {
    return (
      <div className="w-full h-full bg-[#141414] flex items-center justify-center">
        <span style={{ color: '#333', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>sin imagen</span>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#141414] select-none group">

      {/* Slides */}
      {images.map((src, i) => {
        const isActive = i === current
        const isPrev = i === prev
        return (
          <img
            key={i}
            src={src}
            alt={`${alt} — ${i + 1}`}
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: isActive ? 1 : 0,
              transform: isActive ? 'translateX(0)' : isPrev ? 'translateX(-10px)' : 'translateX(10px)',
              transition: 'opacity 300ms ease, transform 300ms ease',
              zIndex: isActive ? 2 : isPrev ? 1 : 0,
            }}
            onMouseDown={(e) => { dragStartX.current = e.clientX }}
            onMouseUp={(e) => {
              const delta = dragStartX.current - e.clientX
              if (Math.abs(delta) > 40) delta > 0 ? handleNext() : handlePrev()
            }}
            onTouchStart={(e) => { dragStartX.current = e.touches[0].clientX }}
            onTouchEnd={(e) => {
              const delta = dragStartX.current - e.changedTouches[0].clientX
              if (Math.abs(delta) > 40) delta > 0 ? handleNext() : handlePrev()
            }}
          />
        )
      })}

      {/* Gradient overlay — izquierda (fusión con panel info) */}
      <div
        className="absolute inset-y-0 left-0 w-24 pointer-events-none"
        style={{ background: 'linear-gradient(to right, #111111 0%, transparent 100%)', zIndex: 3 }}
      />

      {/* Gradient overlay — bottom */}
      <div
        className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)', zIndex: 3 }}
      />

      {/* Badge categoría — top right */}
      {badge && (
        <div className="absolute top-4 right-4" style={{ zIndex: 4 }}>
          <span style={{
            background: 'rgba(79,195,247,0.12)',
            border: '1px solid rgba(79,195,247,0.3)',
            color: '#4fc3f7',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 10,
            letterSpacing: '0.12em',
            padding: '4px 10px',
            borderRadius: 4,
            textTransform: 'uppercase',
          }}>
            {badge}
          </span>
        </div>
      )}

      {/* Arrows */}
      {total > 1 && (
        <>
          <button
            onClick={handlePrev}
            aria-label="Anterior"
            className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.1)', zIndex: 4 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f0f0f0" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleNext}
            aria-label="Siguiente"
            className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.1)', zIndex: 4 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f0f0f0" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots — bottom center */}
      {total > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5" style={{ zIndex: 4 }}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              aria-label={`Imagen ${i + 1}`}
              style={{
                width: i === current ? 16 : 6,
                height: 6,
                borderRadius: 3,
                background: i === current ? '#4fc3f7' : 'rgba(255,255,255,0.3)',
                transition: 'all 300ms ease',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            />
          ))}
        </div>
      )}

      {/* Counter — bottom right */}
      {total > 1 && (
        <div className="absolute bottom-3 right-4" style={{ zIndex: 4 }}>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11,
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.05em',
          }}>
            {current + 1} / {total}
          </span>
        </div>
      )}
    </div>
  )
}
