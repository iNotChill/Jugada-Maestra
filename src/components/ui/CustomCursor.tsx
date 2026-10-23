import { useEffect, useRef, useState } from 'react'
import { useFinePointer, useReducedMotion } from '@/hooks/useMediaQuery'
import { gsap } from '@/lib/gsap'

/**
 * Cursor propio: un punto que sigue al mouse de inmediato y un anillo que lo
 * persigue con retardo. Crece y muestra una etiqueta sobre los elementos que
 * declaran `data-cursor="texto"`.
 *
 * Solo se activa con puntero fino y sin "prefers-reduced-motion", de modo que
 * en tactil y en modo accesible el cursor nativo nunca desaparece.
 */
export function CustomCursor() {
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const active = fine && !reduced

  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState<string | null>(null)

  useEffect(() => {
    if (!active) return

    document.documentElement.dataset.cursorMode = 'custom'

    const xTo = gsap.quickTo(dot.current, 'x', { duration: 0.12, ease: 'power3.out' })
    const yTo = gsap.quickTo(dot.current, 'y', { duration: 0.12, ease: 'power3.out' })
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.55, ease: 'power3.out' })
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.55, ease: 'power3.out' })

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX)
      yTo(e.clientY)
      rx(e.clientX)
      ry(e.clientY)

      const el = (e.target as HTMLElement)?.closest<HTMLElement>('[data-cursor]')
      const next = el?.dataset.cursor ?? null
      setLabel((prev) => (prev === next ? prev : next))

      const interactive = (e.target as HTMLElement)?.closest('a, button, [role="button"]')
      gsap.to(ring.current, {
        scale: next ? 2.6 : interactive ? 1.7 : 1,
        duration: 0.45,
        ease: 'expo.out',
      })
    }

    const onDown = () => gsap.to(ring.current, { scale: 0.8, duration: 0.2 })
    const onUp = () => gsap.to(ring.current, { scale: 1.4, duration: 0.3 })
    const onLeave = () => gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.2 })
    const onEnter = () => gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.2 })

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)

    return () => {
      delete document.documentElement.dataset.cursorMode
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
    }
  }, [active])

  if (!active) return null

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90] hidden lg:block">
      <div
        ref={ring}
        className="absolute -top-5 -left-5 grid size-10 place-items-center rounded-full border border-current mix-blend-difference"
        style={{ color: '#fff' }}
      >
        <span className="type-mono scale-[0.38] text-center text-[0.7rem] whitespace-nowrap">
          {label}
        </span>
      </div>
      <div
        ref={dot}
        className="absolute -top-[3px] -left-[3px] size-1.5 rounded-full bg-white mix-blend-difference"
      />
    </div>
  )
}
