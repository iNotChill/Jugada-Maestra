# Imagenes del sitio

Todo lo que hay aqui ahora es **material temporal generado localmente** (SVG).
No se usa ninguna imagen de internet, asi que nada se va a romper con el tiempo.

Cada placeholder lleva una etiqueta visible `PLACEHOLDER / REEMPLAZAR` para que
no se escape por error a produccion.

## Como reemplazar por imagenes reales

### 1. Juegos — `public/images/games/`

El nombre del archivo debe coincidir con el `id` del juego en
`src/data/games.ts`, y la ruta se declara en el campo `image`:

```ts
{
  id: 'catan',
  image: '/images/games/catan.webp',  // <- cambia la extension aqui
  ...
}
```

- Formato recomendado: **WebP** (o AVIF), calidad 80.
- Proporcion: **4:5 vertical** (p. ej. 1200 x 1500 px).
- Peso objetivo: menos de 180 KB por imagen.

Conversion rapida con [sharp-cli](https://www.npmjs.com/package/sharp-cli) o con
cualquier herramienta de edicion:

```bash
npx sharp-cli --input foto.jpg --output public/images/games/catan.webp resize 1200 1500 --fit cover
```

### 2. Comunidad — `public/images/community/`

Son las fotos reales del grupo. Se listan en `src/data/site.ts`
(`communityPhotos`), donde tambien se edita el `alt` y el pie de foto:

```ts
{ src: '/images/community/viernes-01.webp', alt: 'Mesa de Catan en la sede', caption: 'Viernes 12 de marzo' }
```

Proporciones usadas por el collage: 4:5, 1:1, 3:4 y 16:9. La propia maqueta
recorta (`object-cover`), asi que cualquier foto funciona, pero conviene que el
motivo principal quede centrado.

> Si usas fotos con personas, pide su permiso antes de publicarlas.

### 3. Regenerar los placeholders

```bash
npm run art
```

El generador (`scripts/generate-placeholder-art.mjs`) es determinista: produce
siempre el mismo arte para el mismo `id`. Para agregar un juego nuevo, anade su
`id` al objeto `artMap` del script y vuelve a ejecutarlo.

## Carga de imagenes

El codigo ya aplica `loading="lazy"` y `decoding="async"` en el catalogo y en el
collage. Si las fotos reales pesan mucho, considera servir varios tamanos con
`srcset` en `GameCard.tsx` y `Community.tsx`.
