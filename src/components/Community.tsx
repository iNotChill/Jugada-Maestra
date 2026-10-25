import { useEffect, useRef } from 'react'
import { communityPhotos, stats } from '@/data/site'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import { asset } from '@/lib/asset'
import { gsap } from '@/lib/gsap'
import { MaskedLines } from './ui/MaskedLines'
import { Reveal } from './ui/Reveal'

/* Composicion asimetrica: distintas proporciones, alturas desfasadas y una
   pieza que se sale del encuadre por la derecha. Cada foto se desplaza a
   distinta velocidad para dar profundidad sin recurrir a 3D. */
const layout = [
  { className: 'col-span-7 aspect-4/5 lg:col-span-5', speed: -9 },
  { className: 'col-span-5 mt-10 aspect-square lg:col-span-3 lg:mt-28', speed: 7 },
  { className: 'col-span-5 aspect-3/4 lg:col-span-4 lg:mt-10', speed: -4 },
  {
    className:
      'col-span-7 -mr-[8%] aspect-video lg:col-span-6 lg:col-start-7 lg:-mr-[16%] lg:mt-4',
    speed: 5,
  },
]

export function Community() {
  const section = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || !section.current) return

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
        gsap.to(el, {
          yPercent: Number(el.dataset.parallax),
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })
    }, section)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      ref={section}
      id="comunidad"
      data-nav-theme="light"
      className="grain relative overflow-clip bg-bone py-24 text-ink sm:py-32 lg:py-40"
    >
      <div className="grain-layer opacity-30" aria-hidden />

      <div className="shell relative">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="type-mono text-ink/40">04 — Comunidad</p>
            <MaskedLines
              className="type-display mt-5"
              lines={[<>No necesitas</>, <>ser <span className="text-ember">experto</span>.</>]}
            />
          </div>

          <Reveal className="lg:col-span-5 lg:pt-16" delay={0.1} stagger={0.12}>
            <p className="type-lead max-w-[32ch] text-ink/85">
              ¿Nunca has jugado? Perfecto.
              <br />
              ¿Ya tienes un juego favorito? Mejor aun.
            </p>
            <p className="type-body mt-6 max-w-[38ch] text-ink/60">
              Aqui vienes a jugar, conocer personas y descubrir algo nuevo. Siempre hay alguien
              dispuesto a explicar las reglas desde cero y mesas abiertas esperando un jugador mas.
            </p>
          </Reveal>
        </div>

        {/* Collage */}
        <div className="mt-20 grid grid-cols-12 items-start gap-4 sm:gap-6 lg:mt-28 lg:gap-8">
          {communityPhotos.map((photo, i) => {
            const cfg = layout[i % layout.length]
            return (
              <figure key={photo.src} className={`relative ${cfg.className}`}>
                <div
                  data-parallax={reduced ? 0 : cfg.speed}
                  className="relative size-full overflow-hidden rounded-2xl bg-ink/10 will-change-transform"
                >
                  <img
                    src={asset(photo.src)}
                    alt={photo.alt}
                    loading="lazy"
                    decoding="async"
                    className="size-full scale-110 object-cover"
                  />
                  {/* Marca temporal: dejar claro que se reemplaza por foto real */}
                  <figcaption className="type-mono absolute bottom-3 left-3 rounded-full bg-ink/75 px-3 py-1.5 text-cream/90 backdrop-blur-sm">
                    {photo.caption}
                  </figcaption>
                </div>
              </figure>
            )
          })}
        </div>

        {/* Cifras */}
        <Reveal
          className="mt-20 grid gap-10 border-t border-ink/15 pt-10 sm:grid-cols-2 lg:mt-28 lg:grid-cols-4"
          stagger={0.1}
        >
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-[clamp(2.8rem,6vw,5rem)] leading-[0.85]">{s.value}</p>
              <p className="type-mono mt-3 text-ink/50">{s.label}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
