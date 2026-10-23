import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
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
})
