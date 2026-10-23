import { useEffect, useRef } from 'react'
import { accentVar } from '@/data/games'
import { site } from '@/data/site'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import { lockScroll } from '@/hooks/useSmoothScroll'
import { asset } from '@/lib/asset'
import { gsap } from '@/lib/gsap'
import { formatDuration, formatPlayers, type Game } from '@/types/game'
import { ActionButton } from './ui/ActionButton'

interface GameModalProps {
  game: Game | null
  onClose: () => void
}

export function GameModal({ game, onClose }: GameModalProps) {
  const root = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const lastFocused = useRef<HTMLElement | null>(null)
  const reduced = useReducedMotion()

  /* Entrada animada + bloqueo de scroll + foco */
  useEffect(() => {
    if (!game) return

    lastFocused.current = document.activeElement as HTMLElement
    lockScroll(true)

    const ctx = gsap.context(() => {
      if (reduced) {
        // Sin animacion, pero la ficha igual tiene que verse
        gsap.set(root.current, { autoAlpha: 1 })
        return
      }
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.to(root.current, { autoAlpha: 1, duration: 0.3, ease: 'power2.out' })
        .from(panel.current, { yPercent: 6, scale: 0.97, duration: 0.8 }, 0)
        .from('[data-modal-media]', { scale: 1.12, duration: 1.2 }, 0.05)
        .from('[data-modal-el]', { y: 26, opacity: 0, duration: 0.7, stagger: 0.055 }, 0.12)
    }, root)

    closeBtn.current?.focus({ preventScroll: true })

    return () => {
      ctx.revert()
      lockScroll(false)
      lastFocused.current?.focus({ preventScroll: true })
    }
  }, [game, reduced])

  /* Esc para cerrar + foco atrapado dentro del panel */
  useEffect(() => {
    if (!game) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab' || !panel.current) return

      const focusables = panel.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (!focusables.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [game, onClose])

  if (!game) return null

  const accent = accentVar[game.accent]

  const meta = [
    { label: 'Jugadores', value: formatPlayers(game) },
    { label: 'Duracion', value: formatDuration(game) },
    { label: 'Dificultad', value: game.difficulty },
    { label: 'Categoria', value: game.categories.join(' · ') },
  ]

  return (
    <div
      ref={root}
      className="invisible fixed inset-0 z-[70] opacity-0"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-titulo"
    >
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 size-full cursor-default bg-ink/80 backdrop-blur-md"
      />

      <div className="pointer-events-none absolute inset-0 grid place-items-center p-3 sm:p-6">
        <div
          ref={panel}
          className="pointer-events-auto relative flex max-h-[94svh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-cream text-ink shadow-2xl lg:flex-row"
        >
          {/* Media */}
          <div className="relative shrink-0 overflow-hidden lg:w-[42%]">
            <div className="aspect-16/9 w-full overflow-hidden lg:h-full lg:aspect-auto">
              <img
                data-modal-media
                src={asset(game.image)}
                alt={`Arte de ${game.name}`}
                className="size-full object-cover will-change-transform"
              />
            </div>
            <span
              className="type-mono absolute top-4 left-4 rounded-full px-3 py-1.5 text-ink"
              style={{ backgroundColor: accent }}
            >
              {game.categories[0]}
            </span>
          </div>

          {/* Contenido */}
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain p-6 sm:p-9 lg:p-11">
            <p data-modal-el className="type-mono text-ink/45">
              Ficha del juego
            </p>

            <h3 data-modal-el id="modal-titulo" className="type-display mt-3">
              {game.name}
            </h3>

            <p data-modal-el className="type-lead mt-3 max-w-[38ch]" style={{ color: accent }}>
              {game.tagline}
            </p>

            <p data-modal-el className="type-body mt-5 max-w-[48ch] text-ink/75">
              {game.description}
            </p>

            <dl data-modal-el className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-ink/12 pt-6">
              {meta.map((m) => (
                <div key={m.label}>
                  <dt className="type-mono text-ink/45">{m.label}</dt>
                  <dd className="mt-1.5 font-display text-xl leading-none uppercase">{m.value}</dd>
                </div>
              ))}
            </dl>

            {game.tip && (
              <p
                data-modal-el
                className="type-body mt-7 border-l-2 pl-4 text-ink/70"
                style={{ borderColor: accent }}
              >
                {game.tip}
              </p>
            )}

            <div data-modal-el className="mt-9 flex flex-wrap items-center gap-3">
              <ActionButton href={site.joinUrl} variant="ink" className="shrink-0">
                Quiero jugarlo
              </ActionButton>
              <p className="type-mono text-ink/45">{site.meta}</p>
            </div>
          </div>

          {/* Cerrar */}
          <button
            ref={closeBtn}
            type="button"
            onClick={onClose}
            aria-label="Cerrar ficha"
            className="absolute top-4 right-4 grid size-11 place-items-center rounded-full bg-ink text-cream transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:rotate-90"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
