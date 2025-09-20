"use client"

import { motion } from 'framer-motion'

export default function FloatingElements() {
  const bubbles = [
    { size: 'w-20 h-20', color: 'bg-blue-200/20 dark:bg-blue-800/20', x: '10%', y: '20%', duration: 8 },
    { size: 'w-16 h-16', color: 'bg-purple-200/20 dark:bg-purple-800/20', x: '85%', y: '15%', duration: 12 },
    { size: 'w-24 h-24', color: 'bg-emerald-200/20 dark:bg-emerald-800/20', x: '15%', y: '70%', duration: 10 },
    { size: 'w-14 h-14', color: 'bg-rose-200/20 dark:bg-rose-800/20', x: '80%', y: '75%', duration: 9 },
    { size: 'w-18 h-18', color: 'bg-orange-200/20 dark:bg-orange-800/20', x: '50%', y: '10%', duration: 11 },
    { size: 'w-12 h-12', color: 'bg-violet-200/20 dark:bg-violet-800/20', x: '70%', y: '45%', duration: 7 },
    { size: 'w-22 h-22', color: 'bg-cyan-200/20 dark:bg-cyan-800/20', x: '25%', y: '40%', duration: 13 },
    { size: 'w-10 h-10', color: 'bg-pink-200/20 dark:bg-pink-800/20', x: '90%', y: '30%', duration: 6 },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {bubbles.map((bubble, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full ${bubble.size} ${bubble.color} blur-sm`}
          style={{
            left: bubble.x,
            top: bubble.y,
          }}
          animate={{
            y: [0, -30, 0, -20, 0],
            x: [0, 15, -10, 20, 0],
            scale: [1, 1.1, 0.9, 1.05, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: bubble.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.5,
          }}
        />
      ))}
      
      {/* Floating particles */}
      {[
        { x: '15%', y: '20%', duration: 8 },
        { x: '85%', y: '30%', duration: 10 },
        { x: '25%', y: '60%', duration: 9 },
        { x: '75%', y: '15%', duration: 12 },
        { x: '45%', y: '80%', duration: 7 },
        { x: '65%', y: '45%', duration: 11 },
        { x: '35%', y: '25%', duration: 8 },
        { x: '55%', y: '70%', duration: 9 },
        { x: '20%', y: '50%', duration: 10 },
        { x: '80%', y: '65%', duration: 8 },
        { x: '40%', y: '35%', duration: 11 },
        { x: '70%', y: '85%', duration: 9 }
      ].map((particle, index) => (
        <motion.div
          key={`particle-${index}`}
          className="absolute w-2 h-2 bg-blue-300/30 dark:bg-blue-600/30 rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: index * 1.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}