import { navLinks, site } from '@/data/site'
import { scrollToSelector } from '@/hooks/useSmoothScroll'

export function Footer() {
  return (
    <footer data-nav-theme="dark" className="bg-ink text-cream">
      <div className="shell flex flex-col gap-10 py-14 sm:py-16">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-display text-2xl leading-none uppercase">{site.name}</p>
            <p className="type-mono mt-3 text-cream/45">{site.meta}</p>
          </div>

          <nav aria-label="Secciones">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToSelector(l.href)
                    }}
                    className="type-mono text-cream/55 transition-colors hover:text-cream"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-4 border-t border-cream/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="type-mono text-cream/35">
            {site.instagram} · Grupo universitario de juegos de mesa
          </p>
          <button
            type="button"
            onClick={() => scrollToSelector('#inicio')}
            className="type-mono inline-flex items-center gap-2 text-cream/55 transition-colors hover:text-cream"
          >
            Volver arriba
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path d="M6 11V1M1.5 5.5 6 1l4.5 4.5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  )
}
