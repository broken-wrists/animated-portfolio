'use client'

import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useMousePosition } from '@/hooks/useMousePosition'

interface InkStroke {
  id: number
  points: { x: number; y: number; pressure: number; age: number }[]
  color: string
  opacity: number
  maxAge: number
}

const InkHero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePosition = useMousePosition()
  const [strokes, setStrokes] = useState<InkStroke[]>([])
  const animationRef = useRef<number>()
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const lastMousePos = useRef({ x: 0, y: 0 })
  const isDrawing = useRef(false)

  // Ink colors - monochromatic palette
  const inkColors = [
    'rgba(30, 30, 30',     // Deep charcoal
    'rgba(60, 60, 60',     // Medium gray
    'rgba(90, 90, 90',     // Light gray
  ]

  // Update dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current) {
        const width = window.innerWidth
        const height = window.innerHeight
        canvasRef.current.width = width
        canvasRef.current.height = height
        setDimensions({ width, height })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Handle mouse interactions - create ink strokes
  useEffect(() => {
    if (!canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const mouseX = mousePosition.x - rect.left
    const mouseY = mousePosition.y - rect.top

    // Calculate mouse movement
    const deltaX = mouseX - lastMousePos.current.x
    const deltaY = mouseY - lastMousePos.current.y
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    // Only create strokes when mouse is moving and within canvas
    if (distance > 2 && mouseX >= 0 && mouseX <= dimensions.width && mouseY >= 0 && mouseY <= dimensions.height) {
      // Calculate pressure based on movement speed
      const pressure = Math.min(1, Math.max(0.1, distance / 20))
      
      setStrokes(prevStrokes => {
        // Either add to existing stroke or create new one
        const activeStroke = prevStrokes.find(stroke => stroke.id === 0)
        
        if (activeStroke && distance < 50) {
          // Continue existing stroke
          return prevStrokes.map(stroke => 
            stroke.id === 0 
              ? {
                  ...stroke,
                  points: [...stroke.points.slice(-30), { // Keep last 30 points
                    x: mouseX,
                    y: mouseY,
                    pressure,
                    age: 0
                  }]
                }
              : stroke
          )
        } else {
          // Create new stroke
          const newStroke: InkStroke = {
            id: 0, // Active stroke always has id 0
            points: [{ x: mouseX, y: mouseY, pressure, age: 0 }],
            color: inkColors[Math.floor(Math.random() * inkColors.length)],
            opacity: 0.7 + Math.random() * 0.3,
            maxAge: 300 + Math.random() * 200
          }

          // Archive previous strokes with new IDs
          const archivedStrokes = prevStrokes.map(stroke => ({
            ...stroke,
            id: stroke.id + 1
          }))

          return [newStroke, ...archivedStrokes.slice(0, 8)] // Keep max 9 strokes
        }
      })
    }

    lastMousePos.current = { x: mouseX, y: mouseY }
  }, [mousePosition, dimensions])

  // Draw ink stroke with natural brush effect
  const drawStroke = (ctx: CanvasRenderingContext2D, stroke: InkStroke) => {
    if (stroke.points.length < 2) return

    ctx.save()
    ctx.globalAlpha = stroke.opacity
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    // Draw stroke with varying thickness
    for (let i = 0; i < stroke.points.length - 1; i++) {
      const point = stroke.points[i]
      const nextPoint = stroke.points[i + 1]
      
      // Calculate line thickness based on pressure and age
      const ageFactor = Math.max(0, 1 - point.age / stroke.maxAge)
      const thickness = point.pressure * 8 * ageFactor

      if (thickness > 0.1) {
        ctx.beginPath()
        ctx.moveTo(point.x, point.y)
        ctx.lineTo(nextPoint.x, nextPoint.y)
        ctx.strokeStyle = stroke.color + ', ' + ageFactor + ')'
        ctx.lineWidth = thickness
        ctx.stroke()
      }
    }

    ctx.restore()
  }

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const animate = () => {
      // Clear canvas with subtle fade effect
      ctx.fillStyle = 'rgba(250, 250, 250, 0.02)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw strokes
      setStrokes(prevStrokes => {
        const updatedStrokes = prevStrokes
          .map(stroke => ({
            ...stroke,
            points: stroke.points.map(point => ({
              ...point,
              age: point.age + 1
            })).filter(point => point.age < stroke.maxAge), // Remove old points
            opacity: stroke.opacity * 0.998 // Very slow fade
          }))
          .filter(stroke => stroke.points.length > 0 && stroke.opacity > 0.01) // Remove empty/invisible strokes

        // Draw all strokes
        updatedStrokes.forEach(stroke => {
          drawStroke(ctx, stroke)
        })

        return updatedStrokes
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-gray-50 via-white to-stone-50">
      {/* Ink Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-none"
      />

      {/* Subtle paper texture overlay */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3C/defs%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer z-20"
        onClick={() => document.querySelector('#hero-content')?.scrollIntoView({ behavior: 'smooth' })}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.1 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-stone-400/40 rounded-full mx-auto mb-2 relative hover:border-stone-600/60 transition-colors duration-300"
        >
          <motion.div
            className="w-1 h-3 bg-stone-500/50 rounded-full absolute top-2 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
        <motion.div 
          className="text-stone-500/50 text-xs uppercase tracking-wider hover:text-stone-700/70 transition-colors duration-300"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Scroll
        </motion.div>
      </motion.div>

      {/* Subtle instruction */}
      <motion.div
        className="absolute top-8 left-8 text-stone-500/40 text-sm tracking-wide pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        Move to paint
      </motion.div>

      {/* Artist signature */}
      <motion.div
        className="absolute bottom-8 right-8 text-stone-500/30 text-xs italic pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
      >
        Digital ink, 2024
      </motion.div>
    </section>
  )
}

export default InkHero