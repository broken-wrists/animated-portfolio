'use client'

import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useMousePosition } from '@/hooks/useMousePosition'

interface MercuryDrop {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  mass: number
  metallic: number
  lastMerge: number
}

interface Ripple {
  id: number
  x: number
  y: number
  radius: number
  intensity: number
  maxRadius: number
}

interface Reflection {
  x: number
  y: number
  intensity: number
  angle: number
  length: number
}

const MercuryHero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePosition = useMousePosition()
  const [drops, setDrops] = useState<MercuryDrop[]>([])
  const [ripples, setRipples] = useState<Ripple[]>([])
  const [reflections, setReflections] = useState<Reflection[]>([])
  const animationRef = useRef<number>()
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const lastMousePos = useRef({ x: 0, y: 0 })

  // Initialize mercury pools
  const initializeMercury = React.useCallback((width: number, height: number) => {
    const newDrops: MercuryDrop[] = []
    
    // Create several large mercury pools
    for (let i = 0; i < 8; i++) {
      newDrops.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: 40 + Math.random() * 60,
        mass: 40 + Math.random() * 60,
        metallic: 0.8 + Math.random() * 0.2,
        lastMerge: 0
      })
    }

    // Add smaller droplets
    for (let i = 8; i < 25; i++) {
      newDrops.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
        size: 8 + Math.random() * 20,
        mass: 8 + Math.random() * 20,
        metallic: 0.7 + Math.random() * 0.3,
        lastMerge: 0
      })
    }

    setDrops(newDrops)
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
        initializeMercury(width, height)
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [initializeMercury])

  // Handle mouse interactions - magnetic effects
  useEffect(() => {
    if (!canvasRef.current || drops.length === 0) return

    const rect = canvasRef.current.getBoundingClientRect()
    const mouseX = mousePosition.x - rect.left
    const mouseY = mousePosition.y - rect.top

    // Calculate mouse movement
    const deltaX = mouseX - lastMousePos.current.x
    const deltaY = mouseY - lastMousePos.current.y
    const mouseSpeed = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    // Create ripples on mouse movement
    if (mouseSpeed > 3 && mouseX >= 0 && mouseX <= dimensions.width && mouseY >= 0 && mouseY <= dimensions.height) {
      setRipples(prev => [...prev.slice(-8), {
        id: Date.now() + Math.random(),
        x: mouseX,
        y: mouseY,
        radius: 0,
        intensity: Math.min(mouseSpeed / 10, 1),
        maxRadius: 100 + mouseSpeed * 2
      }])

      // Generate reflections
      const newReflections: Reflection[] = []
      for (let i = 0; i < 6; i++) {
        newReflections.push({
          x: mouseX + (Math.random() - 0.5) * 100,
          y: mouseY + (Math.random() - 0.5) * 100,
          intensity: Math.random() * 0.8 + 0.2,
          angle: Math.random() * Math.PI * 2,
          length: 20 + Math.random() * 40
        })
      }
      setReflections(prev => [...prev.slice(-20), ...newReflections])
    }

    // Apply magnetic force to nearby drops
    setDrops(prevDrops => 
      prevDrops.map(drop => {
        const dx = mouseX - drop.x
        const dy = mouseY - drop.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 150 && distance > 0) {
          const force = Math.min(mouseSpeed * 0.01, 0.5) / (distance * distance) * 100
          const forceX = (dx / distance) * force
          const forceY = (dy / distance) * force
          
          return {
            ...drop,
            vx: drop.vx + forceX,
            vy: drop.vy + forceY
          }
        }
        
        return drop
      })
    )

    lastMousePos.current = { x: mouseX, y: mouseY }
  }, [mousePosition, drops, dimensions])

  // Draw mercury drop with metallic effect
  const drawMercuryDrop = (ctx: CanvasRenderingContext2D, drop: MercuryDrop) => {
    const { x, y, size, metallic } = drop

    // Main mercury body
    const mainGradient = ctx.createRadialGradient(
      x - size * 0.3, y - size * 0.3, 0,
      x, y, size
    )
    mainGradient.addColorStop(0, `rgba(220, 220, 240, ${metallic})`)
    mainGradient.addColorStop(0.3, `rgba(180, 180, 200, ${metallic * 0.9})`)
    mainGradient.addColorStop(0.7, `rgba(120, 120, 140, ${metallic * 0.8})`)
    mainGradient.addColorStop(1, `rgba(80, 80, 100, ${metallic * 0.7})`)

    ctx.fillStyle = mainGradient
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()

    // Highlight
    const highlightGradient = ctx.createRadialGradient(
      x - size * 0.4, y - size * 0.4, 0,
      x - size * 0.2, y - size * 0.2, size * 0.6
    )
    highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)')
    highlightGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)')
    highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

    ctx.fillStyle = highlightGradient
    ctx.beginPath()
    ctx.arc(x - size * 0.2, y - size * 0.2, size * 0.6, 0, Math.PI * 2)
    ctx.fill()

    // Reflection spots
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.beginPath()
    ctx.arc(x - size * 0.3, y - size * 0.3, size * 0.15, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.beginPath()
    ctx.arc(x + size * 0.2, y - size * 0.1, size * 0.08, 0, Math.PI * 2)
    ctx.fill()

    // Shadow/depth
    const shadowGradient = ctx.createRadialGradient(
      x + size * 0.3, y + size * 0.3, 0,
      x + size * 0.2, y + size * 0.2, size * 0.8
    )
    shadowGradient.addColorStop(0, 'rgba(40, 40, 60, 0.4)')
    shadowGradient.addColorStop(1, 'rgba(40, 40, 60, 0)')

    ctx.fillStyle = shadowGradient
    ctx.beginPath()
    ctx.arc(x + size * 0.2, y + size * 0.2, size * 0.8, 0, Math.PI * 2)
    ctx.fill()
  }

  // Check for drop merging
  const mergingDistance = (drop1: MercuryDrop, drop2: MercuryDrop) => {
    const dx = drop1.x - drop2.x
    const dy = drop1.y - drop2.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    return distance < (drop1.size + drop2.size) * 0.8
  }

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const animate = () => {
      // Clear with subtle gradient background
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      bgGradient.addColorStop(0, '#0f0f23')
      bgGradient.addColorStop(0.5, '#1a1a2e')
      bgGradient.addColorStop(1, '#16213e')
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw ripples
      setRipples(prevRipples => {
        const updatedRipples = prevRipples
          .map(ripple => ({
            ...ripple,
            radius: ripple.radius + 3,
            intensity: ripple.intensity * 0.95
          }))
          .filter(ripple => ripple.radius < ripple.maxRadius && ripple.intensity > 0.01)

        // Draw ripples
        updatedRipples.forEach(ripple => {
          ctx.strokeStyle = `rgba(200, 200, 220, ${ripple.intensity * 0.3})`
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2)
          ctx.stroke()

          // Inner ripple
          ctx.strokeStyle = `rgba(255, 255, 255, ${ripple.intensity * 0.6})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.arc(ripple.x, ripple.y, ripple.radius * 0.7, 0, Math.PI * 2)
          ctx.stroke()
        })

        return updatedRipples
      })

      // Update and draw reflections
      setReflections(prevReflections => {
        const updatedReflections = prevReflections
          .map(reflection => ({
            ...reflection,
            intensity: reflection.intensity * 0.95
          }))
          .filter(reflection => reflection.intensity > 0.05)

        // Draw reflections
        updatedReflections.forEach(reflection => {
          ctx.strokeStyle = `rgba(255, 255, 255, ${reflection.intensity})`
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(reflection.x, reflection.y)
          ctx.lineTo(
            reflection.x + Math.cos(reflection.angle) * reflection.length,
            reflection.y + Math.sin(reflection.angle) * reflection.length
          )
          ctx.stroke()
        })

        return updatedReflections
      })

      // Update mercury drops
      setDrops(prevDrops => {
        let updatedDrops = prevDrops.map(drop => {
          // Apply physics
          let newX = drop.x + drop.vx
          let newY = drop.y + drop.vy

          // Boundary conditions with bouncing
          if (newX < drop.size || newX > canvas.width - drop.size) {
            drop.vx *= -0.7
            newX = Math.max(drop.size, Math.min(canvas.width - drop.size, newX))
          }
          if (newY < drop.size || newY > canvas.height - drop.size) {
            drop.vy *= -0.7
            newY = Math.max(drop.size, Math.min(canvas.height - drop.size, newY))
          }

          // Apply friction
          const friction = 0.99
          const newVx = drop.vx * friction
          const newVy = drop.vy * friction

          return {
            ...drop,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy
          }
        })

        // Handle merging
        const dropsToRemove: number[] = []
        for (let i = 0; i < updatedDrops.length; i++) {
          if (dropsToRemove.includes(i)) continue
          
          for (let j = i + 1; j < updatedDrops.length; j++) {
            if (dropsToRemove.includes(j)) continue
            
            if (mergingDistance(updatedDrops[i], updatedDrops[j])) {
              const drop1 = updatedDrops[i]
              const drop2 = updatedDrops[j]
              
              // Create merged drop
              const totalMass = drop1.mass + drop2.mass
              const mergedDrop: MercuryDrop = {
                id: drop1.id,
                x: (drop1.x * drop1.mass + drop2.x * drop2.mass) / totalMass,
                y: (drop1.y * drop1.mass + drop2.y * drop2.mass) / totalMass,
                vx: (drop1.vx * drop1.mass + drop2.vx * drop2.mass) / totalMass,
                vy: (drop1.vy * drop1.mass + drop2.vy * drop2.mass) / totalMass,
                size: Math.sqrt(drop1.size * drop1.size + drop2.size * drop2.size),
                mass: totalMass,
                metallic: Math.max(drop1.metallic, drop2.metallic),
                lastMerge: Date.now()
              }

              updatedDrops[i] = mergedDrop
              dropsToRemove.push(j)
              break
            }
          }
        }
        
        // Remove merged drops
        updatedDrops = updatedDrops.filter((_, index) => !dropsToRemove.includes(index))

        return updatedDrops
      })

      // Draw mercury drops
      drops.forEach(drop => {
        drawMercuryDrop(ctx, drop)
      })

      // Add ambient lighting effects
      ctx.save()
      ctx.globalCompositeOperation = 'screen'
      const ambientGradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 3, 0,
        canvas.width / 2, canvas.height / 3, Math.max(canvas.width, canvas.height)
      )
      ambientGradient.addColorStop(0, 'rgba(100, 150, 200, 0.05)')
      ambientGradient.addColorStop(1, 'rgba(50, 75, 100, 0)')
      ctx.fillStyle = ambientGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.restore()

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [drops])

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Mercury Canvas */}
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
        transition={{ delay: 2 }}
        whileHover={{ scale: 1.1 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-slate-400/40 rounded-full mx-auto mb-2 relative hover:border-slate-300/60 transition-colors duration-300"
        >
          <motion.div
            className="w-1 h-3 bg-slate-400/50 rounded-full absolute top-2 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
        <motion.div 
          className="text-slate-400/50 text-xs uppercase tracking-wider hover:text-slate-300/70 transition-colors duration-300"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Scroll
        </motion.div>
      </motion.div>

      {/* Interactive instruction */}
      <motion.div
        className="absolute top-8 left-8 text-slate-400/60 text-sm pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="mb-1 font-medium">Liquid Metal Physics</div>
        <div className="text-xs opacity-80">Move cursor to create magnetic distortions</div>
      </motion.div>

      {/* Luxury signature */}
      <motion.div
        className="absolute bottom-8 right-8 text-slate-500/40 text-xs italic pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
      >
        Chrome simulation, 2024
      </motion.div>
    </section>
  )
}

export default MercuryHero