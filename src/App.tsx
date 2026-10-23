import { useEffect } from 'react'
import { Community } from './components/Community'
import { FinalCTA } from './components/FinalCTA'
import { Footer } from './components/Footer'
import { FridaySection } from './components/FridaySection'
import { GameExplorer } from './components/GameExplorer'
import { Hero } from './components/Hero'
import { HowItWorks } from './components/HowItWorks'
import { Navbar } from './components/Navbar'
import { CustomCursor } from './components/ui/CustomCursor'
import { Marquee } from './components/ui/Marquee'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { ScrollTrigger } from './lib/gsap'

export default function App() {
  useSmoothScroll()

  /* Las imagenes y las fuentes cambian la altura del documento:
     recalcular los triggers evita desfases en los pines */
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    const id = window.setTimeout(refresh, 600)
    return () => {
      window.removeEventListener('load', refresh)
      window.clearTimeout(id)
    }
  }, [])

  return (
    <>
      <a
        href="#juegos"
        className="type-mono sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-cream"
      >
        Saltar al catalogo
      </a>

      <CustomCursor />
      <Navbar />

      <main>
        <Hero />

        {/* Banda de transicion: cambia el fondo a oscuro y da impulso
            antes de entrar al catalogo */}
        <div data-nav-theme="dark" className="relative overflow-clip bg-ink py-6 text-cream">
          <Marquee
            items={['Tu proxima partida empieza aqui', 'Juega', 'Conoce', 'Compite']}
            speed={30}
            className="text-cream/90"
          />
        </div>

        <GameExplorer />
        <HowItWorks />
        <Community />
        <FridaySection />
        <FinalCTA />
      </main>

      <Footer />
    </>
  )
}
