import { useState, useEffect, useRef, useCallback } from 'react'

interface ImageCarouselProps {
  images: string[]
  alt: string
}

export default function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartX = useRef(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const total = images.length

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % total)
  }, [total])

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + total) % total)
  }, [total])

  const resetInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(next, 4000)
  }, [next])

  useEffect(() => {
    resetInterval()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [resetInterval])

  const handlePrev = () => {
    prev()
    resetInterval()
  }

  const handleNext = () => {
    next()
    resetInterval()
  }

  const handleDragStart = (x: number) => {
    dragStartX.current = x
    setIsDragging(true)
  }

  const handleDragEnd = (x: number) => {
    if (!isDragging) return
    const delta = dragStartX.current - x
    if (Math.abs(delta) > 40) {
      delta > 0 ? handleNext() : handlePrev()
    }
    setIsDragging(false)
  }

  if (total === 0) {
    return (
      <div className="w-full aspect-video bg-surface flex items-center justify-center">
        <span className="text-[#e8e8e8]/20 font-mono text-sm">sin imagen</span>
      </div>
    )
  }

  return (
    <div className="relative w-full aspect-video overflow-hidden bg-surface group select-none">
      {/* Slides */}
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseUp={(e) => handleDragEnd(e.clientX)}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientX)}
      >
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${alt} — imagen ${i + 1}`}
            className="w-full h-full flex-shrink-0 object-cover"
            draggable={false}
          />
        ))}
      </div>

      {/* Gradient overlay bottom */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

      {/* Arrows — solo si hay más de 1 imagen */}
      {total > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            aria-label="Anterior"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            aria-label="Siguiente"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrent(i); resetInterval() }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === current ? 'bg-white w-4' : 'bg-white/40'
                }`}
                aria-label={`Ir a imagen ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
