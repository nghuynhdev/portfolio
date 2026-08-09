"use client"

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Particles({ count }: { count: number }) {
  const mesh = useRef<THREE.Points>(null!)
  const mouse = useRef({ x: 0, y: 0 })

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)

    // mint #46f2a7 and soft white mix
    const mintColor = new THREE.Color('#46f2a7')
    const whiteColor = new THREE.Color('#a0f0d0')

    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10

      const c = Math.random() > 0.5 ? mintColor : whiteColor
      col[i * 3]     = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }
    return [pos, col]
  }, [count])

  useFrame(({ clock }) => {
    if (!mesh.current) return
    const t = clock.getElapsedTime()
    mesh.current.rotation.y = t * 0.03
    mesh.current.rotation.x = t * 0.015

    // subtle mouse parallax
    const geo = mesh.current.geometry
    const pos = geo.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      pos[i * 3]     += Math.sin(t * 0.3 + i * 0.01) * 0.0008
      pos[i * 3 + 1] += Math.cos(t * 0.2 + i * 0.01) * 0.0008
    }
    geo.attributes.position.needsUpdate = true
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

export default function ParticleBackground() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const count = isMobile ? 600 : 1500

  return (
    <div className="absolute inset-0 z-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, isMobile ? 1 : 1.5]}
        gl={{ antialias: false, powerPreference: 'low-power' }}
        style={{ background: 'transparent' }}
      >
        <Particles count={count} />
      </Canvas>
    </div>
  )
}
