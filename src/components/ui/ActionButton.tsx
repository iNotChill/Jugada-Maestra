import { useRef, type MouseEvent, type ReactNode } from 'react'
import { useFinePointer, useReducedMotion } from '@/hooks/useMediaQuery'
import { scrollToSelector } from '@/hooks/useSmoothScroll'
import { gsap } from '@/lib/gsap'

type Variant = 'solid' | 'outline' | 'light' | 'ink'

interface ActionButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: Variant
  className?: string
  /** Icono de flecha al final (por defecto si) */
  arrow?: boolean
}

const variants: Record<Variant, string> = {
  solid: 'bg-ember text-cream border-ember',
  ink: 'bg-ink text-cream border-ink',
  outline: 'bg-transparent text-ink border-ink/30 hover:border-ink',
  light: 'bg-cream text-ink border-cream',
}

const fillColor: Record<Variant, string> = {
  solid: 'var(--color-ink)',
  ink: 'var(--color-ember)',
  outline: 'var(--color-ink)',
  light: 'var(--color-ember)',
}

const fillText: Record<Variant, string> = {
  solid: 'var(--color-cream)',
  ink: 'var(--color-cream)',
  outline: 'var(--color-cream)',
  light: 'var(--color-cream)',
}

/**
 * Boton con dos microinteracciones: atraccion magnetica al cursor y
 * barrido de relleno en hover. Ambas se apagan sin puntero fino.
 */
export function ActionButton({
  children,
  href,
  onClick,
  variant = 'solid',
  className = '',
  arrow = true,
}: ActionButtonProps) {
  const ref = useRef<HTMLElement>(null)
  const fillRef = useRef<HTMLSpanElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const animate = fine && !reduced

  const onMove = (e: MouseEvent) => {
    if (!animate || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    gsap.to(ref.current, {
      x: (e.clientX - (r.left + r.width / 2)) * 0.18,
      y: (e.clientY - (r.top + r.height / 2)) * 0.3,
      duration: 0.5,
      ease: 'power3.out',
    })
  }

  const onEnter = () => {
    if (!animate) return
    gsap.to(fillRef.current, { yPercent: 0, duration: 0.55, ease: 'expo.out' })
    gsap.to(labelRef.current, { color: fillText[variant], duration: 0.35 })
  }

  const onLeave = () => {
    if (!animate) return
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.45)' })
    gsap.to(fillRef.current, { yPercent: 101, duration: 0.45, ease: 'power3.inOut' })
    gsap.to(labelRef.current, { color: '', duration: 0.3 })
  }

  const handleClick = (e: MouseEvent) => {
    if (href?.startsWith('#')) {
      e.preventDefault()
      scrollToSelector(href)
    }
    onClick?.()
  }

  const shared = {
    ref: ref as never,
    className: `group relative isolate inline-flex items-center gap-3 overflow-hidden rounded-full border px-7 py-4 type-mono select-none transition-colors duration-300 will-change-transform ${variants[variant]} ${className}`,
    onMouseMove: onMove,
    onMouseEnter: onEnter,
    onMouseLeave: onLeave,
    onClick: handleClick,
  }

  const inner = (
    <>
      <span
        ref={fillRef}
        aria-hidden
        className="absolute inset-0 -z-10 translate-y-full"
        style={{ backgroundColor: fillColor[variant] }}
      />
      <span ref={labelRef} className="relative flex items-center gap-3">
        {children}
        {arrow && (
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden
            className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
          >
            <path d="M1 7h11M7.5 2.5 12 7l-4.5 4.5" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        )}
      </span>
    </>
  )

  if (href) {
    return (
      <a href={href} {...shared}>
        {inner}
      </a>
    )
  }

  return (
    <button type="button" {...shared}>
      {inner}
    </button>
  )
}
