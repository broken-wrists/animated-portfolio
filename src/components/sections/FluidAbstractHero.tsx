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
      'rgba(59, 130, 246, 0.85)',   // Blue - increased opacity
      'rgba(147, 51, 234, 0.8)',    // Purple - increased opacity
      'rgba(16, 185, 129, 0.75)',   // Emerald - increased opacity
      'rgba(245, 158, 11, 0.8)',    // Amber - increased opacity
      'rgba(236, 72, 153, 0.75)',   // Pink - increased opacity
      'rgba(99, 102, 241, 0.8)',    // Indigo - increased opacity
      'rgba(6, 182, 212, 0.75)',    // Cyan - increased opacity
      'rgba(139, 92, 246, 0.8)',    // Violet - increased opacity
    ]

    const newShapes: FloatingShape[] = []
    
    for (let i = 0; i < 12; i++) { // Increased from 8 to 12 shapes
      newShapes.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        depth: 0.1 + Math.random() * 0.8, // 0.1 to 0.9
        scale: 0.8 + Math.random() * 1.8, // 0.8 to 2.6 - larger shapes
        blur: Math.random() * 12 + 3, // 3 to 15px - less blur for more visibility
        opacity: 0.6 + Math.random() * 0.4, // 0.6 to 1.0 - much higher opacity
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
      filter: `blur(${shape.blur}px) drop-shadow(0 0 30px ${shape.color}) drop-shadow(0 0 60px ${shape.color})`,
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
              width: '180px', // Increased size
              height: '150px', // Increased size
              background: `radial-gradient(ellipse at center, ${shape.color}, ${shape.color.replace(/0\.\d+\)/, '0.4)')} 50%, transparent 80%)`,
              borderRadius: '60% 40% 70% 30%',
              boxShadow: `inset 0 0 50px ${shape.color.replace(/0\.\d+\)/, '0.3)')}`,
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
              width: '130px', // Increased size
              height: '130px', // Increased size
              background: `radial-gradient(circle, ${shape.color}, ${shape.color.replace(/0\.\d+\)/, '0.3)')} 40%, transparent 70%)`,
              borderRadius: '50%',
              boxShadow: `0 0 80px ${shape.color}, inset 0 0 40px ${shape.color.replace(/0\.\d+\)/, '0.2)')}`,
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
              width: '200px', // Increased size
              height: '90px', // Increased size
              background: `linear-gradient(45deg, ${shape.color}, ${shape.color.replace(/0\.\d+\)/, '0.4)')} 50%, transparent 80%)`,
              borderRadius: '50px',
              boxShadow: `0 0 60px ${shape.color}`,
            }}
          />
        )
      
      case 'ring':
        return (
          <div
            key={shape.id}
            className="absolute pointer-events-none rounded-full"
            style={{
              ...baseStyle,
              width: '150px', // Increased size
              height: '150px', // Increased size
              border: `4px solid ${shape.color}`, // Thicker border
              background: `radial-gradient(circle, transparent 60%, ${shape.color.replace(/0\.\d+\)/, '0.1)')} 100%)`,
              boxShadow: `0 0 60px ${shape.color}, inset 0 0 30px ${shape.color.replace(/0\.\d+\)/, '0.2)')}`,
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
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 60%),
            radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.12) 0%, transparent 55%),
            radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.08) 0%, transparent 70%),
            radial-gradient(circle at 70% 30%, rgba(245, 158, 11, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 30% 70%, rgba(236, 72, 153, 0.08) 0%, transparent 45%)
          `
        }}
      />
      
      {/* Floating shapes */}
      <div className="absolute inset-0">
        {shapes.map(renderShape)}
      </div>
      
      {/* Enhanced depth layers */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          background: `
            radial-gradient(circle at 60% 40%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 30% 70%, rgba(236, 72, 153, 0.06) 0%, transparent 40%),
            radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.05) 0%, transparent 35%),
            radial-gradient(circle at 15% 80%, rgba(139, 92, 246, 0.04) 0%, transparent 30%)
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