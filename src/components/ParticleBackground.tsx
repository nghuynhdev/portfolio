"use client"

import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Particles({ count, isDark }: { count: number; isDark: boolean }) {
  const mesh = useRef<THREE.Points>(null!)

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)

    // Dark mode: mint + soft white | Light mode: teal + indigo (visible on light bg)
    const colorA = new THREE.Color(isDark ? '#46f2a7' : '#0d9488')
    const colorB = new THREE.Color(isDark ? '#a0f0d0' : '#4f46e5')

    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10

      const c = Math.random() > 0.5 ? colorA : colorB
      col[i * 3]     = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }
    return [pos, col]
  }, [count, isDark])

  useFrame(({ clock }) => {
    if (!mesh.current) return
    const t = clock.getElapsedTime()
    mesh.current.rotation.y = t * 0.03
    mesh.current.rotation.x = t * 0.015

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
        size={isDark ? 0.05 : 0.06}
        vertexColors
        transparent
        opacity={isDark ? 0.7 : 0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

export default function ParticleBackground() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const count = isMobile ? 600 : 1500
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'))
    check()
    const observer = new MutationObserver(check)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, isMobile ? 1 : 1.5]}
        gl={{ antialias: false, powerPreference: 'low-power' }}
        style={{ background: 'transparent', pointerEvents: 'none' }}
      >
        <Particles count={count} isDark={isDark} />
      </Canvas>
    </div>
  )
}
