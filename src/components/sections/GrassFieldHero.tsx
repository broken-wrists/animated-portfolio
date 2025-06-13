'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useMousePosition } from '@/hooks/useMousePosition'

interface GrassBlade {
  id: number
  x: number
  baseY: number
  height: number
  width: number
  segments: number
  bendAmount: number
  windOffset: number
  mouseInfluence: number
  growth: number
  color: string
  species: 'fescue' | 'bermuda' | 'clover' | 'wildflower'
  flexibility: number
}

interface WindGust {
  x: number
  y: number
  strength: number
  radius: number
  direction: number
  life: number
}

const GrassFieldHero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePosition = useMousePosition()
  const [grassBlades, setGrassBlades] = useState<GrassBlade[]>([])
  const [windGusts, setWindGusts] = useState<WindGust[]>([])
  const animationRef = useRef<number>()
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const timeRef = useRef(0)
  const lastMousePos = useRef({ x: 0, y: 0 })

  // Grass species configurations
  const grassTypes = {
    fescue: { 
      color: '#2d5016', 
      height: [30, 60], 
      width: [2, 4], 
      segments: 5,
      flexibility: 0.8 
    },
    bermuda: { 
      color: '#4a7c59', 
      height: [20, 40], 
      width: [1, 3], 
      segments: 4,
      flexibility: 1.2 
    },
    clover: { 
      color: '#6b8e23', 
      height: [15, 25], 
      width: [3, 6], 
      segments: 3,
      flexibility: 0.6 
    },
    wildflower: { 
      color: '#8fbc8f', 
      height: [40, 80], 
      width: [2, 5], 
      segments: 6,
      flexibility: 1.5 
    }
  }

  // Initialize grass field
  const initializeGrassField = useCallback((width: number, height: number) => {
    const newGrassBlades: GrassBlade[] = []
    const grassCount = Math.floor((width * height) / 800) // Density based on screen size
    const groundLevel = height * 0.8

    for (let i = 0; i < grassCount; i++) {
      const species = ['fescue', 'bermuda', 'clover', 'wildflower'][Math.floor(Math.random() * 4)] as keyof typeof grassTypes
      const config = grassTypes[species]
      
      newGrassBlades.push({
        id: i,
        x: Math.random() * width,
        baseY: groundLevel + (Math.random() - 0.5) * 20, // Slight terrain variation
        height: config.height[0] + Math.random() * (config.height[1] - config.height[0]),
        width: config.width[0] + Math.random() * (config.width[1] - config.width[0]),
        segments: config.segments,
        bendAmount: 0,
        windOffset: Math.random() * Math.PI * 2,
        mouseInfluence: 0,
        growth: 0.8 + Math.random() * 0.4, // Maturity level
        color: config.color,
        species,
        flexibility: config.flexibility
      })
    }

    setGrassBlades(newGrassBlades)
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
        initializeGrassField(width, height)
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [initializeGrassField])

  // Handle mouse interactions - cursor disturbance
  useEffect(() => {
    if (!canvasRef.current || grassBlades.length === 0) return

    const rect = canvasRef.current.getBoundingClientRect()
    const mouseX = mousePosition.x - rect.left
    const mouseY = mousePosition.y - rect.top

    // Calculate mouse movement for wind effect
    const deltaX = mouseX - lastMousePos.current.x
    const deltaY = mouseY - lastMousePos.current.y
    const mouseSpeed = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    // Create wind gust from mouse movement
    if (mouseSpeed > 5 && mouseX >= 0 && mouseX <= dimensions.width && mouseY >= 0 && mouseY <= dimensions.height) {
      setWindGusts(prev => [...prev.slice(-5), {
        x: mouseX,
        y: mouseY,
        strength: Math.min(mouseSpeed * 0.1, 3),
        radius: 80 + mouseSpeed * 2,
        direction: Math.atan2(deltaY, deltaX),
        life: 1.0
      }])
    }

    // Update grass mouse influence
    setGrassBlades(prevBlades =>
      prevBlades.map(blade => {
        const distance = Math.sqrt(
          Math.pow(blade.x - mouseX, 2) + Math.pow(blade.baseY - mouseY, 2)
        )
        
        const maxInfluence = 100
        const influence = distance < maxInfluence ? 
          (1 - distance / maxInfluence) * blade.flexibility : 0

        return {
          ...blade,
          mouseInfluence: influence
        }
      })
    )

    lastMousePos.current = { x: mouseX, y: mouseY }
  }, [mousePosition, grassBlades, dimensions])

  // Draw individual grass blade
  const drawGrassBlade = (ctx: CanvasRenderingContext2D, blade: GrassBlade, time: number, windEffect: number) => {
    const { x, baseY, height, width, segments, color, growth, mouseInfluence, flexibility } = blade
    
    // Calculate total bend from wind and mouse
    const windBend = Math.sin(time * 0.002 + blade.windOffset) * windEffect * flexibility
    const mouseBend = mouseInfluence * 30
    const totalBend = windBend + mouseBend

    ctx.save()
    ctx.translate(x, baseY)
    
    // Draw grass blade as curved segments
    ctx.strokeStyle = color
    ctx.lineWidth = width * growth
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    // Create gradient for more realistic grass
    const gradient = ctx.createLinearGradient(0, 0, 0, -height * growth)
    gradient.addColorStop(0, color)
    gradient.addColorStop(0.7, blade.species === 'wildflower' ? '#90EE90' : '#228B22')
    gradient.addColorStop(1, blade.species === 'wildflower' ? '#98FB98' : '#32CD32')
    ctx.strokeStyle = gradient

    ctx.beginPath()
    ctx.moveTo(0, 0)

    // Draw curved segments
    for (let i = 1; i <= segments; i++) {
      const segmentHeight = (height * growth / segments) * i
      const segmentBend = (totalBend / segments) * i * i // Quadratic bend for natural curve
      
      const segmentX = segmentBend
      const segmentY = -segmentHeight
      
      if (i === 1) {
        ctx.lineTo(segmentX, segmentY)
      } else {
        // Use quadratic curves for smoother grass
        const prevSegmentHeight = (height * growth / segments) * (i - 1)
        const prevSegmentBend = (totalBend / segments) * (i - 1) * (i - 1)
        const controlX = (segmentBend + prevSegmentBend) / 2
        const controlY = -(segmentHeight + prevSegmentHeight) / 2
        
        ctx.quadraticCurveTo(controlX, controlY, segmentX, segmentY)
      }
    }
    
    ctx.stroke()

    // Draw grass tip (seed head for some species)
    if (blade.species === 'wildflower' && growth > 0.9) {
      const tipX = (totalBend / segments) * segments * segments
      const tipY = -height * growth
      
      ctx.fillStyle = '#FFD700' // Golden seed head
      ctx.beginPath()
      ctx.arc(tipX, tipY, 2, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.restore()
  }

  // Generate ambient wind
  const generateWind = useCallback(() => {
    // Create periodic ambient wind
    if (Math.random() < 0.03) {
      setWindGusts(prev => [...prev.slice(-3), {
        x: Math.random() * dimensions.width,
        y: dimensions.height * 0.6,
        strength: 0.5 + Math.random() * 1.5,
        radius: 150 + Math.random() * 200,
        direction: Math.random() * Math.PI * 2,
        life: 1.0
      }])
    }
  }, [dimensions])

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const animate = () => {
      timeRef.current += 16 // ~60fps
      
      // Clear with sky gradient
      const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      skyGradient.addColorStop(0, '#87CEEB') // Sky blue
      skyGradient.addColorStop(0.7, '#98FB98') // Light green horizon
      skyGradient.addColorStop(1, '#228B22') // Ground green
      ctx.fillStyle = skyGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Generate ambient wind
      generateWind()

      // Update wind gusts
      setWindGusts(prevGusts => 
        prevGusts
          .map(gust => ({ ...gust, life: gust.life - 0.01 }))
          .filter(gust => gust.life > 0)
      )

      // Calculate wind effect for each blade
      const globalWindEffect = Math.sin(timeRef.current * 0.001) * 0.5 + 
                              Math.sin(timeRef.current * 0.0007) * 0.3

      // Draw grass blades (back to front for depth)
      const sortedBlades = [...grassBlades].sort((a, b) => b.baseY - a.baseY)
      
      sortedBlades.forEach(blade => {
        // Calculate local wind effect from gusts
        let localWindEffect = globalWindEffect
        
        windGusts.forEach(gust => {
          const distance = Math.sqrt(
            Math.pow(blade.x - gust.x, 2) + Math.pow(blade.baseY - gust.y, 2)
          )
          
          if (distance < gust.radius) {
            const influence = (1 - distance / gust.radius) * gust.strength * gust.life
            localWindEffect += influence
          }
        })

        drawGrassBlade(ctx, blade, timeRef.current, localWindEffect)
      })

      // Draw wind visualization (subtle)
      windGusts.forEach(gust => {
        if (gust.life > 0.5) {
          ctx.save()
          ctx.globalAlpha = (gust.life - 0.5) * 0.1
          ctx.strokeStyle = '#FFFFFF'
          ctx.lineWidth = 1
          
          // Draw wind flow lines
          for (let i = 0; i < 8; i++) {
            const angle = gust.direction + (i - 4) * 0.2
            const startX = gust.x + Math.cos(angle) * gust.radius * 0.3
            const startY = gust.y + Math.sin(angle) * gust.radius * 0.3
            const endX = gust.x + Math.cos(angle) * gust.radius * 0.8
            const endY = gust.y + Math.sin(angle) * gust.radius * 0.8
            
            ctx.beginPath()
            ctx.moveTo(startX, startY)
            ctx.lineTo(endX, endY)
            ctx.stroke()
          }
          
          ctx.restore()
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [grassBlades, windGusts, generateWind])

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Grass Field Canvas */}
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
          className="w-6 h-10 border-2 border-green-600/50 rounded-full mx-auto mb-2 relative hover:border-green-500/70 transition-colors duration-300"
        >
          <motion.div
            className="w-1 h-3 bg-green-600/60 rounded-full absolute top-2 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
        <motion.div 
          className="text-green-700/60 text-xs uppercase tracking-wider hover:text-green-600/80 transition-colors duration-300"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Scroll
        </motion.div>
      </motion.div>

      {/* Field Info */}
      <motion.div
        className="absolute top-8 left-8 text-green-800/70 text-sm pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="mb-1 font-medium">Digital Grassland Simulation</div>
        <div className="text-xs opacity-80">Move cursor to disturb the field</div>
      </motion.div>

      {/* Species Legend */}
      <motion.div
        className="absolute top-8 right-8 bg-white/80 backdrop-blur-sm rounded-lg p-4 text-xs text-green-800"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 3 }}
      >
        <div className="font-medium mb-2">Grass Species</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-green-900"></div>
            <span>Tall Fescue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-green-700"></div>
            <span>Bermuda Grass</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-green-600"></div>
            <span>White Clover</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-green-400"></div>
            <span>Wildflower</span>
          </div>
        </div>
      </motion.div>

      {/* Horticulture signature */}
      <motion.div
        className="absolute bottom-8 right-8 text-green-700/50 text-xs italic pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4 }}
      >
        Digital horticulture, 2024
      </motion.div>
    </section>
  )
}

export default GrassFieldHero