import { useCallback, useSyncExternalStore } from 'react'

/**
 * Media query reactiva. Se suscribe al propio MediaQueryList en lugar de
 * sincronizar estado en un efecto, asi que no hay render de mas ni desfase
 * entre el primer pintado y el valor real.
 */
export function useMediaQuery(query: string, fallback = false): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    [query],
  )

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query])
  const getServerSnapshot = useCallback(() => fallback, [fallback])

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')

/** Punteros finos: habilita hover, cursor propio y animaciones ligadas al mouse. */
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)')

export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)')
