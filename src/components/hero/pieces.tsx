import { RoundedBox } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { PALETTE } from './palette'

/* ===========================================================================
   PIEZAS 3D
   ---------------------------------------------------------------------------
   Todas las piezas se construyen con geometria primitiva (cubos redondeados,
   icosaedros, cilindros, conos y esferas) con acabado metalico, de modo que
   el hero no depende de ningun archivo .glb externo.

   Si mas adelante se consiguen modelos reales, basta sustituir el contenido
   de cada funcion por un <primitive object={gltf.scene} /> manteniendo la
   misma interfaz de props.
   =========================================================================== */


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

/** Dado de 20 caras: icosaedro metalico dorado. */
export function D20({ color = PALETTE.gold }: { color?: string }) {
  return (
    <mesh castShadow>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color={color} metalness={0.82} roughness={0.16} envMapIntensity={1.5} />
    </mesh>
  )
}

/** Dado clasico de seis caras con los puntos marcados en relieve. */
export function Die({ color = PALETTE.ember }: { color?: string }) {
  const pip = (x: number, y: number, z: number, rx = 0, ry = 0) => (
    <mesh key={`${x}${y}${z}${rx}${ry}`} position={[x, y, z]} rotation={[rx, ry, 0]}>
      <cylinderGeometry args={[0.11, 0.11, 0.04, 16]} />
      <meshStandardMaterial color={PALETTE.cream} metalness={0.3} roughness={0.45} />
    </mesh>
  )

  const f = 0.51

  return (
    <group>
      <RoundedBox args={[1, 1, 1]} radius={0.16} smoothness={4} castShadow>
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.28} envMapIntensity={1.3} />
      </RoundedBox>
      {/* cara 1 (arriba) */}
      {pip(0, f, 0)}
      {/* cara 2 (frente) */}
      {pip(-0.22, 0.22, f, Math.PI / 2)}
      {pip(0.22, -0.22, f, Math.PI / 2)}
      {/* cara 3 (lateral derecho) */}
      {pip(f, 0.24, 0.24, 0, Math.PI / 2)}
      {pip(f, 0, 0, 0, Math.PI / 2)}
      {pip(f, -0.24, -0.24, 0, Math.PI / 2)}
    </group>
  )
}

/** Meeple: silueta reconocible hecha con esfera, cilindro y cono. */
export function Meeple({ color = PALETTE.cobalt }: { color?: string }) {
  const mat = <meshStandardMaterial color={color} metalness={0.5} roughness={0.32} envMapIntensity={1.3} />
  return (
    <group>
      <mesh position={[0, 0.62, 0]}>
        <sphereGeometry args={[0.3, 24, 24]} />
        {mat}
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.2, 0.42, 0.78, 20]} />
        {mat}
      </mesh>
      <mesh position={[0, -0.34, 0]}>
        <cylinderGeometry args={[0.46, 0.5, 0.12, 20]} />
        {mat}
      </mesh>
      {/* brazos */}
      <mesh position={[-0.36, 0.22, 0]} rotation={[0, 0, 0.9]}>
        <capsuleGeometry args={[0.1, 0.34, 4, 10]} />
        {mat}
      </mesh>
      <mesh position={[0.36, 0.22, 0]} rotation={[0, 0, -0.9]}>
        <capsuleGeometry args={[0.1, 0.34, 4, 10]} />
        {mat}
      </mesh>
    </group>
  )
}

/** Carta: caja muy delgada con borde redondeado. */
export function Card({ color = PALETTE.cream, accent = PALETTE.ember }: { color?: string; accent?: string }) {
  return (
    <group>
      <RoundedBox args={[1.25, 1.78, 0.045]} radius={0.08} smoothness={3} castShadow>
        <meshStandardMaterial color={color} metalness={0.2} roughness={0.5} />
      </RoundedBox>
      <mesh position={[0, 0, 0.028]}>
        <circleGeometry args={[0.38, 32]} />
        <meshStandardMaterial color={accent} metalness={0.4} roughness={0.35} />
      </mesh>
    </group>
  )
}

/** Ficha / token circular. */
export function Token({ color = PALETTE.pine }: { color?: string }) {
  return (
    <group>
      <mesh castShadow>
        <cylinderGeometry args={[0.62, 0.62, 0.14, 40]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} envMapIntensity={1.4} />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <torusGeometry args={[0.4, 0.045, 12, 40]} />
        <meshStandardMaterial color={PALETTE.cream} metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  )
}

/** Peon de ajedrez. */
export function Pawn({ color = PALETTE.ink }: { color?: string }) {
  const mat = <meshStandardMaterial color={color} metalness={0.88} roughness={0.14} envMapIntensity={1.8} />
  return (
    <group>
      <mesh position={[0, 0.66, 0]}>
        <sphereGeometry args={[0.27, 24, 24]} />
        {mat}
      </mesh>
      <mesh position={[0, 0.36, 0]}>
        <cylinderGeometry args={[0.3, 0.18, 0.14, 20]} />
        {mat}
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.15, 0.26, 0.6, 20]} />
        {mat}
      </mesh>
      <mesh position={[0, -0.34, 0]}>
        <cylinderGeometry args={[0.42, 0.46, 0.14, 24]} />
        {mat}
      </mesh>
    </group>
  )
}
