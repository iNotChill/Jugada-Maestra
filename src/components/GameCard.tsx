import { accentVar } from '@/data/games'
import { formatDuration, formatPlayers, type Game } from '@/types/game'

interface GameCardProps {
  game: Game
  index: number
  /** 'row' = indice editorial (desktop) · 'card' = tarjeta deslizable (movil) */
  layout: 'row' | 'card'
  active?: boolean
  onOpen: (game: Game) => void
  onHover?: (game: Game) => void
  onLeave?: () => void
}

export function GameCard({ game, index, layout, active, onOpen, onHover, onLeave }: GameCardProps) {
  const accent = accentVar[game.accent]

  /* ---------------------------------------------------------------- fila */
  if (layout === 'row') {
    return (
      <li
        data-game-item
        className="group relative border-b border-cream/12"
        onMouseEnter={() => onHover?.(game)}
        onMouseLeave={onLeave}
      >
        <button
          type="button"
          onClick={() => onOpen(game)}
          data-cursor="Ver"
          aria-label={`Ver detalles de ${game.name}`}
          className="relative flex w-full items-center gap-6 py-6 text-left xl:py-7"
        >
          {/* Relleno de acento que sube al pasar el mouse */}
          <span
            aria-hidden
            className="absolute inset-x-[-1.5rem] inset-y-0 -z-10 origin-bottom scale-y-0 opacity-0 transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100 group-hover:opacity-[0.07]"
            style={{ backgroundColor: accent }}
          />

          <span
            className="type-mono w-10 shrink-0 tabular-nums transition-colors duration-500"
            style={{ color: active ? accent : undefined }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>

          <span className="relative flex min-w-0 flex-1 items-baseline gap-5">
            <span
              className="type-title block shrink-0 text-cream transition-[transform,color] duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3"
              style={{ color: active ? accent : undefined }}
            >
              {game.name}
            </span>
            <span className="type-mono hidden min-w-0 truncate text-cream/45 transition-opacity duration-500 group-hover:opacity-0 xl:block">
              {game.tagline}
            </span>
          </span>

          <span className="type-mono hidden shrink-0 items-center gap-6 text-cream/55 md:flex">
            <span className="w-28 text-right">{formatPlayers(game)}</span>
            <span className="w-24 text-right">{formatDuration(game)}</span>
            <span className="w-20 text-right">{game.difficulty}</span>
            <span className="w-28 text-right" style={{ color: accent }}>
              {game.categories[0]}
            </span>
          </span>

          <span
            aria-hidden
            className="grid size-9 shrink-0 place-items-center rounded-full border border-cream/20 text-cream transition-all duration-500 group-hover:border-transparent"
            style={active ? { backgroundColor: accent, color: 'var(--color-ink)' } : undefined}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 6h10M6.5 1.5 11 6l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </span>
        </button>
      </li>
    )
  }

  /* -------------------------------------------------------------- tarjeta */
  return (
    <li
      data-game-item
      className="w-[78vw] max-w-[22rem] shrink-0 snap-center sm:w-[20rem]"
    >
      <button
        type="button"
        onClick={() => onOpen(game)}
        className="group flex h-full w-full flex-col text-left"
        aria-label={`Ver detalles de ${game.name}`}
      >
        <span className="relative block aspect-4/5 w-full overflow-hidden rounded-2xl bg-ink/40">
          <img
            src={game.image}
            alt=""
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-active:scale-105"
          />
          <span
            className="type-mono absolute top-3 left-3 rounded-full px-3 py-1.5 text-ink"
            style={{ backgroundColor: accent }}
          >
            {game.categories[0]}
          </span>
        </span>

        <span className="mt-4 flex items-baseline justify-between gap-3">
          <span className="type-title text-cream">{game.name}</span>
          <span className="type-mono text-cream/40">{String(index + 1).padStart(2, '0')}</span>
        </span>

        <span className="type-body mt-1 block text-cream/55">{game.tagline}</span>

        <span className="type-mono mt-4 flex flex-wrap gap-x-4 gap-y-1 text-cream/45">
          <span>{formatPlayers(game)}</span>
          <span>{formatDuration(game)}</span>
          <span>{game.difficulty}</span>
        </span>
      </button>
    </li>
  )
}
