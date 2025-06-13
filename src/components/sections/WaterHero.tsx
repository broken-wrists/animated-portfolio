'use client'

import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useMousePosition } from '@/hooks/useMousePosition'

interface Ripple {
  x: number
  y: number
  radius: number
  opacity: number
  id: number
}

const WaterHero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePosition = useMousePosition()
  const [, setRipples] = useState<Ripple[]>([])
  const animationRef = useRef<number>()
  const lastMousePos = useRef({ x: 0, y: 0 })
  const colorPhase = useRef(0)

  // Water simulation parameters
  const waves = useRef({
    amplitude: 30,
    frequency: 0.02,
    speed: 0.01,
    offset: 0
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)

    // Color palette for water
    const getWaterColor = (phase: number, alpha: number = 1) => {
      const colors = [
        { r: 57, g: 255, b: 20 },   // neon green
        { r: 0, g: 255, b: 204 },   // cyan
        { r: 0, g: 127, b: 255 },   // electric blue
        { r: 68, g: 0, b: 255 },    // deep blue
        { r: 204, g: 0, b: 255 },   // magenta
        { r: 255, g: 20, b: 147 },  // cyber pink
        { r: 255, g: 136, b: 0 },   // orange
      ]

      const colorIndex = Math.floor(phase) % colors.length
      const nextColorIndex = (colorIndex + 1) % colors.length
      const t = phase - Math.floor(phase)

      const currentColor = colors[colorIndex]
      const nextColor = colors[nextColorIndex]

      const r = Math.round(currentColor.r + (nextColor.r - currentColor.r) * t)
      const g = Math.round(currentColor.g + (nextColor.g - currentColor.g) * t)
      const b = Math.round(currentColor.b + (nextColor.b - currentColor.b) * t)

      return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }

    // Main animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update color phase
      colorPhase.current += 0.005

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, 'rgba(10, 10, 10, 0.95)')
      gradient.addColorStop(0.5, getWaterColor(colorPhase.current, 0.15))
      gradient.addColorStop(1, 'rgba(10, 10, 10, 0.95)')
      
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw animated water waves
      waves.current.offset += waves.current.speed

      // Multiple wave layers
      for (let layer = 0; layer < 5; layer++) {
        ctx.beginPath()
        
        const layerOffset = layer * 0.3
        const layerAmplitude = waves.current.amplitude * (1 - layer * 0.15)
        const layerFrequency = waves.current.frequency * (1 + layer * 0.1)
        const layerAlpha = 0.15 - layer * 0.02

        for (let x = 0; x <= canvas.width; x += 2) {
          const y1 = canvas.height * 0.3 + 
                    Math.sin(x * layerFrequency + waves.current.offset + layerOffset) * layerAmplitude +
                    Math.sin(x * layerFrequency * 2.3 + waves.current.offset * 1.5 + layerOffset) * layerAmplitude * 0.5
          

          if (x === 0) {
            ctx.moveTo(x, y1)
          } else {
            ctx.lineTo(x, y1)
          }
        }

        // Complete the wave shape
        ctx.lineTo(canvas.width, canvas.height)
        ctx.lineTo(0, canvas.height)
        ctx.closePath()

        const waveColor = getWaterColor(colorPhase.current + layer * 0.5, layerAlpha)
        ctx.fillStyle = waveColor
        ctx.fill()

        // Add wave borders
        ctx.beginPath()
        for (let x = 0; x <= canvas.width; x += 2) {
          const y = canvas.height * 0.3 + 
                   Math.sin(x * layerFrequency + waves.current.offset + layerOffset) * layerAmplitude +
                   Math.sin(x * layerFrequency * 2.3 + waves.current.offset * 1.5 + layerOffset) * layerAmplitude * 0.5
          
          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        
        ctx.strokeStyle = getWaterColor(colorPhase.current + layer * 0.5, layerAlpha * 3)
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Draw ripples
      setRipples(prevRipples => {
        const updatedRipples = prevRipples
          .map(ripple => ({
            ...ripple,
            radius: ripple.radius + 3,
            opacity: ripple.opacity * 0.95
          }))
          .filter(ripple => ripple.opacity > 0.01 && ripple.radius < 300)

        updatedRipples.forEach(ripple => {
          ctx.beginPath()
          ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2)
          ctx.strokeStyle = getWaterColor(colorPhase.current, ripple.opacity * 0.8)
          ctx.lineWidth = 2
          ctx.stroke()

          // Inner ripple
          ctx.beginPath()
          ctx.arc(ripple.x, ripple.y, ripple.radius * 0.5, 0, Math.PI * 2)
          ctx.strokeStyle = getWaterColor(colorPhase.current + 1, ripple.opacity * 0.4)
          ctx.lineWidth = 1
          ctx.stroke()
        })

        return updatedRipples
      })

      // Add floating particles
      const time = Date.now() * 0.001
      for (let i = 0; i < 50; i++) {
        const x = (i * 67 + time * 20 + Math.sin(time + i) * 100) % (canvas.width + 100) - 50
        const y = canvas.height * 0.2 + Math.sin(time * 0.5 + i * 0.1) * 50 + Math.sin(x * 0.01) * 30
        const size = 2 + Math.sin(time + i) * 1
        const alpha = 0.3 + Math.sin(time * 2 + i) * 0.2

        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fillStyle = getWaterColor(colorPhase.current + i * 0.1, alpha)
        ctx.fill()
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener('resize', updateCanvasSize)
    }
  }, [])

  // Handle mouse interactions
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const canvasX = mousePosition.x - rect.left
    const canvasY = mousePosition.y - rect.top

    // Only create ripples if mouse moved significantly
    const distance = Math.sqrt(
      Math.pow(canvasX - lastMousePos.current.x, 2) + 
      Math.pow(canvasY - lastMousePos.current.y, 2)
    )

    if (distance > 10 && canvasX >= 0 && canvasX <= canvas.width && canvasY >= 0 && canvasY <= canvas.height) {
      setRipples(prev => [
        ...prev,
        {
          x: canvasX,
          y: canvasY,
          radius: 5,
          opacity: 0.8,
          id: Date.now() + Math.random()
        }
      ])

      lastMousePos.current = { x: canvasX, y: canvasY }
    }
  }, [mousePosition])

  // Handle click for bigger ripples
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Create multiple ripples for click
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        setRipples(prev => [
          ...prev,
          {
            x: x + (Math.random() - 0.5) * 20,
            y: y + (Math.random() - 0.5) * 20,
            radius: 10 + i * 5,
            opacity: 1,
            id: Date.now() + Math.random() + i
          }
        ])
      }, i * 100)
    }
  }

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Animated Water Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-none"
        onClick={handleCanvasClick}
        data-cursor="hover"
      />

      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dark-bg/60 pointer-events-none" />

      {/* Floating UI Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-4 h-4 bg-white rounded-full opacity-60"
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            scale: [1, 1.5, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <motion.div
          className="absolute top-1/3 right-1/3 w-6 h-6 bg-white rounded-full opacity-40"
          animate={{
            y: [15, -15, 15],
            x: [20, -20, 20],
            scale: [0.8, 1.2, 0.8],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <motion.div
          className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-white rounded-full opacity-50"
          animate={{
            y: [-25, 25, -25],
            x: [-15, 15, -15],
            scale: [1.2, 0.8, 1.2],
            opacity: [0.5, 0.9, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Interactive instructions */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center text-white/70 pointer-events-none"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        <p className="text-sm font-light tracking-wider">
          Move your cursor to create ripples • Click for waves
        </p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 cursor-pointer pointer-events-auto"
        onClick={() => {
          const heroSection = document.querySelector('#hero-content')
          heroSection?.scrollIntoView({ behavior: 'smooth' })
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3 }}
        whileHover={{ scale: 1.1 }}
        data-cursor="hover"
      >
        <motion.div
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
          whileHover={{ borderColor: 'rgba(255, 255, 255, 0.8)' }}
        >
          <motion.div
            className="w-1 h-3 bg-white/50 rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default WaterHero