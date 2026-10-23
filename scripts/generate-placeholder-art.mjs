/**
 * Generador de arte placeholder local (SVG) para el prototipo.
 *
 * Produce composiciones geometricas deterministas con la paleta de la marca,
 * de modo que el proyecto NO depende de imagenes externas que puedan caerse.
 *
 * Uso:  npm run art
 *
 * Para reemplazar por fotografias reales ver: public/images/README.md
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const C = {
  cream: '#F2EBDD',
  bone: '#E4D9C4',
  ink: '#101319',
  navy: '#0C1A2B',
  red: '#E0472A',
  orange: '#F0792B',
  yellow: '#F2B01E',
  blue: '#2B5BD7',
  green: '#1F6B4F',
}

/* PRNG determinista (mulberry32) para que el arte sea siempre identico */
function rng(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const W = 1200
const H = 1500

const grain = [
  '<filter id="grain" x="-10%" y="-10%" width="120%" height="120%">',
  '<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" result="n"/>',
  '<feColorMatrix type="saturate" values="0" in="n" result="d"/>',
  '<feComponentTransfer in="d" result="g"><feFuncA type="linear" slope="0.14"/></feComponentTransfer>',
  '<feBlend in="SourceGraphic" in2="g" mode="multiply"/>',
  '</filter>',
].join('')

const pipMap = {
  1: [[2, 2]],
  2: [[1, 1], [3, 3]],
  3: [[1, 1], [2, 2], [3, 3]],
  4: [[1, 1], [3, 1], [1, 3], [3, 3]],
  5: [[1, 1], [3, 1], [2, 2], [1, 3], [3, 3]],
  6: [[1, 1], [3, 1], [1, 2], [3, 2], [1, 3], [3, 3]],
}

const patterns = {
  /* Dados aislados en el espacio */
  dice(r, a, b) {
    let out = ''
    for (let i = 0; i < 7; i++) {
      const s = 110 + r() * 230
      const x = 80 + r() * (W - 260)
      const y = 90 + r() * (H - 300)
      const rot = -28 + r() * 56
      const fill = r() > 0.55 ? a : b
      const pips = 1 + Math.floor(r() * 6)
      const g = s / 4
      let dots = ''
      for (const [cx, cy] of pipMap[pips]) {
        dots += '<circle cx="' + (cx * g).toFixed(1) + '" cy="' + (cy * g).toFixed(1) +
          '" r="' + (s * 0.055).toFixed(1) + '" fill="' + C.cream + '" opacity="0.92"/>'
      }
      out += '<g transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' +
        rot.toFixed(1) + ' ' + s / 2 + ' ' + s / 2 + ')">' +
        '<rect width="' + s.toFixed(1) + '" height="' + s.toFixed(1) + '" rx="' +
        (s * 0.18).toFixed(1) + '" fill="' + fill + '"/>' + dots + '</g>'
    }
    return out
  },

  /* Reticula hexagonal tipo mapa modular */
  hex(r, a, b) {
    const R = 112
    const dx = R * Math.sqrt(3)
    const dy = R * 1.5
    let out = ''
    for (let row = -1; row < H / dy + 1; row++) {
      for (let col = -1; col < W / dx + 1; col++) {
        const cx = col * dx + (row % 2 ? dx / 2 : 0)
        const cy = row * dy
        const v = r()
        if (v < 0.22) continue
        const fill = v > 0.86 ? C.yellow : v > 0.6 ? a : b
        const pts = []
        for (let i = 0; i < 6; i++) {
          const ang = (Math.PI / 180) * (60 * i - 30)
          pts.push(
            (cx + R * 0.92 * Math.cos(ang)).toFixed(1) + ',' +
            (cy + R * 0.92 * Math.sin(ang)).toFixed(1),
          )
        }
        out += '<polygon points="' + pts.join(' ') + '" fill="' + fill +
          '" opacity="' + (0.55 + r() * 0.45).toFixed(2) + '"/>'
      }
    }
    return out
  },

  /* Abanico de cartas */
  cards(r, a, b) {
    let out = ''
    const w = 420
    const h = 620
    for (let i = 0; i < 6; i++) {
      const rot = -42 + i * 17 + (r() * 4 - 2)
      const fill = i % 2 ? a : b
      out += '<g transform="translate(' + (W / 2 - w / 2) + ' ' + (H / 2 - h / 2 + 90) +
        ') rotate(' + rot.toFixed(1) + ' ' + w / 2 + ' ' + h + ')">' +
        '<rect width="' + w + '" height="' + h + '" rx="34" fill="' + fill + '"/>' +
        '<rect x="34" y="34" width="' + (w - 68) + '" height="' + (h - 68) +
        '" rx="18" fill="none" stroke="' + C.cream + '" stroke-opacity="0.35" stroke-width="5"/>' +
        '<circle cx="' + w / 2 + '" cy="' + h / 2 + '" r="' + (72 + r() * 40).toFixed(0) +
        '" fill="' + C.cream + '" opacity="0.16"/></g>'
    }
    return out
  },

  /* Losetas desplazadas */
  tiles(r, a, b) {
    let out = ''
    const cols = 4
    const rows = 5
    const cw = W / cols
    const ch = H / rows
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const v = r()
        const fill = v > 0.82 ? C.yellow : v > 0.5 ? a : b
        const inset = 10 + r() * 26
        out += '<rect x="' + (x * cw + inset).toFixed(1) + '" y="' + (y * ch + inset).toFixed(1) +
          '" width="' + (cw - inset * 2).toFixed(1) + '" height="' + (ch - inset * 2).toFixed(1) +
          '" rx="18" fill="' + fill + '" opacity="' + (0.5 + r() * 0.5).toFixed(2) + '"/>'
        if (r() > 0.6) {
          out += '<circle cx="' + (x * cw + cw / 2).toFixed(1) + '" cy="' +
            (y * ch + ch / 2).toFixed(1) + '" r="' + (26 + r() * 46).toFixed(1) +
            '" fill="' + C.cream + '" opacity="0.2"/>'
        }
      }
    }
    return out
  },

  /* Meeples flotando */
  meeples(r, a, b) {
    const meeple = 'M60 8c13 0 23 10 23 22 0 7-3 13-8 17 17 5 29 19 29 37v8c0 5-4 9-9 9H25c-5 0-9-4-9-9v-8c0-18 12-32 29-37-5-4-8-10-8-17C37 18 47 8 60 8z'
    let out = ''
    for (let i = 0; i < 9; i++) {
      const s = 0.6 + r() * 1.5
      const x = 60 + r() * (W - 240)
      const y = 60 + r() * (H - 300)
      const rot = -22 + r() * 44
      const v = r()
      const fill = v > 0.6 ? C.yellow : v > 0.4 ? a : b
      out += '<g transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') scale(' +
        s.toFixed(2) + ') rotate(' + rot.toFixed(1) + ')">' +
        '<path d="' + meeple + '" fill="' + fill + '"/></g>'
    }
    return out
  },

  /* Tablero de ajedrez en perspectiva */
  chess(r, a, b) {
    let out = '<g transform="translate(' + W / 2 + ' ' + H * 0.58 + ') rotate(-12) skewX(-14) scale(1.05)">'
    const n = 8
    const c = 150
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        if ((x + y) % 2 === 0) continue
        out += '<rect x="' + (x - n / 2) * c + '" y="' + (y - n / 2) * c + '" width="' + c +
          '" height="' + c + '" fill="' + a + '" opacity="' + (0.4 + r() * 0.6).toFixed(2) + '"/>'
      }
    }
    out += '</g>'
    for (let i = 0; i < 4; i++) {
      const x = 180 + r() * (W - 360)
      const y = 180 + r() * (H - 420)
      const s = 0.9 + r() * 1.1
      out += '<g transform="translate(' + x.toFixed(0) + ' ' + y.toFixed(0) + ') scale(' + s.toFixed(2) + ')">' +
        '<circle cx="0" cy="-70" r="52" fill="' + b + '"/>' +
        '<path d="M-56 96c0-38 22-58 22-86h68c0 28 22 48 22 86z" fill="' + b + '"/>' +
        '<rect x="-74" y="96" width="148" height="30" rx="14" fill="' + b + '"/></g>'
    }
    return out
  },

  /* Burbujas / pistas */
  orbs(r, a, b) {
    let out = ''
    for (let i = 0; i < 26; i++) {
      const rad = 30 + r() * 170
      const x = r() * W
      const y = r() * H
      const v = r()
      const fill = v > 0.85 ? C.yellow : v > 0.5 ? a : b
      out += '<circle cx="' + x.toFixed(0) + '" cy="' + y.toFixed(0) + '" r="' + rad.toFixed(0) +
        '" fill="' + fill + '" opacity="' + (0.25 + r() * 0.6).toFixed(2) + '"/>'
    }
    return out
  },
}

