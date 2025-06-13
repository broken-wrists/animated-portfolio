'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { useMousePosition } from '@/hooks/useMousePosition'

interface FloatingShape {
  id: number
  x: number
  y: number
  depth: number
  scale: number
  blur: number
  opacity: number
  rotation: number
  rotationSpeed: number
  oscillationX: number
  oscillationY: number
  oscillationSpeed: number
  color: string
  type: 'blob' | 'circle' | 'gradient' | 'ring'
}

const FluidAbstractHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const mousePosition = useMousePosition()
  const animationFrameRef = useRef<number>()
  const [shapes, setShapes] = useState<FloatingShape[]>([])
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 })
  const [currentOffset, setCurrentOffset] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)
  
  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Initialize floating shapes
  const initializeShapes = useCallback(() => {
    const shapeTypes: FloatingShape['type'][] = ['blob', 'circle', 'gradient', 'ring']
    const colors = [
      'rgba(59, 130, 246, 0.6)',   // Blue
      'rgba(147, 51, 234, 0.5)',   // Purple
      'rgba(16, 185, 129, 0.4)',   // Emerald
      'rgba(245, 158, 11, 0.5)',   // Amber
      'rgba(236, 72, 153, 0.4)',   // Pink
      'rgba(99, 102, 241, 0.5)',   // Indigo
      'rgba(6, 182, 212, 0.4)',    // Cyan
      'rgba(139, 92, 246, 0.5)',   // Violet
    ]

    const newShapes: FloatingShape[] = []
    
    for (let i = 0; i < 8; i++) {
      newShapes.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        depth: 0.1 + Math.random() * 0.8, // 0.1 to 0.9
        scale: 0.5 + Math.random() * 1.5, // 0.5 to 2
        blur: Math.random() * 15 + 5, // 5 to 20px
        opacity: 0.3 + Math.random() * 0.4, // 0.3 to 0.7
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 0.5, // -0.25 to 0.25
        oscillationX: Math.random() * 40 + 20, // 20 to 60
        oscillationY: Math.random() * 30 + 15, // 15 to 45
        oscillationSpeed: 0.001 + Math.random() * 0.002, // 0.001 to 0.003
        color: colors[Math.floor(Math.random() * colors.length)],
        type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)]
      })
    }
    
    setShapes(newShapes)
  }, [])

  // Initialize shapes on mount
  useEffect(() => {
    initializeShapes()
  }, [initializeShapes])

  // Calculate mouse offset for parallax (desktop only)
  useEffect(() => {
    if (!isMobile) {
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      
      const offsetX = (mousePosition.x - centerX) * 0.3
      const offsetY = (mousePosition.y - centerY) * 0.3
      
      setMouseOffset({ x: offsetX, y: offsetY })
    }
  }, [mousePosition, isMobile])

  // Smooth animation loop
  useEffect(() => {
    const animate = () => {
      const currentTime = Date.now()
      
      // Smooth interpolation for mouse following
      if (!isMobile) {
        setCurrentOffset(prev => ({
          x: prev.x + (mouseOffset.x - prev.x) * 0.02, // Smooth factor
          y: prev.y + (mouseOffset.y - prev.y) * 0.02
        }))
      }
      
      // Update shape rotations and oscillations
      setShapes(prevShapes => 
        prevShapes.map(shape => ({
          ...shape,
          rotation: shape.rotation + shape.rotationSpeed,
          // Add subtle oscillation for ambient movement
          oscillationX: Math.sin(currentTime * shape.oscillationSpeed) * 20,
          oscillationY: Math.cos(currentTime * shape.oscillationSpeed * 0.7) * 15
        }))
      )
      
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [mouseOffset, isMobile])

  // Calculate transform for each shape
  const getShapeTransform = useCallback((shape: FloatingShape) => {
    const baseX = shape.x
    const baseY = shape.y
    
    let moveX = 0
    let moveY = 0
    
    if (isMobile) {
      // Mobile: gentle floating animation
      moveX = shape.oscillationX * 0.5
      moveY = shape.oscillationY * 0.5
    } else {
      // Desktop: mouse-based parallax + oscillation
      moveX = currentOffset.x * shape.depth + shape.oscillationX * 0.3
      moveY = currentOffset.y * shape.depth + shape.oscillationY * 0.3
    }
    
    return `translate3d(${baseX}vw, ${baseY}vh, 0) translate3d(${moveX}px, ${moveY}px, 0) scale(${shape.scale}) rotate(${shape.rotation}deg)`
  }, [currentOffset, isMobile])

  // Render different shape types
  const renderShape = (shape: FloatingShape) => {
    const baseStyle = {
      transform: getShapeTransform(shape),
      filter: `blur(${shape.blur}px)`,
      opacity: shape.opacity,
      transition: isMobile ? 'none' : 'transform 0.1s ease-out'
    }

    switch (shape.type) {
      case 'blob':
        return (
          <div
            key={shape.id}
            className="absolute pointer-events-none"
            style={{
              ...baseStyle,
              width: '120px',
              height: '100px',
              background: `radial-gradient(ellipse at center, ${shape.color}, transparent 70%)`,
              borderRadius: '60% 40% 70% 30%',
            }}
          />
        )
      
      case 'circle':
        return (
          <div
            key={shape.id}
            className="absolute pointer-events-none"
            style={{
              ...baseStyle,
              width: '80px',
              height: '80px',
              background: `radial-gradient(circle, ${shape.color}, transparent 60%)`,
              borderRadius: '50%',
            }}
          />
        )
      
      case 'gradient':
        return (
          <div
            key={shape.id}
            className="absolute pointer-events-none"
            style={{
              ...baseStyle,
              width: '140px',
              height: '60px',
              background: `linear-gradient(45deg, ${shape.color}, transparent)`,
              borderRadius: '50px',
            }}
          />
        )
      
      case 'ring':
        return (
          <div
            key={shape.id}
            className="absolute pointer-events-none border-2 rounded-full"
            style={{
              ...baseStyle,
              width: '100px',
              height: '100px',
              borderColor: shape.color,
              background: 'transparent',
            }}
          />
        )
      
      default:
        return null
    }
  }

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden"
      style={{ cursor: 'none' }}
    >
      {/* Ambient background gradient */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.05) 0%, transparent 70%)
          `
        }}
      />
      
      {/* Floating shapes */}
      <div className="absolute inset-0">
        {shapes.map(renderShape)}
      </div>
      
      {/* Subtle depth layers */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(circle at 60% 40%, rgba(99, 102, 241, 0.05) 0%, transparent 40%),
            radial-gradient(circle at 30% 70%, rgba(236, 72, 153, 0.03) 0%, transparent 30%)
          `,
          transform: `translate3d(${currentOffset.x * 0.1}px, ${currentOffset.y * 0.1}px, 0)`
        }}
      />
      
      {/* Custom cursor for desktop */}
      {!isMobile && (
        <div
          className="fixed pointer-events-none z-50 rounded-full border border-white/20"
          style={{
            width: '20px',
            height: '20px',
            left: mousePosition.x - 10,
            top: mousePosition.y - 10,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.1s ease'
          }}
        />
      )}
      
      {/* Performance optimization overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'transparent',
          willChange: 'transform'
        }}
      />
    </section>
  )
}

export default FluidAbstractHero