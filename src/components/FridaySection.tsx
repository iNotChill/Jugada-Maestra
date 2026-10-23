import { useEffect, useRef } from 'react'
import { site } from '@/data/site'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import { gsap } from '@/lib/gsap'
import { MaskedLines } from './ui/MaskedLines'
import { Reveal } from './ui/Reveal'

/**
 * Pausa visual. Despues del catalogo y del relato con pin, esta seccion baja
 * el ritmo: fondo profundo, mucho aire y una sola idea en pantalla.
 * La unica animacion es un acercamiento muy lento del titular.
 */
export function FridaySection() {
  const section = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || !section.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-friday-title]',
        { scale: 0.93 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: section.current,
            start: 'top bottom',
            end: 'center center',
            scrub: true,
          },
        },
      )
    }, section)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      ref={section}
      id="viernes"
      data-nav-theme="dark"
      className="grain relative isolate flex min-h-[94svh] items-center overflow-clip bg-navy text-cream"
    >
      {/* Marca de agua: dado en linea, giro casi imperceptible */}
      <svg
        aria-hidden
        viewBox="0 0 200 200"
        className="pointer-events-none absolute top-1/2 left-1/2 w-[120vw] max-w-[1100px] -translate-x-1/2 -translate-y-1/2 opacity-[0.07] sm:w-[80vw]"
        style={{ animation: reduced ? undefined : 'spin-slow 120s linear infinite' }}
      >
        <rect x="26" y="26" width="148" height="148" rx="34" fill="none" stroke="currentColor" strokeWidth="1" />
        <g fill="currentColor">
          <circle cx="66" cy="66" r="9" />
          <circle cx="134" cy="66" r="9" />
          <circle cx="100" cy="100" r="9" />
          <circle cx="66" cy="134" r="9" />
          <circle cx="134" cy="134" r="9" />
        </g>
      </svg>

      <div className="grain-layer opacity-20" aria-hidden />

      <div className="shell relative py-28 text-center sm:py-32">
        <Reveal>
          <p className="type-mono text-cream/40">05 — El dia</p>
        </Reveal>

        <div data-friday-title className="mt-8 will-change-transform">
          <MaskedLines
            className="type-hero text-cream"
            lines={[<>{site.day}</>]}
            lineClassName="tracking-[-0.01em]"
          />
        </div>

        <Reveal
          className="mt-10 flex flex-col items-center gap-4 sm:mt-12 sm:flex-row sm:justify-center sm:gap-10"
          stagger={0.12}
        >
          <p className="font-display text-[clamp(1.6rem,3.4vw,3rem)] leading-none text-gold">
            {site.time}
          </p>
          <span aria-hidden className="hidden h-8 w-px bg-cream/25 sm:block" />
          <p className="font-display text-[clamp(1.6rem,3.4vw,3rem)] leading-none">
            {site.venue}
          </p>
        </Reveal>

        <Reveal className="mt-14" delay={0.1}>
          <p className="type-lead mx-auto max-w-[26ch] text-balance text-cream/65">
            Tu partida de la semana te esta esperando.
          </p>
        </Reveal>
      </div>

      <style>{'@keyframes spin-slow{to{transform:translate(-50%,-50%) rotate(360deg)}}'}</style>
    </section>
  )
}
