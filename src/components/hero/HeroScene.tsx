import { Environment, Lightformer } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useRef, type ReactNode, type RefObject } from 'react'
import type { Group } from 'three'
import { Card, D20, Die, Floating, Pawn, Token } from './pieces'

interface SceneProps {
  /** Progreso de scroll del hero (0 arriba → 1 fuera de pantalla) */
  progress: RefObject<number>
  /** Version completa (desktop) o reducida (movil / equipos modestos) */
  dense: boolean
  /** Detiene el bucle de render cuando el hero sale de pantalla */
  paused: boolean
}

/**
 * Cada pieza se ancla a una fraccion del viewport (no a coordenadas fijas),
 * de modo que la composicion abraza los bordes sea cual sea la proporcion de
 * la pantalla.
 *
 * fx/fy: -1 = borde izquierdo/inferior · 1 = borde derecho/superior
 *
 * La direccion de arte es deliberadamente asimetrica: en desktop la
 * tipografia ocupa la columna izquierda y las piezas se agrupan en la mitad
 * derecha, con una carta saliendose del encuadre. En pantallas estrechas el
 * titular pasa a ocupar todo el ancho, asi que las piezas se reagrupan en la
 * franja superior, donde no compiten con el texto.
 */
interface PieceAnchor {
  id: string
  fx: number
  fy: number
  z: number
  scale: number
  amp: number
  speed: number
  phase: number
  spin: [number, number, number]
  rotation?: [number, number, number]
  node: ReactNode
}

const DESKTOP_ANCHORS: PieceAnchor[] = [
  {
    id: 'token-a',
    fx: 0.12,
    fy: 0.92,
    z: -0.9,
    scale: 0.6,
    amp: 0.18,
    speed: 0.9,
    phase: 2.2,
    spin: [0.2, 0.2, 0.1],
    rotation: [1.2, 0.2, 0.3],
    node: <Token />,
  },
  {
    id: 'token-b',
    fx: -0.42,
    fy: 0.84,
    z: -1.1,
    scale: 0.52,
    amp: 0.2,
    speed: 1,
    phase: 0.4,
    spin: [-0.18, 0.24, 0],
    rotation: [1.4, 0.4, -0.2],
    node: <Token />,
  },
  {
    id: 'd20',
    fx: 0.3,
    fy: 0.5,
    z: 0.4,
    scale: 0.95,
    amp: 0.2,
    speed: 0.55,
    phase: 0,
    spin: [0.08, 0.16, 0.03],
    node: <D20 />,
  },
  {
    id: 'die',
    fx: 0.78,
    fy: 0.16,
    z: -0.2,
    scale: 1.05,
    amp: 0.16,
    speed: 0.75,
    phase: 1.4,
    spin: [0.05, -0.2, 0.08],
    rotation: [0.5, 0.7, 0.2],
    node: <Die />,
  },
  {
    id: 'token-c',
    fx: 1.04,
    fy: 0.3,
    z: 0.8,
    scale: 0.46,
    amp: 0.12,
    speed: 0.8,
    phase: 4,
    spin: [0.1, 0.3, 0.1],
    rotation: [1.3, 0, 0.5],
    node: <Token />,
  },
  {
    id: 'card-r',
    fx: 1.08,
    fy: -0.1,
    z: -1.2,
    scale: 1.1,
    amp: 0.2,
    speed: 0.48,
    phase: 1.9,
    spin: [0.03, -0.08, 0.02],
    rotation: [-0.15, -0.5, -0.3],
    node: <Card />,
  },
  {
    id: 'pawn',
    fx: 0.44,
    fy: -0.32,
    z: 1,
    scale: 0.9,
    amp: 0.13,
    speed: 0.62,
    phase: 0.8,
    spin: [0, -0.14, 0],
    rotation: [0, -0.3, 0.1],
    node: <Pawn />,
  },
]