/* id -> [patron, colorA, colorB, fondo] */
const artMap = {
  catan: ['hex', C.orange, C.red, C.navy],
  carcassonne: ['tiles', C.green, C.blue, C.cream],
  'siete-maravillas': ['cards', C.yellow, C.orange, C.ink],
  codenames: ['tiles', C.blue, C.ink, C.cream],
  dixit: ['orbs', C.blue, C.green, C.navy],
  jaipur: ['cards', C.red, C.yellow, C.cream],
  hanabi: ['orbs', C.yellow, C.red, C.ink],
  pandemic: ['orbs', C.green, C.blue, C.ink],
  avalon: ['meeples', C.red, C.navy, C.cream],
  ajedrez: ['chess', C.ink, C.red, C.cream],
}

const community = [
  ['comunidad-01', 'dice', C.red, C.orange, C.navy],
  ['comunidad-02', 'meeples', C.yellow, C.green, C.ink],
  ['comunidad-03', 'tiles', C.blue, C.red, C.cream],
  ['comunidad-04', 'dice', C.green, C.yellow, C.navy],
]

function hashSeed(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function build(id, pattern, a, b, bg, label) {
  const r = rng(hashSeed(id))
  const dark = bg !== C.cream && bg !== C.bone
  const tag = dark ? C.cream : C.ink
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" width="' + W +
      '" height="' + H + '" role="img" aria-label="' + label + '">',
    '<defs>' + grain + '<clipPath id="c"><rect width="' + W + '" height="' + H + '"/></clipPath></defs>',
    '<g clip-path="url(#c)" filter="url(#grain)">',
    '<rect width="' + W + '" height="' + H + '" fill="' + bg + '"/>',
    patterns[pattern](r, a, b),
    '</g>',
    '<g clip-path="url(#c)" opacity="0.5">',
    '<rect x="40" y="' + (H - 108) + '" width="372" height="56" rx="28" fill="' + tag + '" opacity="0.14"/>',
    '<text x="68" y="' + (H - 71) + '" font-family="monospace" font-size="24" letter-spacing="2" fill="' +
      tag + '">PLACEHOLDER / REEMPLAZAR</text>',
    '</g>',
    '</svg>',
  ].join('\n')
}

mkdirSync(resolve(root, 'public/images/games'), { recursive: true })
mkdirSync(resolve(root, 'public/images/community'), { recursive: true })

let count = 0
for (const [id, [pattern, a, b, bg]] of Object.entries(artMap)) {
  writeFileSync(
    resolve(root, 'public/images/games/' + id + '.svg'),
    build(id, pattern, a, b, bg, 'Arte placeholder de ' + id),
  )
  count++
}
for (const [id, pattern, a, b, bg] of community) {
  writeFileSync(
    resolve(root, 'public/images/community/' + id + '.svg'),
    build(id, pattern, a, b, bg, 'Foto placeholder de comunidad ' + id),
  )
  count++
}
console.log(count + ' archivos SVG generados en public/images/')
