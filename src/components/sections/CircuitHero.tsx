'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useMousePosition } from '@/hooks/useMousePosition'

interface CircuitNode {
  id: number
  x: number
  y: number
  connections: number[]
  active: boolean
  pulseTime: number
}

interface CircuitPath {
  id: number
  from: number
  to: number
  active: boolean
  progress: number
  glowIntensity: number
}

interface Pulse {
  id: number
  pathId: number
  progress: number
  speed: number
  intensity: number
}

const CircuitHero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePosition = useMousePosition()
  const [nodes, setNodes] = useState<CircuitNode[]>([])
  const [paths, setPaths] = useState<CircuitPath[]>([])
  const [pulses, setPulses] = useState<Pulse[]>([])
  const animationRef = useRef<number>()
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Initialize circuit network
  const initializeCircuit = useCallback((width: number, height: number) => {
    const nodeCount = 25
    const newNodes: CircuitNode[] = []
    const newPaths: CircuitPath[] = []

    // Create nodes in a grid-like pattern with some randomness
    for (let i = 0; i < nodeCount; i++) {
      const gridX = (i % 5) * (width / 4) + width / 8
      const gridY = Math.floor(i / 5) * (height / 4) + height / 8
      
      newNodes.push({
        id: i,
        x: gridX + (Math.random() - 0.5) * 100,
        y: gridY + (Math.random() - 0.5) * 100,
        connections: [],
        active: false,
        pulseTime: 0
      })
    }

    // Create connections between nearby nodes
    let pathId = 0
    for (let i = 0; i < newNodes.length; i++) {
      for (let j = i + 1; j < newNodes.length; j++) {
        const distance = Math.sqrt(
          Math.pow(newNodes[i].x - newNodes[j].x, 2) + 
          Math.pow(newNodes[i].y - newNodes[j].y, 2)
        )
        
        // Connect nodes that are close enough
        if (distance < 200 && Math.random() > 0.6) {
          newNodes[i].connections.push(j)
          newNodes[j].connections.push(i)
          
          newPaths.push({
            id: pathId++,
            from: i,
            to: j,
            active: false,
            progress: 0,
            glowIntensity: 0
          })
        }
      }
    }

    setNodes(newNodes)
    setPaths(newPaths)
  }, [])

  // Update dimensions and reinitialize circuit
  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current) {
        const width = window.innerWidth
        const height = window.innerHeight
        canvasRef.current.width = width
        canvasRef.current.height = height
        setDimensions({ width, height })
        initializeCircuit(width, height)
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [initializeCircuit])

  // Handle mouse interactions
  useEffect(() => {
    if (!canvasRef.current || nodes.length === 0) return

    const rect = canvasRef.current.getBoundingClientRect()
    const mouseX = mousePosition.x - rect.left
    const mouseY = mousePosition.y - rect.top

    // Find closest node to mouse
    let closestNode = -1
    let minDistance = Infinity

    nodes.forEach((node, index) => {
      const distance = Math.sqrt(
        Math.pow(node.x - mouseX, 2) + Math.pow(node.y - mouseY, 2)
      )
      if (distance < minDistance && distance < 150) {
        minDistance = distance
        closestNode = index
      }
    })

    // Activate nodes and paths near mouse
    setNodes(prevNodes => 
      prevNodes.map((node, index) => ({
        ...node,
        active: index === closestNode || (closestNode !== -1 && node.connections.includes(closestNode)),
        pulseTime: index === closestNode ? Date.now() : node.pulseTime
      }))
    )

    // Create pulses from activated node
    if (closestNode !== -1 && Math.random() > 0.8) {
      const connectedPaths = paths.filter(path => 
        path.from === closestNode || path.to === closestNode
      )
      
      if (connectedPaths.length > 0) {
        const randomPath = connectedPaths[Math.floor(Math.random() * connectedPaths.length)]
        setPulses(prev => [...prev.slice(-10), {
          id: Date.now() + Math.random(),
          pathId: randomPath.id,
          progress: 0,
          speed: 0.02 + Math.random() * 0.02,
          intensity: 0.8 + Math.random() * 0.2
        }])
      }
    }
  }, [mousePosition, nodes, paths])

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background grid
      ctx.strokeStyle = 'rgba(57, 255, 20, 0.05)'
      ctx.lineWidth = 1
      const gridSize = 50
      
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Draw circuit paths
      paths.forEach(path => {
        const fromNode = nodes[path.from]
        const toNode = nodes[path.to]
        
        if (!fromNode || !toNode) return

        const isActive = fromNode.active || toNode.active
        const alpha = isActive ? 0.8 : 0.2
        const lineWidth = isActive ? 3 : 1
        
        ctx.beginPath()
        ctx.moveTo(fromNode.x, fromNode.y)
        ctx.lineTo(toNode.x, toNode.y)
        ctx.strokeStyle = `rgba(0, 127, 255, ${alpha})`
        ctx.lineWidth = lineWidth
        ctx.stroke()

        // Add glow effect for active paths
        if (isActive) {
          ctx.beginPath()
          ctx.moveTo(fromNode.x, fromNode.y)
          ctx.lineTo(toNode.x, toNode.y)
          ctx.strokeStyle = `rgba(0, 127, 255, 0.3)`
          ctx.lineWidth = 8
          ctx.stroke()
        }
      })

      // Draw pulses
      setPulses(prevPulses => {
        const updatedPulses = prevPulses
          .map(pulse => ({ ...pulse, progress: pulse.progress + pulse.speed }))
          .filter(pulse => pulse.progress <= 1)

        updatedPulses.forEach(pulse => {
          const path = paths.find(p => p.id === pulse.pathId)
          if (!path) return

          const fromNode = nodes[path.from]
          const toNode = nodes[path.to]
          if (!fromNode || !toNode) return

          const x = fromNode.x + (toNode.x - fromNode.x) * pulse.progress
          const y = fromNode.y + (toNode.y - fromNode.y) * pulse.progress

          // Draw pulse
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, 15)
          gradient.addColorStop(0, `rgba(57, 255, 20, ${pulse.intensity})`)
          gradient.addColorStop(0.5, `rgba(57, 255, 20, ${pulse.intensity * 0.5})`)
          gradient.addColorStop(1, 'rgba(57, 255, 20, 0)')
          
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(x, y, 15, 0, Math.PI * 2)
          ctx.fill()
        })

        return updatedPulses
      })

      // Draw circuit nodes
      nodes.forEach(node => {
        const time = Date.now()
        const timeSincePulse = time - node.pulseTime
        const pulseEffect = Math.max(0, 1 - timeSincePulse / 1000)
        
        const baseSize = 6
        const size = node.active ? baseSize + pulseEffect * 4 : baseSize
        const alpha = node.active ? 1 : 0.6

        // Node glow
        if (node.active) {
          const glowGradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, size * 3)
          glowGradient.addColorStop(0, `rgba(255, 20, 147, ${alpha * 0.6})`)
          glowGradient.addColorStop(1, 'rgba(255, 20, 147, 0)')
          ctx.fillStyle = glowGradient
          ctx.beginPath()
          ctx.arc(node.x, node.y, size * 3, 0, Math.PI * 2)
          ctx.fill()
        }

        // Main node
        ctx.fillStyle = node.active 
          ? `rgba(255, 20, 147, ${alpha})` 
          : `rgba(0, 127, 255, ${alpha})`
        ctx.beginPath()
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2)
        ctx.fill()

        // Node border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
        ctx.lineWidth = 1
        ctx.stroke()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [nodes, paths])

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Circuit Board Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-none"
        style={{ background: 'radial-gradient(circle at center, #0a0a0a 0%, #000000 100%)' }}
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
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-cyan-500/10 backdrop-blur-md border border-cyan-500/20 text-cyan-400 text-sm font-medium">
              ⚡ System Online - Welcome
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
                background: 'linear-gradient(135deg, #39ff14 0%, #007fff 50%, #ff1493 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 20px rgba(57, 255, 20, 0.5))'
              }}
            >
              Digital Artisan
            </span>
          </motion.h1>

          <motion.div
            className="text-xl md:text-2xl text-gray-300 mb-8 font-light tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            James Guadagnoli - Creative Developer & Digital Artist
          </motion.div>

          <motion.p
            className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            Crafting{' '}
            <span className="text-cyan-400 font-semibold">immersive experiences</span>
            {' '}through code, creativity, and{' '}
            <span className="text-pink-400 font-semibold">cutting-edge technology</span>
          </motion.p>

          <motion.p
            className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto"
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
              className="group relative px-8 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border border-cyan-500/30 rounded-full text-white font-medium hover:border-cyan-400 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              View My Work
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/30 to-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </motion.button>

            <motion.button
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 text-gray-300 hover:text-cyan-400 transition-colors duration-300"
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
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-center text-gray-500 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <p className="text-sm tracking-wider mb-2">
          Move cursor to activate circuit pathways
        </p>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-xs"
        >
          ↓
        </motion.div>
      </motion.div>
    </section>
  )
}

export default CircuitHero