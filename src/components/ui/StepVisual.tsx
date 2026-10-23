interface StepVisualProps {
  /** 0 = Llega · 1 = Elige · 2 = Juega · 3 = Repite */
  step: number
  accent: string
  compact?: boolean
}

/**
 * Una composicion distinta por etapa del relato, en SVG inline.
 * Se animan con CSS (no con JS) para que el scroll con pin no compita por
 * el hilo principal.
 */
export function StepVisual({ step, accent, compact = false }: StepVisualProps) {
  const size = compact ? 'w-[min(72vw,19rem)]' : 'w-[min(34vw,27rem)]'
  const common = `${size} aspect-square overflow-visible`
  const ink = 'var(--color-ink)'

  if (step === 0) {
    /* LLEGA — el umbral */
    return (
      <svg viewBox="0 0 400 400" className={common} role="img" aria-label="Entrar por la puerta">
        <g fill="none" stroke={ink} strokeOpacity="0.2" strokeWidth="1.5">
          {[0, 1, 2, 3].map((i) => (
            <path key={i} d={`M${90 - i * 14} 330V${150 + i * 10}a${110 + i * 14} ${110 + i * 14} 0 0 1 ${220 + i * 28} 0V330`} />
          ))}
        </g>
        <path
          d="M110 330V175a90 90 0 0 1 180 0v155z"
          fill={accent}
          fillOpacity="0.14"
          stroke={accent}
          strokeWidth="2"
        />
        <g className="animate-float" style={{ animationDuration: '4.5s' }}>
          <circle cx="200" cy="232" r="27" fill={accent} />
          <path d="M200 268c26 0 44 18 44 44v18h-88v-18c0-26 18-44 44-44z" fill={accent} />
        </g>
        <g stroke={accent} strokeWidth="2.5" strokeLinecap="round">
          <path d="M40 364h56" opacity="0.9" />
          <path d="M112 364h32" opacity="0.55" />
          <path d="M160 364h14" opacity="0.3" />
        </g>
        <text x="40" y="78" fontFamily="var(--font-sans)" fontSize="13" letterSpacing="4" fill={ink} fillOpacity="0.4">
          SEDE SAN ISIDRO
        </text>
      </svg>
    )
  }

  if (step === 1) {
    /* ELIGE — abanico de cartas, una levantada */
    return (
      <svg viewBox="0 0 400 400" className={common} role="img" aria-label="Elegir una carta">
        {[-26, -9, 9, 26].map((rot, i) => (
          <g key={rot} transform={`rotate(${rot} 200 400)`}>
            <rect
              x="142"
              y="112"
              width="116"
              height="168"
              rx="12"
              fill="var(--color-cream)"
              stroke={ink}
              strokeOpacity="0.25"
              strokeWidth="1.5"
            />
            <circle cx="200" cy="196" r="22" fill={ink} fillOpacity={0.08 + i * 0.03} />
          </g>
        ))}
        <g className="animate-float" style={{ animationDuration: '5s' }}>
          <g transform="rotate(-5 200 400)">
            <rect x="142" y="66" width="116" height="168" rx="12" fill={accent} />
            <circle cx="200" cy="150" r="24" fill="var(--color-cream)" fillOpacity="0.9" />
            <rect x="162" y="196" width="76" height="6" rx="3" fill="var(--color-cream)" fillOpacity="0.55" />
            <rect x="176" y="210" width="48" height="6" rx="3" fill="var(--color-cream)" fillOpacity="0.35" />
          </g>
        </g>
        <path d="M200 334v34" stroke={accent} strokeWidth="2" strokeDasharray="5 6" />
      </svg>
    )
  }

  if (step === 2) {
    /* JUEGA — tablero con piezas */
    return (
      <svg viewBox="0 0 400 400" className={common} role="img" aria-label="Partida en la mesa">
        <g transform="translate(200 215) skewY(-14) scale(1.02)">
          {Array.from({ length: 5 }, (_, y) =>
            Array.from({ length: 5 }, (_, x) => (
              <rect
                key={`${x}-${y}`}
                x={(x - 2.5) * 62}
                y={(y - 2.5) * 62}
                width="58"
                height="58"
                rx="6"
                fill={(x + y) % 2 ? accent : ink}
                fillOpacity={(x + y) % 2 ? 0.16 : 0.07}
                stroke={ink}
                strokeOpacity="0.12"
              />
            )),
          )}
          <g>
            <circle cx="-93" cy="-93" r="19" fill={accent} />
            <circle cx="31" cy="-31" r="19" fill={ink} fillOpacity="0.85" />
            <circle cx="-31" cy="93" r="19" fill="var(--color-gold)" />
            <circle cx="93" cy="31" r="19" fill={ink} fillOpacity="0.85" />
          </g>
        </g>
        <g className="animate-float" style={{ animationDuration: '3.8s' }}>
          <rect x="268" y="52" width="76" height="76" rx="16" fill={accent} transform="rotate(14 306 90)" />
          <g fill="var(--color-cream)" transform="rotate(14 306 90)">
            <circle cx="288" cy="72" r="7" />
            <circle cx="306" cy="90" r="7" />
            <circle cx="324" cy="108" r="7" />
          </g>
        </g>
      </svg>
    )
  }

  /* REPITE — orbita semanal */
  return (
    <svg viewBox="0 0 400 400" className={common} role="img" aria-label="Volver cada semana">
      <circle cx="200" cy="200" r="132" fill="none" stroke={ink} strokeOpacity="0.15" strokeWidth="1.5" />
      <circle cx="200" cy="200" r="96" fill="none" stroke={ink} strokeOpacity="0.1" strokeWidth="1.5" strokeDasharray="4 8" />
      <g
        style={{
          transformOrigin: '200px 200px',
          animation: 'spin 26s linear infinite',
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => {
          const a = (i / 5) * Math.PI * 2 - Math.PI / 2
          const x = 200 + Math.cos(a) * 132
          const y = 200 + Math.sin(a) * 132
          return (
            <g key={i}>
              <rect
                x={x - 21}
                y={y - 21}
                width="42"
                height="42"
                rx="10"
                fill={i === 0 ? accent : ink}
                fillOpacity={i === 0 ? 1 : 0.14}
              />
              {i === 0 && <circle cx={x} cy={y} r="6" fill="var(--color-cream)" />}
            </g>
          )
        })}
      </g>
      <g textAnchor="middle" fontFamily="var(--font-display)" fill={ink}>
        <text x="200" y="192" fontSize="54" letterSpacing="-1">
          CADA
        </text>
        <text x="200" y="244" fontSize="54" fill={accent}>
          VIERNES
        </text>
      </g>
      <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
    </svg>
  )
}
