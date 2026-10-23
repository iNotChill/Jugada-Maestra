import { games } from '@/data/games'

/* ===========================================================================
   DATOS DEL GRUPO
   Todo el contenido editable del sitio (horario, sede, enlaces, pasos y
   fotos de comunidad) vive aqui.
   =========================================================================== */

export const site = {
  name: 'Jugada Maestra',
  shortName: 'JM',
  claim: 'Tu proxima partida empieza aqui.',
  day: 'Viernes',
  time: '1:00 PM — 3:00 PM',
  venue: 'Sede San Isidro',
  meta: 'Viernes · 1:00 PM — 3:00 PM · Sede San Isidro',

  /** TODO: reemplazar por el enlace real de inscripcion (WhatsApp, formulario, etc.) */
  joinUrl: '#sumarse',
  /** TODO: reemplazar por el usuario real del grupo */
  instagram: '@jugadamaestra',
}

export const navLinks = [
  { label: 'Juegos', href: '#juegos' },
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Comunidad', href: '#comunidad' },
  { label: 'Viernes', href: '#viernes' },
] as const

export interface Step {
  index: string
  title: string
  copy: string
  accent: 'ember' | 'gold' | 'cobalt' | 'pine'
}

export const steps: Step[] = [
  {
    index: '01',
    title: 'Llega',
    copy: 'Ven a la sede San Isidro cualquier viernes. No hay lista, no hay cuota, no hay que avisar: entras y ya estas dentro.',
    accent: 'ember',
  },
  {
    index: '02',
    title: 'Elige',
    copy: 'Mira las mesas, pregunta que estan jugando y encuentra un juego que quieras probar. Siempre hay alguien explicando reglas.',
    accent: 'gold',
  },
  {
    index: '03',
    title: 'Juega',
    copy: 'Forma una mesa con quien este libre y empieza la partida. Dos horas alcanzan para dos juegos cortos o uno grande.',
    accent: 'cobalt',
  },
  {
    index: '04',
    title: 'Repite',
    copy: 'Descubre un juego nuevo cada semana. El catalogo crece y la gente que vuelve se termina conociendo sola.',
    accent: 'pine',
  },
]

export interface CommunityPhoto {
  src: string
  alt: string
  /** Pie visible sobre la foto */
  caption: string
}

export const communityPhotos: CommunityPhoto[] = [
  { src: '/images/community/comunidad-01.webp', alt: 'Mesa de juego en una reunion del grupo', caption: 'Mesa de los viernes' },
  { src: '/images/community/comunidad-02.webp', alt: 'Jugadores alrededor de un tablero', caption: 'Primera partida' },
  { src: '/images/community/comunidad-03.webp', alt: 'Detalle de fichas y losetas sobre la mesa', caption: 'Catalogo abierto' },
  { src: '/images/community/comunidad-04.webp', alt: 'Grupo celebrando el final de una partida', caption: 'Revancha pedida' },
]

/* La cifra sale del propio catalogo: al anadir o quitar un juego en
   games.ts se actualiza sola y nunca queda desfasada. */
export const stats = [
  { value: `${games.length}`, label: 'Juegos en el catalogo' },
  { value: '2 h', label: 'Cada viernes' },
  { value: '0', label: 'Experiencia requerida' },
]
