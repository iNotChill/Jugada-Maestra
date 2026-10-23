import { useEffect, useRef, type ElementType, type ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import { gsap } from '@/lib/gsap'

interface MaskedLinesProps {
  /** Cada entrada es una linea: se anima enmascarada de forma independiente */
  lines: ReactNode[]
  as?: ElementType
  className?: string
  lineClassName?: string
  delay?: number
  stagger?: number
  /** 'load' anima al montar (hero), 'scroll' espera a que entre en pantalla */
  trigger?: 'load' | 'scroll'
}

/**
 * Revelado tipografico linea a linea: cada linea sube desde su propia mascara.
 * Es el gesto de entrada que se repite en todas las secciones para dar
 * coherencia a la narrativa visual.
 */
export function MaskedLines({
  lines,
  as: Tag = 'h2',
  className = '',
  lineClassName = '',
  delay = 0,
  stagger = 0.09,
  trigger = 'scroll',
}: MaskedLinesProps) {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = root.current
    // Con movimiento reducido el texto se muestra tal cual: las animaciones de
    // GSAP son JS, no las frena el override de CSS
    if (!el || reduced) return

    const targets = el.querySelectorAll<HTMLElement>('[data-line-inner]')
    if (!targets.length) return

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        yPercent: 112,
        rotate: 2.2,
        duration: 1.25,
        delay,
        stagger,
        ease: 'expo.out',
        ...(trigger === 'scroll'
          ? { scrollTrigger: { trigger: el, start: 'top 85%', once: true } }
          : {}),
      })
    }, el)

    return () => ctx.revert()
  }, [delay, stagger, trigger, reduced])

  return (
    <Tag ref={root} className={className}>
      {lines.map((line, i) => (
        <span className="line-mask" key={i}>
          <span data-line-inner className={`block will-change-transform ${lineClassName}`}>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  )
}
