'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useMousePosition } from '@/hooks/useMousePosition'

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  charge: number // -1, 0, or 1
  energy: number
  trail: { x: number; y: number; alpha: number }[]
  type: 'electron' | 'proton' | 'neutron' | 'photon'
  spin: number
  entangled?: number // ID of entangled particle
}

interface QuantumField {
  x: number
  y: number
  strength: number
  type: 'attractive' | 'repulsive'
  radius: number
  decay: number
}

const QuantumHero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePosition = useMousePosition()
  const [particles, setParticles] = useState<Particle[]>([])
  const [fields, setFields] = useState<QuantumField[]>([])
  const animationRef = useRef<number>()
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const lastMousePos = useRef({ x: 0, y: 0 })

  // Particle types with their properties
  const particleTypes = {
    electron: { color: '#00d4ff', size: 3, charge: -1, mass: 1 },
    proton: { color: '#ff6b35', size: 4, charge: 1, mass: 1836 },
    neutron: { color: '#a8e6cf', size: 4, charge: 0, mass: 1839 },
    photon: { color: '#ffff00', size: 2, charge: 0, mass: 0 }
  }

  // Initialize quantum field
  const initializeQuantumField = useCallback((width: number, height: number) => {
    const particleCount = 80
    const newParticles: Particle[] = []

    for (let i = 0; i < particleCount; i++) {
      const types = Object.keys(particleTypes) as Array<keyof typeof particleTypes>
      const type = types[Math.floor(Math.random() * types.length)]
      const config = particleTypes[type]

      const particle: Particle = {
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: config.size + Math.random() * 2,
        charge: config.charge,
        energy: Math.random() * 100 + 50,
        trail: [],
        type,
        spin: Math.random() * Math.PI * 2,
        entangled: Math.random() > 0.9 ? Math.floor(Math.random() * particleCount) : undefined
      }

      newParticles.push(particle)
    }

    setParticles(newParticles)
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
        initializeQuantumField(width, height)
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [initializeQuantumField])

  // Handle mouse interactions - create quantum fields
  useEffect(() => {
    if (!canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const mouseX = mousePosition.x - rect.left
    const mouseY = mousePosition.y - rect.top

    // Calculate mouse movement
    const deltaX = mouseX - lastMousePos.current.x
    const deltaY = mouseY - lastMousePos.current.y
    const mouseSpeed = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    // Create quantum field based on mouse movement
    if (mouseSpeed > 5 && mouseX >= 0 && mouseX <= dimensions.width && mouseY >= 0 && mouseY <= dimensions.height) {
      const fieldType = Math.random() > 0.5 ? 'attractive' : 'repulsive'
      const strength = Math.min(mouseSpeed * 0.1, 5)

      setFields(prev => [...prev.slice(-8), {
        x: mouseX,
        y: mouseY,
        strength,
        type: fieldType,
        radius: 100 + mouseSpeed * 2,
        decay: 0.95
      }])
    }

    lastMousePos.current = { x: mouseX, y: mouseY }
  }, [mousePosition, dimensions])

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const animate = () => {
      // Clear canvas with quantum vacuum effect
      ctx.fillStyle = 'rgba(5, 5, 15, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw quantum foam background
      ctx.fillStyle = 'rgba(20, 30, 60, 0.02)'
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const size = Math.random() * 3
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }

      // Update and draw quantum fields
      setFields(prevFields => {
        const updatedFields = prevFields
          .map(field => ({
            ...field,
            strength: field.strength * field.decay,
            radius: field.radius * 1.02
          }))
          .filter(field => field.strength > 0.1)

        // Draw field visualizations
        updatedFields.forEach(field => {
          const gradient = ctx.createRadialGradient(
            field.x, field.y, 0,
            field.x, field.y, field.radius
          )
          
          const color = field.type === 'attractive' ? '100, 150, 255' : '255, 100, 150'
          gradient.addColorStop(0, `rgba(${color}, ${field.strength * 0.1})`)
          gradient.addColorStop(0.5, `rgba(${color}, ${field.strength * 0.05})`)
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(field.x, field.y, field.radius, 0, Math.PI * 2)
          ctx.fill()

          // Draw field lines
          ctx.strokeStyle = `rgba(${color}, ${field.strength * 0.3})`
          ctx.lineWidth = 1
          for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
            const startRadius = field.radius * 0.3
            const endRadius = field.radius * 0.8
            const startX = field.x + Math.cos(angle) * startRadius
            const startY = field.y + Math.sin(angle) * startRadius
            const endX = field.x + Math.cos(angle) * endRadius
            const endY = field.y + Math.sin(angle) * endRadius

            ctx.beginPath()
            ctx.moveTo(startX, startY)
            ctx.lineTo(endX, endY)
            ctx.stroke()
          }
        })

        return updatedFields
      })

      // Update and draw particles
      setParticles(prevParticles => {
        return prevParticles.map(particle => {
          let newVx = particle.vx
          let newVy = particle.vy

          // Apply quantum field forces
          fields.forEach(field => {
            const dx = field.x - particle.x
            const dy = field.y - particle.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < field.radius && distance > 0) {
              const force = field.strength / (distance * distance) * 0.1
              const forceX = (dx / distance) * force
              const forceY = (dy / distance) * force

              if (field.type === 'attractive') {
                newVx += forceX * (particle.charge || 1)
                newVy += forceY * (particle.charge || 1)
              } else {
                newVx -= forceX * (particle.charge || 1)
                newVy -= forceY * (particle.charge || 1)
              }
            }
          })

          // Particle interactions (simplified quantum mechanics)
          prevParticles.forEach(other => {
            if (other.id !== particle.id) {
              const dx = other.x - particle.x
              const dy = other.y - particle.y
              const distance = Math.sqrt(dx * dx + dy * dy)

              if (distance < 50 && distance > 0) {
                // Electromagnetic force
                const force = (particle.charge * other.charge) / (distance * distance) * 0.02
                newVx -= (dx / distance) * force
                newVy -= (dy / distance) * force

                // Entanglement effects
                if (particle.entangled === other.id) {
                  newVx += (dx / distance) * 0.01
                  newVy += (dy / distance) * 0.01
                }
              }
            }
          })

          // Apply velocity damping
          newVx *= 0.99
          newVy *= 0.99

          // Update position
          let newX = particle.x + newVx
          let newY = particle.y + newVy

          // Boundary conditions with quantum tunneling effect
          if (newX < 0 || newX > canvas.width) {
            newVx *= -0.8
            newX = Math.max(0, Math.min(canvas.width, newX))
          }
          if (newY < 0 || newY > canvas.height) {
            newVy *= -0.8
            newY = Math.max(0, Math.min(canvas.height, newY))
          }

          // Update trail
          const newTrail = [
            { x: particle.x, y: particle.y, alpha: 1 },
            ...particle.trail.slice(0, 15)
          ].map((point, index) => ({
            ...point,
            alpha: point.alpha * 0.9
          }))

          return {
            ...particle,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            spin: particle.spin + 0.1,
            trail: newTrail,
            energy: Math.max(10, particle.energy * 0.999)
          }
        })
      })

      // Draw particles and their quantum properties
      particles.forEach(particle => {
        const config = particleTypes[particle.type]

        // Draw particle trail
        particle.trail.forEach((point, index) => {
          if (point.alpha > 0.1) {
            ctx.fillStyle = `${config.color}${Math.floor(point.alpha * 255).toString(16).padStart(2, '0')}`
            ctx.beginPath()
            ctx.arc(point.x, point.y, particle.size * (0.3 + point.alpha * 0.7), 0, Math.PI * 2)
            ctx.fill()
          }
        })

        // Draw uncertainty principle cloud
        const uncertainty = particle.energy / 100
        ctx.fillStyle = `${config.color}20`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * uncertainty, 0, Math.PI * 2)
        ctx.fill()

        // Draw main particle
        ctx.fillStyle = config.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()

        // Draw particle glow
        const glowGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3
        )
        glowGradient.addColorStop(0, `${config.color}80`)
        glowGradient.addColorStop(1, `${config.color}00`)
        ctx.fillStyle = glowGradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2)
        ctx.fill()

        // Draw spin indicator
        if (particle.type !== 'photon') {
          ctx.strokeStyle = config.color
          ctx.lineWidth = 1
          ctx.beginPath()
          const spinX = particle.x + Math.cos(particle.spin) * particle.size * 1.5
          const spinY = particle.y + Math.sin(particle.spin) * particle.size * 1.5
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(spinX, spinY)
          ctx.stroke()
        }

        // Draw entanglement connections
        if (particle.entangled !== undefined) {
          const entangledParticle = particles.find(p => p.id === particle.entangled)
          if (entangledParticle) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
            ctx.lineWidth = 1
            ctx.setLineDash([5, 5])
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(entangledParticle.x, entangledParticle.y)
            ctx.stroke()
            ctx.setLineDash([])
          }
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
  }, [particles, fields])

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
      {/* Quantum Field Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-none"
      />

      {/* Content Overlay */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <div className="text-center max-w-4xl mx-auto">
          {/* Greeting */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 backdrop-blur-md border border-blue-500/20 text-blue-300 text-sm font-medium">
              ⚛️ Quantum Field Activated - Welcome
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 1 }}
          >
            <span className="block text-white mb-2">I'm a</span>
            <span 
              className="block"
              style={{
                background: 'linear-gradient(135deg, #00d4ff 0%, #ff6b35 30%, #a8e6cf 60%, #ffff00 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 20px rgba(0, 212, 255, 0.5))'
              }}
            >
              Digital Artisan
            </span>
          </motion.h1>

          <motion.div
            className="text-xl md:text-2xl text-blue-200 mb-8 font-light tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            James Guadagnoli - Creative Developer & Digital Artist
          </motion.div>

          <motion.p
            className="text-xl md:text-2xl lg:text-3xl text-slate-200 mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            Crafting{' '}
            <span className="text-blue-300 font-semibold">immersive experiences</span>
            {' '}through code, creativity, and{' '}
            <span className="text-orange-300 font-semibold">cutting-edge technology</span>
          </motion.p>

          <motion.p
            className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8 }}
          >
            I transform ideas into stunning digital realities using modern web technologies,
            3D animations, and interactive experiences that push the boundaries of what's possible.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <motion.button
              onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative px-8 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 rounded-full text-white font-medium hover:border-blue-400 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              View My Work
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </motion.button>

            <motion.button
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 text-slate-300 hover:text-blue-300 transition-colors duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Get In Touch →
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Interactive instruction */}
      <motion.div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-center text-slate-500 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <p className="text-sm tracking-wider mb-2">
          Move cursor to manipulate quantum fields
        </p>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-xs"
        >
          ↓
        </motion.div>
      </motion.div>

      {/* Particle Legend */}
      <motion.div
        className="absolute top-8 right-8 bg-black/20 backdrop-blur-md rounded-lg p-4 text-xs text-white"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 3 }}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-400"></div>
            <span>Electrons</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-400"></div>
            <span>Protons</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-300"></div>
            <span>Neutrons</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <span>Photons</span>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default QuantumHero