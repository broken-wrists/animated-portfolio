'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useMousePosition } from '@/hooks/useMousePosition'

interface NeuralNode {
  id: number
  x: number
  y: number
  layer: number // 0 = input, 1-2 = hidden, 3 = output
  activation: number
  bloomLevel: number
  connections: number[]
  type: 'input' | 'hidden' | 'output'
  flowerType: 'rose' | 'sunflower' | 'lily' | 'orchid'
  lastActivated: number
}

interface DataFlow {
  id: number
  fromNode: number
  toNode: number
  progress: number
  strength: number
  color: string
}

const NeuralGardenHero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePosition = useMousePosition()
  const [nodes, setNodes] = useState<NeuralNode[]>([])
  const [dataFlows, setDataFlows] = useState<DataFlow[]>([])
  const animationRef = useRef<number>()
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Flower colors for different types
  const flowerPalette = {
    rose: { petals: '#ff6b8a', center: '#ffed4e', stem: '#4ade80' },
    sunflower: { petals: '#fbbf24', center: '#92400e', stem: '#22c55e' },
    lily: { petals: '#a78bfa', center: '#fbbf24', stem: '#34d399' },
    orchid: { petals: '#f472b6', center: '#e879f9', stem: '#6ee7b7' }
  }

  // Initialize neural network structure
  const initializeNeuralNetwork = useCallback((width: number, height: number) => {
    const newNodes: NeuralNode[] = []
    const layers = [3, 5, 4, 2] // Input, Hidden1, Hidden2, Output
    const flowerTypes: (keyof typeof flowerPalette)[] = ['rose', 'sunflower', 'lily', 'orchid']
    
    let nodeId = 0
    
    // Create nodes for each layer
    layers.forEach((nodeCount, layerIndex) => {
      const layerX = (width / (layers.length + 1)) * (layerIndex + 1)
      const layerSpacing = height / (nodeCount + 1)
      
      for (let i = 0; i < nodeCount; i++) {
        const nodeY = layerSpacing * (i + 1)
        
        newNodes.push({
          id: nodeId,
          x: layerX + (Math.random() - 0.5) * 60, // Add some organic randomness
          y: nodeY + (Math.random() - 0.5) * 40,
          layer: layerIndex,
          activation: 0,
          bloomLevel: 0,
          connections: [],
          type: layerIndex === 0 ? 'input' : layerIndex === layers.length - 1 ? 'output' : 'hidden',
          flowerType: flowerTypes[Math.floor(Math.random() * flowerTypes.length)],
          lastActivated: 0
        })
        
        nodeId++
      }
    })

    // Create connections (each node connects to all nodes in next layer)
    newNodes.forEach(node => {
      if (node.layer < layers.length - 1) {
        const nextLayerNodes = newNodes.filter(n => n.layer === node.layer + 1)
        node.connections = nextLayerNodes.map(n => n.id)
      }
    })

    setNodes(newNodes)
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
        initializeNeuralNetwork(width, height)
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [initializeNeuralNetwork])

  // Handle mouse interactions - activate input nodes
  useEffect(() => {
    if (!canvasRef.current || nodes.length === 0) return

    const rect = canvasRef.current.getBoundingClientRect()
    const mouseX = mousePosition.x - rect.left
    const mouseY = mousePosition.y - rect.top

    // Find closest input node to mouse
    const inputNodes = nodes.filter(node => node.type === 'input')
    let closestNodeId: number | null = null
    let minDistance = Infinity

    inputNodes.forEach(node => {
      const distance = Math.sqrt(
        Math.pow(node.x - mouseX, 2) + Math.pow(node.y - mouseY, 2)
      )
      if (distance < minDistance && distance < 120) {
        minDistance = distance
        closestNodeId = node.id
      }
    })

    // Activate closest input node and propagate
    if (closestNodeId !== null) {
      const activationStrength = Math.max(0, 1 - minDistance / 120)
      propagateActivation(closestNodeId, activationStrength)
    }
  }, [mousePosition, nodes])

  // Propagate activation through network
  const propagateActivation = useCallback((startNodeId: number, initialStrength: number) => {
    setNodes(prevNodes => {
      const updatedNodes = [...prevNodes]
      const queue = [{ nodeId: startNodeId, strength: initialStrength, delay: 0 }]
      
      // Activate starting node
      const startNode = updatedNodes.find(n => n.id === startNodeId)
      if (startNode) {
        startNode.activation = Math.min(1, startNode.activation + initialStrength)
        startNode.lastActivated = Date.now()
      }

      // Create data flows for connections
      setTimeout(() => {
        const startNode = updatedNodes.find(n => n.id === startNodeId)
        if (startNode) {
          startNode.connections.forEach(connectedId => {
            setDataFlows(prev => [...prev.slice(-20), {
              id: Date.now() + Math.random(),
              fromNode: startNodeId,
              toNode: connectedId,
              progress: 0,
              strength: initialStrength * 0.8,
              color: flowerPalette[startNode.flowerType].petals
            }])
          })
        }
      }, 100)

      return updatedNodes
    })
  }, [flowerPalette])

  // Draw a flower based on bloom level
  const drawFlower = (ctx: CanvasRenderingContext2D, node: NeuralNode) => {
    const { x, y, bloomLevel, flowerType, activation } = node
    const colors = flowerPalette[flowerType]
    const size = 15 + bloomLevel * 25
    const glowIntensity = activation

    ctx.save()
    ctx.translate(x, y)

    // Draw glow effect
    if (glowIntensity > 0) {
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 2)
      gradient.addColorStop(0, colors.petals + '40')
      gradient.addColorStop(1, colors.petals + '00')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(0, 0, size * 2, 0, Math.PI * 2)
      ctx.fill()
    }

    // Draw stem (always visible)
    ctx.strokeStyle = colors.stem
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(0, 5)
    ctx.lineTo(0, 25 + bloomLevel * 10)
    ctx.stroke()

    if (bloomLevel > 0) {
      // Draw petals based on flower type
      ctx.fillStyle = colors.petals
      ctx.strokeStyle = colors.petals + '80'
      ctx.lineWidth = 1

      if (flowerType === 'rose' || flowerType === 'lily') {
        // Rose/Lily: circular petals
        const petalCount = 8
        for (let i = 0; i < petalCount; i++) {
          const angle = (i * Math.PI * 2) / petalCount
          const petalX = Math.cos(angle) * size * 0.6
          const petalY = Math.sin(angle) * size * 0.6
          
          ctx.beginPath()
          ctx.ellipse(petalX, petalY, size * 0.3, size * 0.2, angle, 0, Math.PI * 2)
          ctx.fill()
          ctx.stroke()
        }
      } else if (flowerType === 'sunflower') {
        // Sunflower: pointed petals
        const petalCount = 12
        for (let i = 0; i < petalCount; i++) {
          const angle = (i * Math.PI * 2) / petalCount
          ctx.beginPath()
          ctx.moveTo(0, 0)
          ctx.lineTo(Math.cos(angle) * size, Math.sin(angle) * size * 0.3)
          ctx.lineTo(Math.cos(angle + 0.2) * size * 0.8, Math.sin(angle + 0.2) * size * 0.2)
          ctx.closePath()
          ctx.fill()
        }
      } else if (flowerType === 'orchid') {
        // Orchid: elegant asymmetric petals
        const petals = [
          { x: 0, y: -size, w: size * 0.4, h: size * 0.8 },
          { x: -size * 0.7, y: -size * 0.3, w: size * 0.5, h: size * 0.6 },
          { x: size * 0.7, y: -size * 0.3, w: size * 0.5, h: size * 0.6 },
          { x: -size * 0.4, y: size * 0.3, w: size * 0.3, h: size * 0.5 },
          { x: size * 0.4, y: size * 0.3, w: size * 0.3, h: size * 0.5 }
        ]
        
        petals.forEach(petal => {
          ctx.beginPath()
          ctx.ellipse(petal.x, petal.y, petal.w, petal.h, 0, 0, Math.PI * 2)
          ctx.fill()
        })
      }

      // Draw flower center
      ctx.fillStyle = colors.center
      ctx.beginPath()
      ctx.arc(0, 0, size * 0.2, 0, Math.PI * 2)
      ctx.fill()
    } else {
      // Draw seed/bud
      ctx.fillStyle = colors.stem
      ctx.beginPath()
      ctx.arc(0, 0, 6, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.restore()
  }

  // Draw connection/branch
  const drawConnection = (ctx: CanvasRenderingContext2D, fromNode: NeuralNode, toNode: NeuralNode) => {
    ctx.strokeStyle = '#22c55e40' // Subtle green branch
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(fromNode.x, fromNode.y)
    
    // Create organic curve
    const midX = (fromNode.x + toNode.x) / 2
    const midY = (fromNode.y + toNode.y) / 2 + Math.sin((fromNode.x + toNode.x) * 0.01) * 20
    
    ctx.quadraticCurveTo(midX, midY, toNode.x, toNode.y)
    ctx.stroke()
  }

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw subtle background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, '#f0fdf4')
      gradient.addColorStop(1, '#ecfdf5')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update nodes
      setNodes(prevNodes => 
        prevNodes.map(node => {
          const timeSinceActivated = Date.now() - node.lastActivated
          const targetBloom = node.activation > 0.1 ? Math.min(1, node.activation) : 0
          const bloomSpeed = 0.02
          
          return {
            ...node,
            bloomLevel: node.bloomLevel + (targetBloom - node.bloomLevel) * bloomSpeed,
            activation: Math.max(0, node.activation - 0.005) // Slow decay
          }
        })
      )

      // Draw connections first (behind flowers)
      nodes.forEach(node => {
        node.connections.forEach(connectedId => {
          const connectedNode = nodes.find(n => n.id === connectedId)
          if (connectedNode) {
            drawConnection(ctx, node, connectedNode)
          }
        })
      })

      // Update and draw data flows
      setDataFlows(prevFlows => {
        const updatedFlows = prevFlows
          .map(flow => ({ ...flow, progress: flow.progress + 0.02 }))
          .filter(flow => flow.progress <= 1)

        // Draw data flows
        updatedFlows.forEach(flow => {
          const fromNode = nodes.find(n => n.id === flow.fromNode)
          const toNode = nodes.find(n => n.id === flow.toNode)
          
          if (fromNode && toNode) {
            const x = fromNode.x + (toNode.x - fromNode.x) * flow.progress
            const y = fromNode.y + (toNode.y - fromNode.y) * flow.progress
            
            ctx.fillStyle = flow.color + '80'
            ctx.beginPath()
            ctx.arc(x, y, 4 * flow.strength, 0, Math.PI * 2)
            ctx.fill()
            
            // Activate target node when flow arrives
            if (flow.progress > 0.9) {
              setNodes(prevNodes => 
                prevNodes.map(node => 
                  node.id === flow.toNode 
                    ? { ...node, activation: Math.min(1, node.activation + flow.strength * 0.3), lastActivated: Date.now() }
                    : node
                )
              )
            }
          }
        })

        return updatedFlows
      })

      // Draw flowers
      nodes.forEach(node => {
        drawFlower(ctx, node)
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [nodes])

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Neural Garden Canvas */}
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
          className="w-6 h-10 border-2 border-green-400/50 rounded-full mx-auto mb-2 relative hover:border-green-600/70 transition-colors duration-300"
        >
          <motion.div
            className="w-1 h-3 bg-green-500/60 rounded-full absolute top-2 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
        <motion.div 
          className="text-green-600/60 text-xs uppercase tracking-wider hover:text-green-700/80 transition-colors duration-300"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Scroll
        </motion.div>
      </motion.div>

      {/* Garden Info */}
      <motion.div
        className="absolute top-8 left-8 text-green-700/60 text-sm pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="mb-2 font-medium">Neural Network Garden</div>
        <div className="text-xs opacity-80">Move cursor to activate input nodes</div>
      </motion.div>

      {/* Legend */}
      <motion.div
        className="absolute top-8 right-8 bg-white/70 backdrop-blur-sm rounded-lg p-4 text-xs text-green-700"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 3 }}
      >
        <div className="font-medium mb-2">Garden Legend</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-300"></div>
            <span>Rose - Input Layer</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-300"></div>
            <span>Sunflower - Hidden</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-300"></div>
            <span>Lily - Hidden</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-pink-300"></div>
            <span>Orchid - Output</span>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default NeuralGardenHero