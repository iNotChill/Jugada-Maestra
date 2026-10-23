import type { Game, GameCategory } from '@/types/game'

/* ===========================================================================
   CATALOGO DE JUEGOS
   ---------------------------------------------------------------------------
   Este es el UNICO archivo que hay que tocar para agregar, quitar o editar un
   juego: la seccion "Descubre tu juego" se renderiza a partir de este array.

   Para agregar un juego:
     1. Copia un objeto, cambia el `id` (sin espacios ni tildes).
     2. Coloca su imagen en  public/images/games/<id>.svg|webp|avif
        y apunta `image` a esa ruta.
     3. Listo. No hace falta tocar ningun componente.
   =========================================================================== */

export const games: Game[] = [
  {
    id: 'catan',
    name: 'Catan',
    tagline: 'Negocia, construye, bloquea.',
    image: '/images/games/catan.webp',
    players: { min: 3, max: 4 },
    duration: { min: 60, max: 90 },
    difficulty: 'Media',
    categories: ['Estrategia', 'Competitivo'],
    description:
      'Una isla que se arma distinta cada partida. Consigues madera, ladrillo y trigo, levantas caminos y ciudades, y negocias con los demas mientras intentas no regalarles la victoria. El clasico que convierte a cualquiera en jugador de mesa.',
    accent: 'flare',
    tip: 'Si es tu primera vez, pide el puerto: cambiar recursos salva partidas.',
  },
  {
    id: 'carcassonne',
    name: 'Carcassonne',
    tagline: 'Construyes el mapa mientras juegas.',
    image: '/images/games/carcassonne.webp',
    players: { min: 2, max: 5 },
    duration: { min: 35, max: 45 },
    difficulty: 'Facil',
    categories: ['Estrategia', 'Familiar'],
    description:
      'Cada turno colocas una loseta y el tablero crece frente a ti: ciudades, caminos, campos y monasterios. Pones a tus meeples donde crees que vas a puntuar y rezas para que nadie se cuelgue de tu ciudad.',
    accent: 'pine',
    tip: 'Perfecto para entrar: se explica en tres minutos.',
  },
  {
    id: 'siete-maravillas',
    name: '7 Wonders',
    tagline: 'Tres eras, una civilizacion, cero tiempos muertos.',
    image: '/images/games/siete-maravillas.webp',
    players: { min: 3, max: 7 },
    duration: { min: 30, max: 40 },
    difficulty: 'Media',
    categories: ['Cartas', 'Estrategia', 'Competitivo'],
    description:
      'Todos juegan al mismo tiempo: eliges una carta, la pasas y construyes tu ciudad. Militar, ciencia, comercio o maravillas; en 30 minutos levantas un imperio y sabes exactamente en que te equivocaste.',
    accent: 'gold',
    tip: 'Mira lo que construye tu vecino antes de decidir tu carta.',
  },
  {
    id: 'codenames',
    name: 'Codenames',
    tagline: 'Una palabra. Cinco agentes. Cero pistas extra.',
    image: '/images/games/codenames.webp',
    players: { min: 4, max: 8 },
    duration: { min: 15, max: 25 },
    difficulty: 'Facil',
    categories: ['Party', 'Deduccion'],
    description:
      'Dos equipos, una grilla de palabras y un jefe de espias que solo puede dar una palabra y un numero. El resto adivina. Funciona con cuatro personas y funciona mejor con ocho gritando.',
    accent: 'cobalt',
    tip: 'El mejor juego para romper el hielo en la primera mesa.',
  },
  {
    id: 'dixit',
    name: 'Dixit',
    tagline: 'Gana quien habla raro con elegancia.',
    image: '/images/games/dixit.webp',
    players: { min: 3, max: 6 },
    duration: { min: 25, max: 35 },
    difficulty: 'Facil',
    categories: ['Party', 'Familiar'],
    description:
      'Ilustraciones oniricas y una frase ambigua. Si todos aciertan tu carta, no puntuas; si nadie acierta, tampoco. El juego premia la medida exacta de misterio y descubre como piensan tus amigos.',
    accent: 'cobalt',
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    tagline: 'Duelo de mercaderes, puro pulso.',
    image: '/images/games/jaipur.svg',
    players: { min: 2, max: 2 },
    duration: { min: 20, max: 30 },
    difficulty: 'Facil',
    categories: ['Cartas', 'Competitivo'],
    description:
      'Solo para dos. Compras especias, acumulas camellos y decides cuando vender para quedarte con las fichas mas valiosas. Rapido, tenso y adictivo: casi nunca se juega una sola partida.',
    accent: 'ember',
    tip: 'Ideal si llegas solo y buscas con quien jugar.',
  },
  {
    id: 'hanabi',
    name: 'Hanabi',
    tagline: 'Ves las cartas de todos menos las tuyas.',
    image: '/images/games/hanabi.webp',
    players: { min: 2, max: 5 },
    duration: { min: 20, max: 30 },
    difficulty: 'Media',
    categories: ['Cooperativo', 'Cartas'],
    description:
      'Un cooperativo al reves: sostienes tus cartas mirando hacia afuera y dependes de las pistas que te den los demas para lanzar los fuegos artificiales en orden. Ganan todos o pierden todos.',
    accent: 'gold',
  },
  {
    id: 'pandemic',
    name: 'Pandemic',
    tagline: 'El tablero juega contra la mesa entera.',
    image: '/images/games/pandemic.webp',
    players: { min: 2, max: 4 },
    duration: { min: 45, max: 60 },
    difficulty: 'Alta',
    categories: ['Cooperativo', 'Estrategia'],
    description:
      'Cada jugador tiene un rol con una habilidad unica y todos comparten el mismo objetivo: contener cuatro brotes y encontrar las curas antes de que el mapa se desborde. Se gana hablando, no compitiendo.',
    accent: 'pine',
    tip: 'Trae paciencia: la primera partida se pierde y se disfruta igual.',
  },
  {
    id: 'avalon',
    name: 'Avalon',
    tagline: 'Alguien en esta mesa esta mintiendo.',
    image: '/images/games/avalon.webp',
    players: { min: 5, max: 10 },
    duration: { min: 30, max: 40 },
    difficulty: 'Media',
    categories: ['Deduccion', 'Party'],
    description:
      'Leales y traidores alrededor de la misma mesa. Se proponen misiones, se discute, se desconfia y se vota. No hay dados ni fichas: el juego entero pasa por como mira la gente cuando habla.',
    accent: 'ember',
  },
  {
    id: 'ajedrez',
    name: 'Ajedrez',
    tagline: 'Siempre hay un tablero libre.',
    image: '/images/games/ajedrez.webp',
    players: { min: 2, max: 2 },
    duration: { min: 15, max: 60 },
    difficulty: 'Alta',
    categories: ['Competitivo', 'Estrategia'],
    description:
      'El tablero que no necesita presentacion. Tenemos relojes para partidas rapidas de 10 minutos y gente dispuesta a ensenarte las aperturas si recien empiezas.',
    accent: 'ember',
    tip: 'Hay mesa de blitz casi todos los viernes.',
  },
]

/** Categorias presentes en el catalogo, derivadas del array (sin duplicados). */
export const gameCategories: GameCategory[] = Array.from(
  new Set(games.flatMap((g) => g.categories)),
).sort() as GameCategory[]

export const accentVar: Record<Game['accent'], string> = {
  ember: 'var(--color-ember)',
  flare: 'var(--color-flare)',
  gold: 'var(--color-gold)',
  cobalt: 'var(--color-cobalt)',
  pine: 'var(--color-pine)',
}
