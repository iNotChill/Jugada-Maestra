/**
 * Optimiza los modelos 3D del hero.
 *
 *   models-src/*.glb   (originales, fuera del repo)
 *        ↓
 *   public/models/*.glb (lo que se sirve)
 *
 * Uso:  npm run models
 *
 * Los modelos descargados vienen pensados para render offline: la carta traia
 * 438.000 triangulos y el meeple 167.000, para piezas que en pantalla ocupan
 * unos 100 px. Aqui se simplifica la malla, se recortan las texturas y se
 * comprime con meshopt.
 *
 * `ratio` es la fraccion de vertices que se conserva; cuanto mas tosca es la
 * pieza en pantalla, mas agresivo se puede ser.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, statSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const CLI = resolve(root, 'node_modules/@gltf-transform/cli/bin/cli.js')
const SRC = resolve(root, 'models-src')
const OUT = resolve(root, 'public/models')

/**
 * ratio   : fraccion de vertices que se conserva
 * error   : tolerancia de simplificacion. meshoptimizer deja de decimar en
 *           cuanto la supera, asi que con un valor muy bajo el `ratio` no se
 *           llega a cumplir (al meeple le dejaba 140.000 triangulos).
 * texture : lado maximo en px
 */
const MODELS = [
  { file: 'card.glb', ratio: 0.12, error: 0.01, texture: 1024, nota: 'el dibujo va en colores por vertice' },
  { file: 'pawn.glb', ratio: 0.25, texture: 512, nota: 'revolucion, aguanta poca malla' },
  { file: 'd20.glb', ratio: 0.4, texture: 512, nota: 'las aristas definen la pieza' },
  { file: 'die.glb', ratio: 0.5, texture: 512, nota: 'ya venia ligero' },
  { file: 'token.glb', ratio: 0.5, texture: 512, nota: 'ya venia ligero' },
]

const mb = (p) => statSync(p).size / 1048576

if (!existsSync(SRC)) {
  console.error(`No existe ${SRC}. Deja ahi los .glb originales.`)
  process.exit(1)
}
mkdirSync(OUT, { recursive: true })

let antes = 0
let despues = 0

for (const { file, ratio, error = 0.005, texture, nota } of MODELS) {
  const src = resolve(SRC, file)
  const out = resolve(OUT, file)

  if (!existsSync(src)) {
    console.warn(`· ${file.padEnd(12)} no encontrado en models-src/, se omite`)
    continue
  }

  // Se invoca el script del CLI con node: en Windows, execFileSync no puede
  // lanzar npx.cmd directamente.
  execFileSync(
    process.execPath,
    [
      CLI, 'optimize', src, out,
      // meshopt y no draco: su decodificador viene dentro de three, asi que no
      // hay que descargar nada de un CDN externo
      '--compress', 'meshopt',
      '--simplify', 'true',
      '--simplify-ratio', String(ratio),
      '--simplify-error', String(error),
      // El meeple llega partido en 7 mallas: sin unirlas, cada corte cuenta
      // como borde de la topologia y el simplificador no puede tocarlas
      '--join', 'true',
      '--join-meshes', 'true',
      '--simplify-lock-border', 'false',
      '--texture-size', String(texture),
      '--texture-compress', 'webp',
    ],
    { stdio: ['ignore', 'ignore', 'pipe'] },
  )

  const a = mb(src)
  const d = mb(out)
  antes += a
  despues += d
  console.log(
    `✓ ${file.padEnd(12)} ${a.toFixed(2).padStart(6)} MB → ${d.toFixed(2).padStart(5)} MB` +
      `  (${(100 - (d / a) * 100).toFixed(0)}% menos)  ${nota}`,
  )
}

console.log(
  `\nTotal: ${antes.toFixed(1)} MB → ${despues.toFixed(2)} MB ` +
    `(${(100 - (despues / antes) * 100).toFixed(0)}% menos)`,
)
