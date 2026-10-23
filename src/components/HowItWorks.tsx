import { useEffect, useRef, useState } from 'react'
import { steps } from '@/data/site'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import { gsap } from '@/lib/gsap'
import { StepVisual } from './ui/StepVisual'
import { MaskedLines } from './ui/MaskedLines'
import { Reveal } from './ui/Reveal'

const accentVars: Record<string, string> = {
  ember: 'var(--color-ember)',
  gold: 'var(--color-gold)',
  cobalt: 'var(--color-cobalt)',
  pine: 'var(--color-pine)',
}

/**
 * "Como funciona" como relato: en desktop la seccion se fija y cada etapa
 * sustituye a la anterior con su propia composicion visual mientras el usuario
 * hace scroll. En movil se convierte en cuatro bloques revelados en secuencia,
 * sin pin (que en tactil suele sentirse pegajoso).
 */
export function HowItWorks() {
  const wrap = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return

    const mm = gsap.matchMedia()

    mm.add('(min-width: 1024px)', () => {
      const panels = gsap.utils.toArray<HTMLElement>('[data-step-panel]', stage.current)
      if (panels.length < 2) return

      gsap.set(panels.slice(1), { autoAlpha: 0, yPercent: 8 })
      gsap.set(panels[0], { autoAlpha: 1, yPercent: 0 })

      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: wrap.current,
          start: 'top top',
          end: () => `+=${(panels.length - 1) * 95}%`,
          pin: stage.current,
          scrub: 0.6,
          anticipatePin: 1,
          onUpdate: (self) => {
            const i = Math.round(self.progress * (panels.length - 1))
            setCurrent((prev) => (prev === i ? prev : i))
          },
        },
      })

      /* La etapa saliente desaparece ANTES de que entre la siguiente: dos
         bloques de texto superpuestos a media opacidad se leen fatal. */
      panels.forEach((panel, i) => {
        if (i === 0) return
        tl.to(panels[i - 1], { autoAlpha: 0, yPercent: -7, duration: 0.42 }, i - 1)
        tl.to(panel, { autoAlpha: 1, yPercent: 0, duration: 0.42 }, i - 1 + 0.5)
      })

      return () => {
        gsap.set(panels, { clearProps: 'all' })
      }
    })

    return () => mm.revert()
  }, [reduced])

  return (
    <section
      id="como-funciona"
      data-nav-theme="light"
      className="relative bg-paper text-ink"
    >
      <div className="shell pt-24 sm:pt-32 lg:pt-40">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="type-mono text-ink/40">03 — El plan</p>
            <MaskedLines className="type-display mt-5" lines={[<>Como</>, <>funciona.</>]} />
          </div>
          <Reveal className="lg:col-span-5 lg:pb-3" delay={0.1}>
            <p className="type-body max-w-[40ch] text-ink/60">
              No hay inscripcion, ni niveles, ni equipos fijos. Cuatro pasos y ya estas jugando.
            </p>
          </Reveal>
        </div>
      </div>

      {/* ------------------------------------------------- relato con pin */}
      <div ref={wrap} className="relative hidden lg:block">
        <div ref={stage} className="relative flex h-[100svh] items-center overflow-clip">
          <div className="shell w-full">
            <div className="relative grid grid-cols-12 items-center gap-12">
              {/* indicador de etapas */}
              <div className="col-span-1">
                <ul className="flex flex-col gap-5">
                  {steps.map((s, i) => (
                    <li key={s.index} className="flex items-center gap-3">
                      <span
                        className="block h-px transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        style={{
                          width: i === current ? '2.5rem' : '1rem',
                          backgroundColor:
                            i === current ? accentVars[steps[i].accent] : 'rgba(16,19,25,0.25)',
                        }}
                      />
                      <span
                        className="type-mono transition-opacity duration-500"
                        style={{ opacity: i === current ? 1 : 0.3 }}
                      >
                        {s.index}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* paneles superpuestos */}
              <div className="relative col-span-11 min-h-[62svh]">
                {steps.map((s, i) => (
                  <div
                    key={s.index}
                    data-step-panel
                    className="absolute inset-0 grid grid-cols-10 items-center gap-10"
                    aria-hidden={i !== current}
                  >
                    <div className="col-span-5 xl:col-span-5">
                      <p
                        className="font-display text-[clamp(4rem,9vw,10rem)] leading-[0.8]"
                        style={{ color: accentVars[s.accent] }}
                      >
                        {s.index}
                      </p>
                      <h3 className="type-display mt-4">{s.title}</h3>
                      <p className="type-lead mt-6 max-w-[30ch] text-ink/65">{s.copy}</p>
                    </div>
                    <div className="col-span-5 flex items-center justify-center xl:col-span-5">
                      <StepVisual step={i} accent={accentVars[s.accent]} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------- version apilada */}
      <div className="shell lg:hidden">
        <div className="mt-16 flex flex-col gap-20 pb-6">
          {steps.map((s, i) => (
            <Reveal key={s.index} y={44}>
              <div>
                <div className="flex items-baseline gap-4">
                  <span
                    className="font-display text-[clamp(3.4rem,17vw,6rem)] leading-[0.8]"
                    style={{ color: accentVars[s.accent] }}
                  >
                    {s.index}
                  </span>
                  <h3 className="type-title">{s.title}</h3>
                </div>
                <div className="mt-6 flex justify-center">
                  <StepVisual step={i} accent={accentVars[s.accent]} compact />
                </div>
                <p className="type-body mt-6 max-w-[34ch] text-ink/65">{s.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="h-24 sm:h-32 lg:h-40" />
    </section>
  )
}
