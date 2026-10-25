import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { Box3, Vector3, type Group, type Mesh, type MeshStandardMaterial } from 'three'
import { asset } from '@/lib/asset'
import { PALETTE } from './palette'

/* ===========================================================================
   PIEZAS 3D DEL HERO
   ---------------------------------------------------------------------------
   Modelos .glb servidos desde public/models/, comprimidos con meshopt (su
   decodificador viene dentro de three, no se descarga nada de un CDN).

   Los originales, sin optimizar, viven fuera del repositorio en models-src/.
   Para regenerarlos: npm run models  (ver scripts/optimize-models.mjs)
   =========================================================================== */

const MODELS = {
  d20: '/models/d20.glb',
  die: '/models/die.glb',
  card: '/models/card.glb',
  token: '/models/token.glb',
  pawn: '/models/pawn.glb',
} as const

/**
 * Carga un modelo y lo deja centrado en el origen y escalado para que su lado
 * mayor mida `size`.
 *
 * Es lo que permite mezclar modelos de procedencias distintas: cada uno viene
 * con su propia escala y su propio pivote (uno mide 2 unidades, otro 115), y
 * sin normalizar habria que ajustar cada pieza a mano.
 */
interface ModelOptions {
  /** Recolorea la pieza. Solo para los modelos que vienen con color plano, sin
   *  textura: un color para toda la pieza, o uno por nombre de material
   *  (para no perder detalles como los puntos del dado). */
  tint?: string | Record<string, string>
  /** Acabado. Varios modelos vienen con metalness 1, que sin un entorno muy
   *  reflectante los apaga y los deja casi negros. */
  finish?: { metalness?: number; roughness?: number }
}

function useNormalizedModel(url: string, size: number, { tint, finish }: ModelOptions = {}) {
  const { scene } = useGLTF(asset(url))

  return useMemo(() => {
    const model = scene.clone(true)

    if (tint || finish) {
      model.traverse((o) => {
        const mesh = o as Mesh
        if (!mesh.isMesh || !mesh.visible) return

        // El material se clona: useGLTF cachea la escena original y clone()
        // comparte los materiales con ella
        const mat = (
          Array.isArray(mesh.material) ? mesh.material[0] : mesh.material
        ).clone() as MeshStandardMaterial

        const color = typeof tint === 'string' ? tint : tint?.[mat.name]
        if (color) {
          mat.color.set(color)
          mat.envMapIntensity = 1.4
        }
        if (finish?.metalness !== undefined) mat.metalness = finish.metalness
        if (finish?.roughness !== undefined) mat.roughness = finish.roughness

        mesh.material = mat
      })
    }

    // La caja se mide despues de ocultar piezas: asi el tamano corresponde a
    // lo que se ve de verdad
    // setFromObject actualiza las matrices de mundo por su cuenta: medir malla
    // a malla con expandByObject daba cajas erroneas, porque los modelos traen
    // transformaciones en los nodos padre (giros de eje, escalas, offsets)
    model.updateWorldMatrix(true, true)
    const box = new Box3().setFromObject(model)

    const dims = box.getSize(new Vector3())
    const center = box.getCenter(new Vector3())
    const scale = size / Math.max(dims.x, dims.y, dims.z)

    model.scale.setScalar(scale)
    model.position.set(-center.x * scale, -center.y * scale, -center.z * scale)

    return model
  }, [scene, size, tint, finish])
}

interface FloatProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  /** Amplitud del flotado en unidades de escena */
  amp?: number
  /** Velocidad del flotado */
  speed?: number
  /** Desfase para que las piezas no se muevan en bloque */
  phase?: number
  /** Giro continuo por eje (rad/s) */
  spin?: [number, number, number]
  children: React.ReactNode
}

/** Envoltorio de flotado + giro continuo. Un solo useFrame por pieza. */
export function Floating({
  position,
  rotation = [0, 0, 0],
  scale = 1,
  amp = 0.14,
  speed = 0.6,
  phase = 0,
  spin = [0, 0.12, 0],
  children,
}: FloatProps) {
  const ref = useRef<Group>(null)

  useFrame((state, delta) => {
    const g = ref.current
    if (!g) return
    const t = state.clock.elapsedTime * speed + phase
    g.position.y = position[1] + Math.sin(t) * amp
    g.position.x = position[0] + Math.cos(t * 0.7) * amp * 0.35
    g.rotation.x += spin[0] * delta
    g.rotation.y += spin[1] * delta
    g.rotation.z += spin[2] * delta
  })

  return (
    <group ref={ref} position={position} rotation={rotation} scale={scale}>
      {children}
    </group>
  )
}

/* ---------------------------------------------------------------------------
   Una funcion por pieza. El tamano objetivo iguala el que tenian las figuras
   geometricas anteriores, para no tener que recolocar toda la composicion.
   --------------------------------------------------------------------------- */

export function D20() {
  return <primitive object={useNormalizedModel(MODELS.d20, 2)} />
}

/* Venia en granate casi negro (#900000) y con metalness 1, que sin un entorno
   muy reflectante lo apagaba del todo. Se aclara al rojo de la marca, en linea
   con el D20, y se bajan metalness y rugosidad para que recoja la luz. */
const DIE_FINISH = { metalness: 0.35, roughness: 0.3 }
const DIE_TINT = { material: PALETTE.ember, Card_Back: PALETTE.cream }

export function Die() {
  return (
    <primitive object={useNormalizedModel(MODELS.die, 1.5, { tint: DIE_TINT, finish: DIE_FINISH })} />
  )
}

export function Card() {
  return <primitive object={useNormalizedModel(MODELS.card, 2)} />
}

/* La ficha venia en blanco hueso, invisible sobre el fondo */
export function Token() {
  return <primitive object={useNormalizedModel(MODELS.token, 1.4, { tint: PALETTE.gold })} />
}

export function Pawn() {
  return <primitive object={useNormalizedModel(MODELS.pawn, 1.8)} />
}

/* Se piden en cuanto se monta la escena, para que no aparezcan de una en una */
for (const url of Object.values(MODELS)) {
  useGLTF.preload(asset(url))
}