const COMPACT_ANCHORS: PieceAnchor[] = [
  {
    id: 'die',
    fx: 0.16,
    fy: 0.88,
    z: 0,
    scale: 0.85,
    amp: 0.16,
    speed: 0.75,
    phase: 1.4,
    spin: [0.05, -0.2, 0.08],
    rotation: [0.5, 0.7, 0.2],
    node: <Die />,
  },
  {
    id: 'd20',
    fx: 0.62,
    fy: 0.76,
    z: 0.4,
    scale: 0.8,
    amp: 0.2,
    speed: 0.55,
    phase: 0,
    spin: [0.08, 0.16, 0.03],
    node: <D20 />,
  },
  {
    id: 'token-a',
    fx: 1,
    fy: 0.48,
    z: 0.6,
    scale: 0.5,
    amp: 0.14,
    speed: 0.9,
    phase: 2.2,
    spin: [0.2, 0.2, 0.1],
    rotation: [1.2, 0.2, 0.3],
    node: <Token />,
  },
]

/** Parallax de cursor y deriva por scroll sobre el conjunto. */
function Rig({ progress, children }: { progress: RefObject<number>; children: ReactNode }) {
  const group = useRef<Group>(null)

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return

    const p = progress.current ?? 0
    const k = 1 - Math.pow(0.0001, delta) // interpolacion estable por framerate

    // Giro corto y suave siguiendo al cursor, nunca mas de ~9 grados
    g.rotation.y += (state.pointer.x * 0.16 - g.rotation.y) * k
    g.rotation.x += (-state.pointer.y * 0.1 - g.rotation.x) * k

    // Al bajar, la composicion se hunde y se abre: refuerza la salida del hero
    g.position.y = p * 2.4
    g.position.z = p * 2.2
    g.rotation.z = p * 0.12
  })

  return <group ref={group}>{children}</group>
}

function Composition({ dense }: { dense: boolean }) {
  const { viewport } = useThree()

  // Margen para que ninguna pieza quede cortada por el borde del canvas
  const halfW = viewport.width / 2 - 0.6
  const halfH = viewport.height / 2 - 0.6

  // En pantallas bajas o estrechas las piezas se achican antes que invadir el texto
  const fit = Math.min(viewport.width / 14, viewport.height / 8)
  const pieceScale = Math.min(0.92, Math.max(0.4, fit))

  return (
    <>
      {(dense ? DESKTOP_ANCHORS : COMPACT_ANCHORS).map((a) => (
        <Floating
          key={a.id}
          position={[a.fx * halfW, a.fy * halfH, a.z]}
          rotation={a.rotation}
          scale={a.scale * pieceScale}
          amp={a.amp * pieceScale}
          speed={a.speed}
          phase={a.phase}
          spin={a.spin}
        >
          {a.node}
        </Floating>
      ))}
    </>
  )
}

/**
 * Escena del hero. El canvas es decorativo (aria-hidden): toda la informacion
 * esta en el HTML que va encima, de modo que no se pierde nada si WebGL falla.
 */
export default function HeroScene({ progress, dense, paused }: SceneProps) {
  return (
    <Canvas
      aria-hidden
      /* Sin hero en pantalla no se gasta ni un frame de GPU */
      frameloop={paused ? 'never' : 'always'}
      dpr={dense ? [1, 1.75] : [1, 1.3]}
      camera={{ position: [0, 0, 9], fov: 34 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.85} />
      <directionalLight position={[4, 6, 6]} intensity={2.1} color="#fff6e6" />
      <directionalLight position={[-6, -2, 2]} intensity={0.7} color="#ffd9a8" />
      <pointLight position={[-4, 3, 4]} intensity={18} color="#E0472A" distance={12} />
      <pointLight position={[5, -3, 3]} intensity={14} color="#2B5BD7" distance={12} />

      {/* Mapa de entorno generado en escena: da el reflejo metalico sin
          descargar ningun HDR externo */}
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={2.6} color="#F2EBDD" scale={[12, 6, 1]} position={[0, 4, -6]} />
        <Lightformer form="rect" intensity={1.4} color="#F2B01E" scale={[8, 4, 1]} position={[-7, 0, 2]} rotation={[0, Math.PI / 2, 0]} />
        <Lightformer form="rect" intensity={1.1} color="#E0472A" scale={[8, 4, 1]} position={[7, -1, 2]} rotation={[0, -Math.PI / 2, 0]} />
        <Lightformer form="circle" intensity={2} color="#ffffff" scale={4} position={[0, -5, 3]} />
      </Environment>

      {/* useGLTF suspende mientras descarga: el limite va DENTRO del canvas */}
      <Suspense fallback={null}>
        <Rig progress={progress}>
          <Composition dense={dense} />
        </Rig>
      </Suspense>
    </Canvas>
  )
}
