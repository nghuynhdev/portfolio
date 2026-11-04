"use client"

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const ParticleBackground = dynamic(() => import('./ParticleBackground'), { ssr: false })

export default function ParticleWrapper() {
  const [ready, setReady] = useState(false)

  // Three.js is decorative and heavy: fetch it only after the page has loaded.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const show = () => setReady(true)
    let idleId: number | undefined
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    const schedule = () => {
      if ('requestIdleCallback' in window) {
        idleId = requestIdleCallback(show, { timeout: 2000 })
      } else {
        timeoutId = setTimeout(show, 1000)
      }
    }

    if (document.readyState === 'complete') {
      schedule()
    } else {
      window.addEventListener('load', schedule, { once: true })
    }

    return () => {
      window.removeEventListener('load', schedule)
      if (idleId !== undefined) cancelIdleCallback(idleId)
      if (timeoutId !== undefined) clearTimeout(timeoutId)
    }
  }, [])

  return ready ? <ParticleBackground /> : null
}
