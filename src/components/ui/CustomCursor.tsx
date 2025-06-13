'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMousePosition } from '@/hooks/useMousePosition'

interface CursorState {
  isHovering: boolean
  cursorType: 'default' | 'link' | 'button' | 'text' | 'image'
  color: string
  scale: number
  text?: string
}

const CustomCursor: React.FC = () => {
  const mousePosition = useMousePosition()
  const [cursorState, setCursorState] = useState<CursorState>({
    isHovering: false,
    cursorType: 'default',
    color: '#39ff14',
    scale: 1,
  })
  const [dynamicColor, setDynamicColor] = useState('#39ff14')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      // Check for specific elements and set cursor state accordingly
      if (target.tagName === 'A' || target.closest('a')) {
        setCursorState({
          isHovering: true,
          cursorType: 'link',
          color: '#007fff',
          scale: 1.5,
          text: 'CLICK'
        })
      } else if (target.tagName === 'BUTTON' || target.closest('button') || target.getAttribute('role') === 'button') {
        setCursorState({
          isHovering: true,
          cursorType: 'button',
          color: '#ff1493',
          scale: 2,
          text: 'PRESS'
        })
      } else if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
        setCursorState({
          isHovering: true,
          cursorType: 'text',
          color: '#4a0080',
          scale: 1.2,
          text: 'TYPE'
        })
      } else if (target.tagName === 'IMG' || target.closest('[data-cursor="image"]')) {
        setCursorState({
          isHovering: true,
          cursorType: 'image',
          color: '#39ff14',
          scale: 3,
          text: 'VIEW'
        })
      } else if (target.closest('[data-cursor="hover"]') || target.classList.contains('cursor-hover')) {
        setCursorState({
          isHovering: true,
          cursorType: 'default',
          color: '#007fff',
          scale: 1.8,
        })
      } else {
        setCursorState({
          isHovering: false,
          cursorType: 'default',
          color: dynamicColor,
          scale: 1,
        })
      }
    }

    const handleElementLeave = () => {
      setCursorState({
        isHovering: false,
        cursorType: 'default',
        color: dynamicColor,
        scale: 1,
      })
    }

    // Add event listeners to document
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseover', handleElementHover)
    document.addEventListener('mouseout', handleElementLeave)

    // Hide default cursor
    document.body.style.cursor = 'none'
    
    return () => {
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseover', handleElementHover)
      document.removeEventListener('mouseout', handleElementLeave)
      document.body.style.cursor = 'auto'
    }
  }, [dynamicColor])

  // Dynamic color shifting effect
  useEffect(() => {
    const colorPalette = [
      '#39ff14', // neon green
      '#00ff88', // mint green
      '#00ffcc', // cyan
      '#00ccff', // light blue
      '#007fff', // electric blue
      '#0044ff', // deep blue
      '#4400ff', // purple blue
      '#8800ff', // purple
      '#cc00ff', // magenta
      '#ff00cc', // pink
      '#ff0088', // hot pink
      '#ff0044', // red pink
      '#ff4400', // orange red
      '#ff8800', // orange
      '#ffcc00', // yellow orange
      '#ccff00', // lime
      '#88ff00', // light green
      '#44ff00', // bright green
    ]

    let colorIndex = 0
    const colorShiftInterval = setInterval(() => {
      if (!cursorState.isHovering) {
        setDynamicColor(colorPalette[colorIndex])
        colorIndex = (colorIndex + 1) % colorPalette.length
      }
    }, 150) // Change color every 150ms for smooth transitions

    return () => clearInterval(colorShiftInterval)
  }, [cursorState.isHovering])

  // Mouse movement color changes
  useEffect(() => {
    let lastMoveTime = Date.now()
    
    const handleMouseMove = () => {
      const now = Date.now()
      const timeDiff = now - lastMoveTime
      
      if (timeDiff > 50 && !cursorState.isHovering) { // Only change if not hovering
        const colors = ['#39ff14', '#007fff', '#ff1493', '#4a0080', '#00ffcc', '#ff8800']
        const randomColor = colors[Math.floor(Math.random() * colors.length)]
        setDynamicColor(randomColor)
      }
      
      lastMoveTime = now
    }

    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [cursorState.isHovering])

  // Hide cursor on mobile
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches || 
                    window.matchMedia('(hover: none)').matches
    
    if (isMobile) {
      setIsVisible(false)
    }
  }, [])

  const currentColor = cursorState.isHovering ? cursorState.color : dynamicColor

  const cursorVariants = {
    default: {
      scale: cursorState.scale,
      backgroundColor: currentColor,
      mixBlendMode: 'difference' as const,
      boxShadow: `0 0 20px ${currentColor}40`,
    },
    hover: {
      scale: cursorState.scale,
      backgroundColor: cursorState.color,
      mixBlendMode: 'difference' as const,
      boxShadow: `0 0 30px ${cursorState.color}60`,
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Main Cursor */}
          <motion.div
            className="fixed pointer-events-none z-[9999] rounded-full"
            style={{
              left: mousePosition.x - 16,
              top: mousePosition.y - 16,
            }}
            variants={cursorVariants}
            animate={cursorState.isHovering ? 'hover' : 'default'}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 30,
              mass: 0.5,
            }}
            initial={{
              width: 32,
              height: 32,
              scale: 0,
              backgroundColor: cursorState.color,
            }}
          >
            {/* Inner dot */}
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"
              animate={{
                scale: cursorState.isHovering ? 0 : 1,
                opacity: cursorState.isHovering ? 0 : 1,
              }}
              transition={{ duration: 0.2 }}
            />

            {/* Ripple effect */}
            <motion.div
              className="absolute inset-0 rounded-full border border-current"
              animate={{
                scale: [1, 2, 1],
                opacity: [0.8, 0, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Color gradient overlay */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: `linear-gradient(45deg, ${currentColor}, transparent, ${currentColor})`
              }}
              animate={{
                rotate: 360,
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                rotate: {
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                },
                opacity: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
              }}
            />
          </motion.div>

          {/* Cursor Trail */}
          <motion.div
            className="fixed pointer-events-none z-[9998] rounded-full opacity-40"
            style={{
              left: mousePosition.x - 8,
              top: mousePosition.y - 8,
              width: 16,
              height: 16,
              backgroundColor: currentColor,
              boxShadow: `0 0 15px ${currentColor}80`,
            }}
            transition={{
              type: 'spring',
              stiffness: 150,
              damping: 20,
              mass: 1,
            }}
          />

          {/* Secondary trail with different color */}
          <motion.div
            className="fixed pointer-events-none z-[9997] rounded-full opacity-20"
            style={{
              left: mousePosition.x - 6,
              top: mousePosition.y - 6,
              width: 12,
              height: 12,
              backgroundColor: cursorState.isHovering ? cursorState.color : '#ffffff',
            }}
            transition={{
              type: 'spring',
              stiffness: 100,
              damping: 25,
              mass: 1.5,
            }}
          />

          {/* Magnification Effect */}
          {cursorState.cursorType === 'image' && (
            <motion.div
              className="fixed pointer-events-none z-[9997]"
              style={{
                left: mousePosition.x - 60,
                top: mousePosition.y - 60,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-neon-green/20 to-electric-blue/20 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">ZOOM</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Cursor Text */}
          <AnimatePresence>
            {cursorState.text && cursorState.isHovering && (
              <motion.div
                className="fixed pointer-events-none z-[9996] text-white text-xs font-bold uppercase tracking-wider"
                style={{
                  left: mousePosition.x + 30,
                  top: mousePosition.y - 10,
                }}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="px-3 py-1 bg-black/80 rounded-full border border-white/20 backdrop-blur-sm">
                  {cursorState.text}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Color Ring Indicator */}
          <motion.div
            className="fixed pointer-events-none z-[9995] rounded-full border-2"
            style={{
              left: mousePosition.x - 24,
              top: mousePosition.y - 24,
              width: 48,
              height: 48,
              borderColor: currentColor,
              background: `conic-gradient(from 0deg, ${currentColor}40, transparent, ${currentColor}40)`,
            }}
            animate={{
              rotate: 360,
              scale: cursorState.isHovering ? 1.5 : 1,
            }}
            transition={{
              rotate: {
                duration: 8,
                repeat: Infinity,
                ease: 'linear',
              },
              scale: {
                duration: 0.3,
                ease: 'easeOut',
              },
            }}
          />

          {/* Particle Effects */}
          {cursorState.isHovering && (
            <div className="fixed pointer-events-none z-[9994]">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    left: mousePosition.x,
                    top: mousePosition.y,
                    backgroundColor: currentColor,
                  }}
                  animate={{
                    x: [0, (Math.cos(i * 60 * Math.PI / 180) * 30)],
                    y: [0, (Math.sin(i * 60 * Math.PI / 180) * 30)],
                    opacity: [1, 0],
                    scale: [1, 0],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </div>
          )}
        </>
      )}
    </AnimatePresence>
  )
}

export default CustomCursor