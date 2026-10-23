import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/**
 * El sitio publicado vive en https://inotchill.github.io/Jugada-Maestra/, es
 * decir en un subdirectorio, no en la raiz del dominio. Por eso el build lleva
 * `base`: sin el, el HTML pediria /assets/... y GitHub devolveria 404 (pagina
 * en blanco).
 *
 * En desarrollo se queda en '/' para no tener que escribir el subpath a mano.
 *
 * Si algun dia se usa un dominio propio, basta con dejar PROD_BASE en '/'.
 */
const PROD_BASE = '/Jugada-Maestra/'

export default defineConfig(({ command }) => ({
  base: command === 'build' ? PROD_BASE : '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // El chunk de three.js es grande a proposito: va aparte y se carga
    // en diferido, despues del primer paint del hero.
    chunkSizeWarningLimit: 1100,
    rollupOptions: {
      output: {
        // three.js es el chunk pesado: se separa para no bloquear el primer paint
        manualChunks(id: string) {
          if (id.includes('three') || id.includes('@react-three')) return 'three'
          if (id.includes('gsap')) return 'gsap'
          return undefined
        },
      },
    },
  },
}))
