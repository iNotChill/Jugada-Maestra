/**
 * Resuelve una ruta de `public/` contra la base del sitio.
 *
 * En desarrollo la base es '/' y en el build es '/Jugada-Maestra/' (ver
 * vite.config.ts), porque GitHub Pages publica el sitio en un subdirectorio.
 * Escribir '/images/foo.svg' a pelo funcionaria en local y daria 404 al
 * publicar, asi que todas las imagenes de `public/` pasan por aqui.
 *
 *   asset('/images/games/catan.svg')
 *     dev  → /images/games/catan.svg
 *     prod → /Jugada-Maestra/images/games/catan.svg
 */
export const asset = (path: string): string =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
