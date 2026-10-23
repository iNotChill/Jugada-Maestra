import { useEffect, useRef, useState } from 'react'
import { navLinks, site } from '@/data/site'
import { lockScroll, scrollToSelector } from '@/hooks/useSmoothScroll'
import { ScrollTrigger, gsap } from '@/lib/gsap'

type NavTheme = 'light' | 'dark'

/**
 * Navegacion minima que invierte su color segun la seccion que tiene debajo.
 * Cada seccion declara `data-nav-theme="light|dark"` y aqui se crea un
 * ScrollTrigger por seccion para leer ese valor.
 */
export function Navbar() {
  const [theme, setTheme] = useState<NavTheme>('light')
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const menu = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sections = gsap.utils.toArray<HTMLElement>('[data-nav-theme]')

    const triggers = sections.map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: 'top 60px',
        end: 'bottom 60px',
        onEnter: () => setTheme((el.dataset.navTheme as NavTheme) ?? 'light'),
        onEnterBack: () => setTheme((el.dataset.navTheme as NavTheme) ?? 'light'),
      }),
    )

    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    // Las secciones miden distinto cuando terminan de cargar las fuentes
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)

    return () => {
      triggers.forEach((t) => t.kill())
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  /* Menu movil: bloquea el scroll y escalona la entrada de los enlaces */
  useEffect(() => {
    lockScroll(open)
    if (!open || !menu.current) return

    const ctx = gsap.context(() => {
      gsap.from('[data-menu-item]', {
        yPercent: 110,
        opacity: 0,
        duration: 0.8,
        stagger: 0.07,
        ease: 'expo.out',
        delay: 0.1,
      })
    }, menu)

    return () => ctx.revert()
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const go = (href: string) => {
    setOpen(false)
    // Deja respirar al cierre del menu antes de desplazar
    window.setTimeout(() => scrollToSelector(href), 60)
  }

  const dark = theme === 'dark'
  const text = dark ? 'text-cream' : 'text-ink'
  const line = dark ? 'bg-cream' : 'bg-ink'

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${text} ${
          scrolled
            ? dark
              ? 'bg-ink/70 backdrop-blur-xl'
              : 'bg-cream/70 backdrop-blur-xl'
            : 'bg-transparent'
        }`}
      >
        <nav className="shell flex h-16 items-center justify-between gap-6 lg:h-20">
          {/* Logotipo */}
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault()
              go('#inicio')
            }}
            className="group flex items-center gap-3"
            aria-label={`${site.name} — inicio`}
          >
            <span className="relative grid size-8 shrink-0 place-items-center rounded-[0.5rem] bg-ember text-cream transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[14deg]">
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
                <circle cx="5.5" cy="5.5" r="1.7" fill="currentColor" />
                <circle cx="12.5" cy="12.5" r="1.7" fill="currentColor" />
                <circle cx="12.5" cy="5.5" r="1.7" fill="currentColor" />
                <circle cx="5.5" cy="12.5" r="1.7" fill="currentColor" />
              </svg>
            </span>
            <span className="font-display text-lg leading-none tracking-tight uppercase">
              {site.name}
            </span>
          </a>

          {/* Enlaces desktop */}
          <ul className="hidden items-center gap-8 lg:flex">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => {
                    e.preventDefault()
                    go(l.href)
                  }}
                  className="type-mono group relative inline-block py-2 opacity-70 transition-opacity hover:opacity-100"
                >
                  {l.label}
                  <span
                    className={`absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 ${line}`}
                  />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href={site.joinUrl}
              onClick={(e) => {
                if (site.joinUrl.startsWith('#')) {
                  e.preventDefault()
                  go(site.joinUrl)
                }
              }}
              className="type-mono hidden rounded-full bg-ember px-5 py-2.5 text-cream transition-colors duration-300 hover:bg-ink sm:inline-block"
            >
              Quiero jugar
            </a>

            {/* Boton de menu movil */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-movil"
              aria-label={open ? 'Cerrar menu' : 'Abrir menu'}
              className="relative grid size-10 place-items-center lg:hidden"
            >
              <span className="relative block h-3 w-6">
                <span
                  className={`absolute left-0 block h-px w-full transition-all duration-400 ${line} ${
                    open ? 'top-1.5 rotate-45' : 'top-0'
                  }`}
                />
                <span
                  className={`absolute left-0 block h-px w-full transition-all duration-400 ${line} ${
                    open ? 'top-1.5 -rotate-45' : 'top-3'
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Menu movil a pantalla completa */}
      <div
        id="menu-movil"
        ref={menu}
        className={`fixed inset-0 z-40 bg-ink text-cream transition-[opacity,visibility] duration-500 lg:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <div className="shell flex h-full flex-col justify-between pt-24 pb-10">
          <ul className="flex flex-col gap-1">
            {navLinks.map((l) => (
              <li key={l.href} className="line-mask">
                <button
                  data-menu-item
                  type="button"
                  onClick={() => go(l.href)}
                  className="type-display block w-full py-1 text-left text-cream"
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>

          <div data-menu-item className="space-y-5">
            <div className="h-px w-full bg-cream/20" />
            <p className="type-mono text-cream/60">{site.meta}</p>
            <a
              href={site.joinUrl}
              onClick={(e) => {
                if (site.joinUrl.startsWith('#')) {
                  e.preventDefault()
                  go(site.joinUrl)
                }
              }}
              className="type-mono inline-flex items-center gap-3 rounded-full bg-ember px-6 py-4 text-cream"
            >
              Quiero jugar
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
