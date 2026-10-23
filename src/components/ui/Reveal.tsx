import { useEffect, useRef, type ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import { gsap } from '@/lib/gsap'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  /** Aplica el revelado a los hijos directos con stagger */
  stagger?: number
  start?: string
}

/** Revelado sobrio al entrar en pantalla: opacidad + desplazamiento corto. */
export function Reveal({
  children,
  className = '',
  delay = 0,
  y = 34,
  stagger,
  start = 'top 88%',
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return

    const targets = stagger ? Array.from(el.children) : [el]

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        opacity: 0,
        y,
        duration: 1.1,
        delay,
        stagger: stagger ?? 0,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start, once: true },
      })
    }, el)

    return () => ctx.revert()
  }, [delay, y, stagger, start, reduced])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
