export type GameCategory =
  | 'Estrategia'
  | 'Party'
  | 'Cooperativo'
  | 'Cartas'
  | 'Deduccion'
  | 'Familiar'
  | 'Competitivo'

export type GameDifficulty = 'Facil' | 'Media' | 'Alta'

/** Acentos permitidos por el sistema visual (ver src/index.css). */
export type AccentKey = 'ember' | 'gold' | 'cobalt' | 'pine' | 'flare'

export interface Game {
  /** Debe coincidir con el nombre del archivo en public/images/games/<id>.svg */
  id: string
  name: string
  /** Frase corta de gancho, se muestra en el hover y en el modal */
  tagline: string
  image: string
  players: {
    min: number
    max: number
  }
  /** Duracion aproximada de una partida, en minutos */
  duration: {
    min: number
    max: number
  }
  difficulty: GameDifficulty
  categories: GameCategory[]
  description: string
  accent: AccentKey
  /** Dato curioso o consejo para quien nunca lo ha jugado */
  tip?: string
}

export const formatPlayers = (g: Game): string =>
  g.players.min === g.players.max ? `${g.players.min} jugadores` : `${g.players.min}–${g.players.max} jugadores`

export const formatDuration = (g: Game): string =>
  g.duration.min === g.duration.max ? `${g.duration.min} min` : `${g.duration.min}–${g.duration.max} min`
