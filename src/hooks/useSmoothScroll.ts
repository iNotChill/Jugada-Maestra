import Lenis from 'lenis'
import { useEffect, useRef } from 'react'
import { ScrollTrigger, gsap } from '@/lib/gsap'

let lenisInstance: Lenis | null = null

/** Permite bloquear el scroll desde cualquier componente (p. ej. el modal). */
export function lockScroll(locked: boolean) {
  if (!lenisInstance) {
    document.documentElement.style.overflow = locked ? 'hidden' : ''
    return
  }
  if (locked) lenisInstance.stop()
  else lenisInstance.start()
}

export function scrollToSelector(selector: string) {
  const el = document.querySelector(selector)
  if (!el) return
  if (lenisInstance) lenisInstance.scrollTo(el as HTMLElement, { offset: 0, duration: 1.4 })
  else el.scrollIntoView({ behavior: 'smooth' })
}

/**
 * Scroll suave (Lenis) sincronizado con el ticker de GSAP para que
 * ScrollTrigger y el scroll compartan el mismo reloj.
 * Se desactiva si el usuario pide movimiento reducido.
 */
export function useSmoothScroll() {
  const ref = useRef<Lenis | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      duration: 1.05,
      lerp: 0.1,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      smoothWheel: true,
    })

    ref.current = lenis
    lenisInstance = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      ref.current = null
      lenisInstance = null
    }
  }, [])

  return ref
}
