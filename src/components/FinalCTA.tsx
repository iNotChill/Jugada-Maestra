import { site } from '@/data/site'
import { ActionButton } from './ui/ActionButton'
import { Marquee } from './ui/Marquee'
import { MaskedLines } from './ui/MaskedLines'
import { Reveal } from './ui/Reveal'

export function FinalCTA() {
  return (
    <section
      id="sumarse"
      data-nav-theme="dark"
      className="grain relative overflow-clip bg-ember text-cream"
    >
      <div className="grain-layer opacity-25" aria-hidden />

      {/* Cinta de cierre */}
      <div className="border-y border-cream/20 py-5">
        <Marquee
          items={['Tu proxima partida empieza aqui', 'Viernes 1:00 PM', 'Sede San Isidro']}
          speed={34}
          className="text-cream/80"
        />
      </div>

      <div className="shell relative py-24 sm:py-32 lg:py-40">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <MaskedLines
              className="type-display"
              lines={[<>¿Te sumas</>, <>a la partida?</>]}
            />
          </div>

          <Reveal className="lg:col-span-4" delay={0.12} stagger={0.12}>
            <p className="type-body max-w-[32ch] text-cream/80">
              No importa si vienes por primera vez o si ya tienes tu juego favorito.
            </p>
            <div className="mt-8">
              <ActionButton href={site.joinUrl} variant="light" className="px-8 py-5">
                Quiero jugar
              </ActionButton>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-20 border-t border-cream/25 pt-8 lg:mt-28" delay={0.1}>
          <p className="font-display text-[clamp(1.1rem,2.6vw,2.2rem)] leading-none tracking-tight uppercase">
            {site.meta}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
