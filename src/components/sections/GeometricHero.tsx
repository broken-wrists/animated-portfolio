'use client'

import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useMousePosition } from '@/hooks/useMousePosition'

interface MorphingShape {
  id: number
  x: number
  y: number
  currentShape: number // 0 = circle, 1 = triangle, 2 = square, 3 = hexagon
  targetShape: number
  morphProgress: number
  size: number
  color: string
  rotation: number
  rotationSpeed: number
  scale: number
  baseScale: number
}

const GeometricHero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePosition = useMousePosition()
  const [shapes, setShapes] = useState<MorphingShape[]>([])
  const animationRef = useRef<number>()
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Shape drawing functions
  const drawShape = (ctx: CanvasRenderingContext2D, shape: MorphingShape) => {
    const { x, y, size, rotation, scale } = shape
    const radius = size * scale

    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rotation)
    
    // Create gradient
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius)
    gradient.addColorStop(0, shape.color + '80')
    gradient.addColorStop(0.7, shape.color + '40')
    gradient.addColorStop(1, shape.color + '10')
    
    ctx.fillStyle = gradient
    ctx.strokeStyle = shape.color + '60'
    ctx.lineWidth = 2

    // Interpolate between shapes based on morphProgress
    const progress = shape.morphProgress
    const fromShape = shape.currentShape
    const toShape = shape.targetShape

    if (progress >= 1) {
      // Draw target shape
      drawSingleShape(ctx, toShape, radius)
    } else {
      // Morph between shapes
      drawMorphedShape(ctx, fromShape, toShape, progress, radius)
    }

    ctx.restore()
  }

  const drawSingleShape = (ctx: CanvasRenderingContext2D, shapeType: number, radius: number) => {
    ctx.beginPath()
    
    switch (shapeType) {
      case 0: // Circle
        ctx.arc(0, 0, radius, 0, Math.PI * 2)
        break
      
      case 1: // Triangle
        for (let i = 0; i < 3; i++) {
          const angle = (i * Math.PI * 2) / 3 - Math.PI / 2
          const x = Math.cos(angle) * radius
          const y = Math.sin(angle) * radius
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.closePath()
        break
      
      case 2: // Square
        ctx.rect(-radius * 0.7, -radius * 0.7, radius * 1.4, radius * 1.4)
        break
      
      case 3: // Hexagon
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI * 2) / 6
          const x = Math.cos(angle) * radius
          const y = Math.sin(angle) * radius
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.closePath()
        break
    }
    
    ctx.fill()
    ctx.stroke()
  }

  const drawMorphedShape = (ctx: CanvasRenderingContext2D, fromShape: number, toShape: number, progress: number, radius: number) => {
    // Simple interpolation between shapes
    const easeProgress = 1 - Math.pow(1 - progress, 3) // Ease out cubic
    
    if (fromShape === 0 && toShape === 1) {
      // Circle to Triangle
      drawCircleToTriangle(ctx, easeProgress, radius)
    } else if (fromShape === 1 && toShape === 2) {
      // Triangle to Square
      drawTriangleToSquare(ctx, easeProgress, radius)
    } else if (fromShape === 2 && toShape === 3) {
      // Square to Hexagon
      drawSquareToHexagon(ctx, easeProgress, radius)
    } else if (fromShape === 3 && toShape === 0) {
      // Hexagon to Circle
      drawHexagonToCircle(ctx, easeProgress, radius)
    } else {
      // Default fallback
      drawSingleShape(ctx, fromShape, radius)
    }
  }

  const drawCircleToTriangle = (ctx: CanvasRenderingContext2D, progress: number, radius: number) => {
    ctx.beginPath()
    const points = 32
    for (let i = 0; i < points; i++) {
      const angle = (i * Math.PI * 2) / points
      
      // Circle point
      const circleX = Math.cos(angle) * radius
      const circleY = Math.sin(angle) * radius
      
      // Triangle point (find closest triangle vertex)
      const triangleAngle = Math.floor((angle + Math.PI / 6) / (Math.PI * 2 / 3)) * (Math.PI * 2 / 3) - Math.PI / 2
      const triangleX = Math.cos(triangleAngle) * radius
      const triangleY = Math.sin(triangleAngle) * radius
      
      // Interpolate
      const x = circleX + (triangleX - circleX) * progress
      const y = circleY + (triangleY - circleY) * progress
      
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  }

  const drawTriangleToSquare = (ctx: CanvasRenderingContext2D, progress: number, radius: number) => {
    // Simplified morph - just draw the target shape with scaling
    ctx.beginPath()
    const size = radius * 0.7
    ctx.rect(-size, -size, size * 2, size * 2)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  }

  const drawSquareToHexagon = (ctx: CanvasRenderingContext2D, progress: number, radius: number) => {
    ctx.beginPath()
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  }

  const drawHexagonToCircle = (ctx: CanvasRenderingContext2D, progress: number, radius: number) => {
    ctx.beginPath()
    ctx.arc(0, 0, radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
  }

  // Initialize shapes
  const initializeShapes = React.useCallback((width: number, height: number) => {
    const colors = [
      'rgba(165, 180, 252', // Soft blue
      'rgba(196, 181, 253', // Soft purple
      'rgba(167, 243, 208', // Soft green
    ]

    const newShapes: MorphingShape[] = []
    
    for (let i = 0; i < 3; i++) {
      newShapes.push({
        id: i,
        x: (width / 4) * (i + 1),
        y: height / 2 + (i % 2 === 0 ? -100 : 100),
        currentShape: i % 4,
        targetShape: (i + 1) % 4,
        morphProgress: 0,
        size: 60 + i * 20,
        color: colors[i],
        rotation: 0,
        rotationSpeed: 0.005 + i * 0.002,
        scale: 1,
        baseScale: 1
      })
    }

    setShapes(newShapes)
  }, [])

  // Update dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current) {
        const width = window.innerWidth
        const height = window.innerHeight
        canvasRef.current.width = width
        canvasRef.current.height = height
        setDimensions({ width, height })
        initializeShapes(width, height)
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [initializeShapes])

  // Handle mouse interactions
  useEffect(() => {
    if (!canvasRef.current || shapes.length === 0) return

    const rect = canvasRef.current.getBoundingClientRect()
    const mouseX = mousePosition.x - rect.left
    const mouseY = mousePosition.y - rect.top

    setShapes(prevShapes =>
      prevShapes.map(shape => {
        const distance = Math.sqrt(
          Math.pow(mouseX - shape.x, 2) + Math.pow(mouseY - shape.y, 2)
        )
        
        // Scale based on distance
        const maxDistance = 200
        const proximity = Math.max(0, 1 - distance / maxDistance)
        const targetScale = shape.baseScale + proximity * 0.3

        return {
          ...shape,
          scale: shape.scale + (targetScale - shape.scale) * 0.1
        }
      })
    )
  }, [mousePosition, shapes])

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw shapes
      setShapes(prevShapes =>
        prevShapes.map(shape => {
          let newMorphProgress = shape.morphProgress + 0.005
          let newCurrentShape = shape.currentShape
          let newTargetShape = shape.targetShape

          // Complete morph cycle
          if (newMorphProgress >= 1) {
            newMorphProgress = 0
            newCurrentShape = shape.targetShape
            newTargetShape = (shape.targetShape + 1) % 4
          }

          return {
            ...shape,
            morphProgress: newMorphProgress,
            currentShape: newCurrentShape,
            targetShape: newTargetShape,
            rotation: shape.rotation + shape.rotationSpeed
          }
        })
      )

      // Draw shapes
      shapes.forEach(shape => {
        drawShape(ctx, shape)
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [shapes])

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Geometric Morphing Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-none"
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
          className="w-6 h-10 border-2 border-slate-400/50 rounded-full mx-auto mb-2 relative hover:border-slate-600/70 transition-colors duration-300"
        >
          <motion.div
            className="w-1 h-3 bg-slate-500/60 rounded-full absolute top-2 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
        <motion.div 
          className="text-slate-500/60 text-xs uppercase tracking-wider hover:text-slate-700/80 transition-colors duration-300"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Scroll
        </motion.div>
      </motion.div>

      {/* Subtle ambient effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl" />
        <div className="absolute top-3/4 left-3/4 w-96 h-96 bg-green-100/30 rounded-full blur-3xl" />
      </div>
    </section>
  )
}

export default GeometricHero