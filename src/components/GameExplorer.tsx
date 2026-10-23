import { useEffect, useMemo, useRef, useState } from 'react'
import { accentVar, gameCategories, games } from '@/data/games'
import { useFinePointer, useReducedMotion } from '@/hooks/useMediaQuery'
import { asset } from '@/lib/asset'
import { gsap } from '@/lib/gsap'
import type { Game, GameCategory } from '@/types/game'
import { GameCard } from './GameCard'
import { GameModal } from './GameModal'
import { MaskedLines } from './ui/MaskedLines'
import { Reveal } from './ui/Reveal'

type Filter = GameCategory | 'Todos'

/**
 * Catalogo interactivo.
 *
 * Desktop: indice editorial. Al pasar el mouse por una fila, una lamina con el
 * arte del juego persigue al cursor y el color de la seccion se tine con el
 * acento de ese juego.
 * Movil: carrusel con ajuste de desplazamiento, sin depender de hover.
 * En ambos casos, al pulsar se abre la ficha completa.
 */
export function GameExplorer() {
  const [filter, setFilter] = useState<Filter>('Todos')
  const [active, setActive] = useState<Game | null>(null)
  const [selected, setSelected] = useState<Game | null>(null)

  const section = useRef<HTMLElement>(null)
  const list = useRef<HTMLUListElement>(null)
  const preview = useRef<HTMLDivElement>(null)
  const glow = useRef<HTMLDivElement>(null)

  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const hoverable = fine && !reduced

  const filtered = useMemo(
    () => (filter === 'Todos' ? games : games.filter((g) => g.categories.includes(filter))),
    [filter],
  )

  /* Lamina que persigue al cursor */
  useEffect(() => {
    if (!hoverable || !preview.current || !section.current) return

    const xTo = gsap.quickTo(preview.current, 'x', { duration: 0.65, ease: 'power3.out' })
    const yTo = gsap.quickTo(preview.current, 'y', { duration: 0.65, ease: 'power3.out' })
    const rTo = gsap.quickTo(preview.current, 'rotate', { duration: 0.9, ease: 'power3.out' })

    let prevX = 0
    const onMove = (e: PointerEvent) => {
      xTo(e.clientX)
      yTo(e.clientY)
      rTo(gsap.utils.clamp(-12, 12, (e.clientX - prevX) * 0.5) - 4)
      prevX = e.clientX
    }

    const el = section.current
    el.addEventListener('pointermove', onMove, { passive: true })
    return () => el.removeEventListener('pointermove', onMove)
  }, [hoverable])

  /* Mostrar u ocultar la lamina y tenir la seccion con el acento activo */
  useEffect(() => {
    if (!hoverable) return

    gsap.to(preview.current, {
      autoAlpha: active ? 1 : 0,
      scale: active ? 1 : 0.82,
      duration: 0.5,
      ease: 'expo.out',
    })

    gsap.to(glow.current, {
      backgroundColor: active ? accentVar[active.accent] : 'transparent',
      opacity: active ? 0.14 : 0,
      duration: 0.8,
      ease: 'power2.out',
    })
  }, [active, hoverable])

  /* Reentrada escalonada de la lista al cambiar de filtro */
  useEffect(() => {
    if (reduced || !list.current) return
    const items = list.current.querySelectorAll('[data-game-item]')
    if (!items.length) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65, stagger: 0.035, ease: 'expo.out', overwrite: true },
      )
    }, list)

    return () => ctx.revert()
  }, [filter, reduced])

  const chips: Filter[] = ['Todos', ...gameCategories]

  return (
    <section
      ref={section}
      id="juegos"
      data-nav-theme="dark"
      className="grain relative isolate overflow-clip bg-ink py-24 text-cream sm:py-32 lg:py-40"
    >
      {/* Tinte de seccion segun el juego activo */}
      <div
        ref={glow}
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0"
        style={{ maskImage: 'radial-gradient(70% 55% at 50% 45%, #000 0%, transparent 100%)' }}
      />
      <div className="grain-layer opacity-25" aria-hidden />

      <div className="shell relative">
        {/* Encabezado */}
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="type-mono text-cream/40">02 — Catalogo</p>
            <MaskedLines
              className="type-display mt-5 text-cream"
              lines={[<>Descubre</>, <>tu juego.</>]}
            />
          </div>

          <Reveal className="lg:col-span-5 lg:pb-3" delay={0.15}>
            <p className="type-body max-w-[42ch] text-cream/60">
              {filtered.length} juegos disponibles en la mesa, de partidas de 15 minutos a tardes
              completas. Si no conoces ninguno, mejor: te ensenamos el que elijas.
            </p>
          </Reveal>
        </div>

        {/* Filtros */}
        <Reveal className="mt-14 lg:mt-20" delay={0.1}>
          <div className="scrollbar-none -mx-[clamp(1rem,4vw,4.5rem)] flex gap-2 overflow-x-auto px-[clamp(1rem,4vw,4.5rem)] pb-1 lg:mx-0 lg:flex-wrap lg:px-0">
            {chips.map((c) => {
              const on = filter === c
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFilter(c)}
                  aria-pressed={on}
                  className={`type-mono shrink-0 rounded-full border px-5 py-2.5 transition-colors duration-400 ${
                    on
                      ? 'border-cream bg-cream text-ink'
                      : 'border-cream/20 text-cream/60 hover:border-cream/60 hover:text-cream'
                  }`}
                >
                  {c}
                </button>
              )
            })}
          </div>
        </Reveal>

        {/* Indice (desktop) */}
        <ul
          ref={list}
          className="mt-10 hidden border-t border-cream/12 lg:block"
          onMouseLeave={() => setActive(null)}
        >
          {filtered.map((game, i) => (
            <GameCard
              key={game.id}
              game={game}
              index={i}
              layout="row"
              active={active?.id === game.id}
              onOpen={setSelected}
              onHover={setActive}
              onLeave={() => setActive(null)}
            />
          ))}
        </ul>

        {/* Carrusel (movil y tablet) */}
        <ul className="scrollbar-none -mx-[clamp(1rem,4vw,4.5rem)] mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[clamp(1rem,4vw,4.5rem)] pb-4 lg:hidden">
          {filtered.map((game, i) => (
            <GameCard key={game.id} game={game} index={i} layout="card" onOpen={setSelected} />
          ))}
        </ul>

        <Reveal className="mt-10">
          <p className="type-mono text-cream/35">
            El catalogo crece cada semana · Pulsa un juego para ver su ficha
          </p>
        </Reveal>
      </div>

      {/* Lamina que sigue al cursor */}
      {hoverable && (
        <div
          ref={preview}
          aria-hidden
          className="pointer-events-none invisible fixed top-0 left-0 z-30 -ml-32 -mt-40 h-80 w-64 overflow-hidden rounded-xl opacity-0 shadow-2xl"
        >
          {games.map((g) => (
            <img
              key={g.id}
              src={asset(g.image)}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover transition-opacity duration-400"
              style={{ opacity: active?.id === g.id ? 1 : 0 }}
            />
          ))}
        </div>
      )}

      <GameModal game={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
