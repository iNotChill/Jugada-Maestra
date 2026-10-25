import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { useIsDesktop, useReducedMotion } from '@/hooks/useMediaQuery'
import { site } from '@/data/site'
import { gsap } from '@/lib/gsap'
import { ActionButton } from './ui/ActionButton'
import { MaskedLines } from './ui/MaskedLines'

/* three.js se carga aparte: el titular y la informacion del hero pintan antes
   de que llegue el bundle 3D */
const HeroScene = lazy(() => import('./hero/HeroScene'))

export function Hero() {
  const section = useRef<HTMLElement>(null)
  const headline = useRef<HTMLDivElement>(null)
  const progress = useRef(0)
  const [sceneReady, setSceneReady] = useState(false)
  const [heroVisible, setHeroVisible] = useState(true)

  const isDesktop = useIsDesktop()
  const reduced = useReducedMotion()

  /* La escena 3D se monta despues del primer paint para no competir con el
     revelado tipografico, y nunca si el usuario pidio movimiento reducido. */
  useEffect(() => {
    if (reduced) return
    const id = window.setTimeout(() => setSceneReady(true), 180)
    return () => window.clearTimeout(id)
  }, [reduced])

  /**
   * Pausa el canvas cuando el hero deja de verse.
   *
   * La visibilidad se recalcula siempre desde la posicion real del elemento,
   * no desde `entry.isIntersecting`: al redimensionar la ventana el observer
   * puede informar de que no interseca y no volver a dispararse nunca, con lo
   * que el canvas se quedaba congelado hasta que el usuario salia de la
   * seccion y volvia.
   */
  useEffect(() => {
    const el = section.current
    if (!el) return

    const MARGIN = 120
    const check = () => {
      const r = el.getBoundingClientRect()
      setHeroVisible(r.bottom > -MARGIN && r.top < window.innerHeight + MARGIN)
    }

    const io = new IntersectionObserver(check, { rootMargin: `${MARGIN}px` })
    io.observe(el)
    window.addEventListener('resize', check)

    return () => {
      io.disconnect()
      window.removeEventListener('resize', check)
    }
  }, [])

  useEffect(() => {
    const el = section.current
    if (!el || reduced) return

    const ctx = gsap.context(() => {
      gsap.to(
        { v: 0 },
        {
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
            onUpdate: (self) => {
              progress.current = self.progress
            },
          },
        },
      )

      // El titular se va con mas lentitud que el scroll: profundidad sin coste
      gsap.to(headline.current, {
        yPercent: -14,
        scale: 0.94,
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      })
    }, el)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      ref={section}
      id="inicio"
      data-nav-theme="light"
      className="grain relative isolate flex min-h-[100svh] flex-col overflow-clip bg-cream"
    >
      {/* Trama de fondo: retícula muy tenue, da la base editorial */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(16,19,25,0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,19,25,0.055) 1px, transparent 1px)',
          backgroundSize: 'clamp(3rem, 7vw, 7rem) clamp(3rem, 7vw, 7rem)',
        }}
      />

      {/* Composicion 3D */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        {sceneReady && (
          <Suspense fallback={null}>
            <HeroScene progress={progress} dense={isDesktop} paused={!heroVisible} />
          </Suspense>
        )}
      </div>

      <div className="grain-layer" aria-hidden />

      <div className="shell relative z-10 flex min-h-[100svh] flex-col justify-between pt-28 pb-8 sm:pt-32 lg:pt-36 lg:pb-12">
        {/* Fila superior */}
        <div className="flex items-start justify-between gap-6">
          <p className="type-mono max-w-[14ch] text-ink/55 sm:max-w-none">
            Grupo universitario
            <br />
            de juegos de mesa
          </p>
          <p className="type-mono hidden text-right text-ink/55 md:block">
            {site.claim}
            <br />
            <span className="text-ember">Lima · 2026</span>
          </p>
        </div>

        {/* Titular */}
        <div ref={headline} className="relative py-10 will-change-transform">
          <MaskedLines
            as="h1"
            trigger="load"
            delay={0.15}
            stagger={0.1}
            className="type-hero text-ink"
            lines={[
              <>Juega.</>,
              <>Conoce.</>,
              <>
                Comp<span className="text-ember">i</span>te.
              </>,
            ]}
          />
        </div>

        {/* Fila inferior */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-5">
            <p className="type-lead max-w-[34ch] text-balance text-ink/80">
              Un espacio para descubrir nuevos juegos, conocer gente y pasarla bien todos los viernes.
            </p>

            {/* Indicador de scroll: va en el flujo, nunca se cruza con el bloque
                de horario en pantallas bajas */}
            <div aria-hidden className="mt-7 hidden items-center gap-3 lg:flex">
              <span className="relative block h-8 w-px overflow-hidden bg-ink/15">
                <span
                  className="absolute inset-x-0 top-0 h-3 bg-ember"
                  style={{ animation: 'scrollHint 1.8s ease-in-out infinite' }}
                />
              </span>
              <span className="type-mono text-ink/40">Scroll</span>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="h-px w-full bg-ink/15" />
            <p className="type-mono mt-4 whitespace-nowrap text-ink">
              {site.day} · {site.time}
            </p>
            <p className="type-mono mt-1 text-ink/55">{site.venue}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 lg:col-span-4 lg:justify-end">
            <ActionButton href={site.joinUrl} variant="solid">
              Quiero jugar
            </ActionButton>
            <ActionButton href="#juegos" variant="outline">
              Ver juegos
            </ActionButton>
          </div>
        </div>
      </div>

      <style>{'@keyframes scrollHint{0%{transform:translateY(-100%)}60%,100%{transform:translateY(900%)}}'}</style>
    </section>
  )
}
