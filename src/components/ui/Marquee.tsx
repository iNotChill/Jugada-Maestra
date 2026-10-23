interface MarqueeProps {
  items: string[]
  className?: string
  /** Segundos por ciclo completo; mas alto = mas lento */
  speed?: number
  reverse?: boolean
}

/**
 * Cinta infinita en CSS puro (sin coste de JS por frame).
 * El contenido se duplica y se desplaza -50%, por eso el bucle es continuo.
 */
export function Marquee({ items, className = '', speed = 28, reverse = false }: MarqueeProps) {
  const track = [...items, ...items]

  return (
    <div className={`relative w-full overflow-hidden ${className}`} aria-hidden>
      <div
        className="animate-marquee flex w-max shrink-0 items-center"
        style={{
          animationDuration: `${speed}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {track.map((item, i) => (
          <span key={i} className="flex items-center whitespace-nowrap">
            <span className="type-display px-[0.35em]">{item}</span>
            <svg width="26" height="26" viewBox="0 0 26 26" className="shrink-0 opacity-70">
              <circle cx="13" cy="13" r="5.5" fill="currentColor" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  )
}
