'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useMousePosition } from '@/hooks/useMousePosition'

interface FloatingElement {
  id: number
  content: string
  speed: number
  x: number
  y: number
  size: number
  delay: number
}

const InteractiveParallaxHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const mousePosition = useMousePosition()
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 })

  // Floating elements configuration
  const floatingElements: FloatingElement[] = [
    { id: 1, content: '🌟', speed: 0.5, x: 10, y: 15, size: 2, delay: 0 },
    { id: 2, content: '⚡', speed: 0.3, x: 85, y: 70, size: 2, delay: 2 },
    { id: 3, content: '🔮', speed: 0.7, x: 80, y: 25, size: 2, delay: 1 },
    { id: 4, content: '💫', speed: 0.4, x: 15, y: 60, size: 2, delay: 3 },
    { id: 5, content: '✨', speed: 0.6, x: 90, y: 40, size: 2, delay: 4 },
    { id: 6, content: '🌀', speed: 0.35, x: 50, y: 80, size: 2, delay: 1.5 }
  ]

  // Update dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = window.innerWidth
        const height = window.innerHeight
        setDimensions({ width, height })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Calculate mouse offset for parallax
  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      // Convert mouse position to center-based coordinates
      const centerX = dimensions.width / 2
      const centerY = dimensions.height / 2
      
      const offsetX = (mousePosition.x - centerX) * 0.5 // Sensitivity factor
      const offsetY = (mousePosition.y - centerY) * 0.5
      
      // Limit movement to prevent elements going too far off-screen
      const maxMovement = 50
      const limitedX = Math.max(-maxMovement, Math.min(maxMovement, offsetX))
      const limitedY = Math.max(-maxMovement, Math.min(maxMovement, offsetY))
      
      setMouseOffset({ x: limitedX, y: limitedY })
    }
  }, [mousePosition, dimensions])

  // Calculate parallax transform for an element
  const getParallaxTransform = useCallback((speed: number) => {
    const moveX = mouseOffset.x * speed
    const moveY = mouseOffset.y * speed
    return `translate(${moveX}px, ${moveY}px)`
  }, [mouseOffset])

  // Handle button clicks
  const handleExploreWork = () => {
    const aboutSection = document.querySelector('#hero-content')
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleContact = () => {
    const contactSection = document.querySelector('#contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center"
    >
      {/* Background Pattern Layer */}
      <div 
        className="absolute inset-0 w-full h-full opacity-20"
        style={{
          transform: getParallaxTransform(0.2),
          background: `
            radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.05) 0%, transparent 50%)
          `
        }}
      />

      {/* Floating Emoji Elements */}
      {floatingElements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute pointer-events-none z-10"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            fontSize: `${element.size}rem`,
            transform: getParallaxTransform(element.speed),
            filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))'
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            delay: element.delay, 
            duration: 0.8,
            ease: "easeOut"
          }}
        >
          <motion.span
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: element.delay
            }}
          >
            {element.content}
          </motion.span>
        </motion.div>
      ))}

      {/* SVG Geometric Elements */}
      <div 
        className="absolute top-[20%] left-[60%] pointer-events-none z-10"
        style={{ transform: getParallaxTransform(0.8) }}
      >
        <motion.svg 
          width="60" 
          height="60" 
          viewBox="0 0 60 60"
          initial={{ opacity: 0, rotate: -180 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <motion.polygon 
            points="30,5 55,50 5,50" 
            fill="#6366f1" 
            opacity="0.7"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
        </motion.svg>
      </div>

      <div 
        className="absolute top-[50%] left-[10%] pointer-events-none z-10"
        style={{ transform: getParallaxTransform(0.25) }}
      >
        <motion.svg 
          width="80" 
          height="80" 
          viewBox="0 0 80 80"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
        >
          <motion.circle 
            cx="40" 
            cy="40" 
            r="35" 
            fill="none" 
            stroke="#10b981" 
            strokeWidth="3" 
            opacity="0.6"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 2.5 }}
          />
        </motion.svg>
      </div>

      <div 
        className="absolute top-[75%] left-[75%] pointer-events-none z-10"
        style={{ transform: getParallaxTransform(0.55) }}
      >
        <motion.svg 
          width="50" 
          height="50" 
          viewBox="0 0 50 50"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 4.5, duration: 1 }}
        >
          <motion.rect 
            x="10" 
            y="10" 
            width="30" 
            height="30" 
            fill="#f59e0b" 
            opacity="0.5" 
            rx="5"
            animate={{ rotate: [0, 90, 180, 270, 360] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
        </motion.svg>
      </div>

      {/* Main Content */}
      <div 
        className="text-center z-20 max-w-4xl px-8"
        style={{ transform: getParallaxTransform(0.1) }}
      >
        <motion.h1 
          className="text-6xl md:text-8xl lg:text-9xl font-black leading-none mb-6 tracking-tight"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <motion.span 
            className="block bg-gradient-to-r from-white via-purple-400 to-cyan-400 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              backgroundSize: '200% 200%'
            }}
          >
            Digital
          </motion.span>
          <motion.span 
            className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-white bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ['100% 50%', '0% 50%', '100% 50%']
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
            style={{
              backgroundSize: '200% 200%'
            }}
          >
            Artisan
          </motion.span>
        </motion.h1>

        <motion.p 
          className="text-xl md:text-2xl text-gray-300 mb-12 font-light tracking-wide max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          Creating immersive experiences through interactive design
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <motion.button
            onClick={handleExploreWork}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all duration-300 cursor-pointer border-none"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(99, 102, 241, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Work
          </motion.button>

          <motion.button
            onClick={handleContact}
            className="bg-transparent text-white px-10 py-4 rounded-full text-lg font-semibold border-2 border-white/30 hover:border-white/80 transition-all duration-300 cursor-pointer"
            whileHover={{ 
              scale: 1.05,
              borderColor: "rgba(255, 255, 255, 0.8)",
              boxShadow: "0 10px 30px rgba(255, 255, 255, 0.1)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            Contact
          </motion.button>
        </motion.div>
      </div>

      {/* Ambient Particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-white/60 rounded-full pointer-events-none"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + i * 10}%`,
            transform: getParallaxTransform(0.9 - i * 0.1)
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0.6, 1, 0.6],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 3
          }}
        />
      ))}

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer z-20 flex flex-col items-center text-white/60 hover:text-white/80 transition-colors duration-300"
        onClick={handleExploreWork}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
        whileHover={{ scale: 1.1 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-white/30 rounded-full mb-2 relative"
          animate={{ borderColor: ["rgba(255,255,255,0.3)", "rgba(255,255,255,0.6)", "rgba(255,255,255,0.3)"] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-3 bg-white/50 rounded-full absolute top-2 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
        <motion.span 
          className="text-xs uppercase tracking-wider"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Scroll
        </motion.span>
      </motion.div>
    </section>
  )
}

export default InteractiveParallaxHero