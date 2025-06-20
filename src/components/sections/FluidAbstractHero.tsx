'use client'

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import { useOptimizedMouse } from '@/hooks/useOptimizedMouse'
import { useAnimationManager } from '@/hooks/useAnimationManager'
import { usePerformance } from '@/hooks/usePerformance'

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
  const mousePosition = useOptimizedMouse(16) // Throttle to 60fps for mouse
  const { subscribe } = useAnimationManager()
  const performance = usePerformance()
  
  const shapesRef = useRef<FloatingShape[]>([])
  const currentOffsetRef = useRef({ x: 0, y: 0 })
  const [, setRenderTrigger] = useState(0)
  
  // Use refs for values that change frequently to avoid re-renders
  const mouseOffsetRef = useRef({ x: 0, y: 0 })

  // Memoized shapes configuration
  const shapesConfig = useMemo(() => {
    const shapeTypes: FloatingShape['type'][] = ['blob', 'circle', 'gradient', 'ring']
    const colors = [
      'rgba(59, 130, 246, 0.85)',
      'rgba(147, 51, 234, 0.8)',
      'rgba(16, 185, 129, 0.75)',
      'rgba(245, 158, 11, 0.8)',
      'rgba(236, 72, 153, 0.75)',
      'rgba(99, 102, 241, 0.8)',
      'rgba(6, 182, 212, 0.75)',
      'rgba(139, 92, 246, 0.8)',
    ]

    const shapeCount = performance.isLowPerformance ? 2 : 4 // Drastically reduced for 120fps
    const shapes: FloatingShape[] = []
    
    for (let i = 0; i < shapeCount; i++) {
      shapes.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        depth: 0.1 + Math.random() * 0.8,
        scale: 0.8 + Math.random() * 1.8,
        blur: performance.isLowPerformance ? 0 : Math.random() * 2 + 1, // Minimal blur
        opacity: 0.6 + Math.random() * 0.4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 0.1, // Much slower rotation
        oscillationX: Math.random() * 15 + 5, // Minimal oscillation
        oscillationY: Math.random() * 10 + 5,
        oscillationSpeed: 0.0002 + Math.random() * 0.0003, // Much slower
        color: colors[Math.floor(Math.random() * colors.length)],
        type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)]
      })
    }
    
    return shapes
  }, [performance.isLowPerformance])

  // Initialize shapes
  useEffect(() => {
    shapesRef.current = shapesConfig
    setRenderTrigger(prev => prev + 1)
  }, [shapesConfig])

  // Calculate mouse offset for parallax - optimized with refs
  useEffect(() => {
    if (!performance.isMobile) {
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      
      const sensitivity = performance.isLowPerformance ? 0.15 : 0.25 // Reduced sensitivity
      const offsetX = (mousePosition.x - centerX) * sensitivity
      const offsetY = (mousePosition.y - centerY) * sensitivity
      
      mouseOffsetRef.current = { x: offsetX, y: offsetY }
    }
  }, [mousePosition.x, mousePosition.y, performance.isMobile, performance.isLowPerformance])

  // Ultra-optimized animation loop with batched updates
  useEffect(() => {
    // let frameCount = 0  // Removed unused variable
    let lastRenderTime = 0
    const renderInterval = performance.isLowPerformance ? 33 : 16 // 30fps vs 60fps
    
    const unsubscribe = subscribe(
      (timestamp: number) => {
        
        // Mouse following with variable update rates
        if (!performance.isMobile) {
          const lerpFactor = performance.isLowPerformance ? 0.12 : 0.08
          currentOffsetRef.current = {
            x: currentOffsetRef.current.x + (mouseOffsetRef.current.x - currentOffsetRef.current.x) * lerpFactor,
            y: currentOffsetRef.current.y + (mouseOffsetRef.current.y - currentOffsetRef.current.y) * lerpFactor
          }
        }
        
        // Batch shape updates with render throttling
        if (timestamp - lastRenderTime >= renderInterval) {
          shapesRef.current = shapesRef.current.map(shape => ({
            ...shape,
            rotation: shape.rotation + shape.rotationSpeed,
            oscillationX: Math.sin(timestamp * shape.oscillationSpeed) * (performance.isLowPerformance ? 6 : 12),
            oscillationY: Math.cos(timestamp * shape.oscillationSpeed * 0.7) * (performance.isLowPerformance ? 4 : 8)
          }))
          
          setRenderTrigger(prev => prev + 1)
          lastRenderTime = timestamp
        }
      },
      1, // High priority
      performance.isLowPerformance ? 30 : 60 // Adaptive target FPS
    )
    
    return unsubscribe
  }, [subscribe, performance.isMobile, performance.isLowPerformance])

  // Memoized transform calculator
  const getShapeTransform = useCallback((shape: FloatingShape) => {
    const baseX = shape.x
    const baseY = shape.y
    
    let moveX = 0
    let moveY = 0
    
    if (performance.isMobile) {
      moveX = shape.oscillationX * 0.3
      moveY = shape.oscillationY * 0.3
    } else {
      moveX = currentOffsetRef.current.x * shape.depth * 0.8 + shape.oscillationX * 0.2
      moveY = currentOffsetRef.current.y * shape.depth * 0.8 + shape.oscillationY * 0.2
    }
    
    return `translate3d(${baseX}vw, ${baseY}vh, 0) translate3d(${moveX}px, ${moveY}px, 0) scale(${shape.scale}) rotate(${shape.rotation}deg)`
  }, [performance.isMobile])

  // Optimized shape renderer
  const renderShape = useCallback((shape: FloatingShape) => {
    const baseStyle = {
      transform: getShapeTransform(shape),
      filter: performance.isLowPerformance ? 
        `blur(${shape.blur}px)` : 
        `blur(${shape.blur}px) drop-shadow(0 0 20px ${shape.color})`,
      opacity: shape.opacity,
      willChange: 'transform',
      backfaceVisibility: 'hidden' as const,
      perspective: 1000,
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
  }, [getShapeTransform, performance.isLowPerformance])

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden"
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
      
      {/* Floating shapes - memoized render */}
      <div className="absolute inset-0">
        {shapesRef.current.map(renderShape)}
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
          transform: `translate3d(${currentOffsetRef.current.x * 0.08}px, ${currentOffsetRef.current.y * 0.08}px, 0)`
        }}
      />

      {/* Main Title - Jimmy G */}
      <div 
        className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
        style={{
          transform: `translate3d(${currentOffsetRef.current.x * 0.03}px, ${currentOffsetRef.current.y * 0.03}px, 0)`
        }}
      >
        <h1 
          className="text-8xl md:text-9xl lg:text-[12rem] font-black tracking-tight select-none"
          style={{
            background: 'linear-gradient(45deg, #ff0080, #00ff80, #0080ff, #ff8000, #8000ff, #ff0080)',
            backgroundSize: '400% 400%',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: `
              0 0 20px rgba(255, 0, 128, 0.8),
              0 0 40px rgba(0, 255, 128, 0.6),
              0 0 60px rgba(0, 128, 255, 0.4),
              0 0 80px rgba(255, 128, 0, 0.3)
            `,
            filter: 'drop-shadow(0 0 30px rgba(255, 255, 255, 0.3))',
            animation: 'gradientShift 4s ease-in-out infinite, textGlow 2s ease-in-out infinite alternate'
          }}
        >
          Jimmy G
        </h1>
      </div>

      {/* Add custom keyframes for animations */}
      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes textGlow {
          0% { 
            filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.3)) drop-shadow(0 0 60px rgba(255, 0, 128, 0.4));
          }
          100% { 
            filter: drop-shadow(0 0 50px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 100px rgba(0, 255, 128, 0.6));
          }
        }
      `}</style>
      
      
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