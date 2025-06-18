'use client'

import React, { useEffect, useState, useRef } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'
import { useOptimizedMouse } from '@/hooks/useOptimizedMouse'

interface CursorState {
  isVisible: boolean
  isHovering: boolean
  cursorType: 'default' | 'hover' | 'click' | 'text'
}

const CustomCursor: React.FC = () => {
  const [cursorState, setCursorState] = useState<CursorState>({
    isVisible: false,
    isHovering: false,
    cursorType: 'default'
  })
  
  const mousePosition = useOptimizedMouse(8) // Ultra smooth 120fps
  const cursorRef = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLDivElement>(null)
  
  // Smooth cursor movement with spring physics
  const cursorX = useSpring(0, { stiffness: 400, damping: 25 })
  const cursorY = useSpring(0, { stiffness: 400, damping: 25 })
  
  // Trail follows with more lag
  const trailX = useSpring(0, { stiffness: 200, damping: 30 })
  const trailY = useSpring(0, { stiffness: 200, damping: 30 })

  // Update cursor position
  useEffect(() => {
    cursorX.set(mousePosition.x)
    cursorY.set(mousePosition.y)
    trailX.set(mousePosition.x)
    trailY.set(mousePosition.y)
  }, [mousePosition.x, mousePosition.y, cursorX, cursorY, trailX, trailY])

  // Handle cursor visibility and interaction states
  useEffect(() => {
    const handleMouseEnter = () => setCursorState(prev => ({ ...prev, isVisible: true }))
    const handleMouseLeave = () => setCursorState(prev => ({ ...prev, isVisible: false }))
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      // Check for hover elements
      if (target.classList.contains('cursor-hover') || target.dataset.cursor === 'hover') {
        setCursorState(prev => ({ ...prev, isHovering: true, cursorType: 'hover' }))
      }
      // Check for clickable elements
      else if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.classList.contains('cursor-pointer')) {
        setCursorState(prev => ({ ...prev, isHovering: true, cursorType: 'click' }))
      }
      // Check for text elements
      else if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
        setCursorState(prev => ({ ...prev, cursorType: 'text' }))
      }
      else {
        setCursorState(prev => ({ ...prev, isHovering: false, cursorType: 'default' }))
      }
    }

    const handleMouseDown = () => setCursorState(prev => ({ ...prev, cursorType: 'click' }))
    const handleMouseUp = () => setCursorState(prev => ({ ...prev, cursorType: prev.isHovering ? 'hover' : 'default' }))

    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  // Hide default cursor
  useEffect(() => {
    document.body.style.cursor = 'none'
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [])

  const getCursorSize = () => {
    switch (cursorState.cursorType) {
      case 'hover': return { width: 60, height: 60 }
      case 'click': return { width: 40, height: 40 }
      case 'text': return { width: 2, height: 24 }
      default: return { width: 20, height: 20 }
    }
  }

  const getCursorVariant = () => {
    return {
      default: {
        scale: 1,
        backgroundColor: 'rgba(57, 255, 20, 0.8)',
        border: '2px solid rgba(57, 255, 20, 0.4)',
        mixBlendMode: 'difference' as const,
      },
      hover: {
        scale: 1.5,
        backgroundColor: 'rgba(0, 127, 255, 0.6)',
        border: '2px solid rgba(0, 127, 255, 0.8)',
        mixBlendMode: 'difference' as const,
      },
      click: {
        scale: 0.8,
        backgroundColor: 'rgba(255, 20, 147, 0.9)',
        border: '2px solid rgba(255, 20, 147, 0.6)',
        mixBlendMode: 'difference' as const,
      },
      text: {
        scale: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        border: 'none',
        borderRadius: '2px',
        mixBlendMode: 'difference' as const,
      }
    }
  }

  if (!cursorState.isVisible) return null

  const size = getCursorSize()
  const variants = getCursorVariant()

  return (
    <>
      {/* Main cursor */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: `-${size.width / 2}px`,
          translateY: `-${size.height / 2}px`,
          width: size.width,
          height: size.height,
        }}
        animate={variants[cursorState.cursorType]}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 25,
          backgroundColor: { duration: 0.2 },
          border: { duration: 0.2 }
        }}
      >
        {/* Inner glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: cursorState.cursorType === 'hover' 
              ? '0 0 20px rgba(0, 127, 255, 0.6), 0 0 40px rgba(0, 127, 255, 0.3)'
              : cursorState.cursorType === 'click'
              ? '0 0 15px rgba(255, 20, 147, 0.8), 0 0 30px rgba(255, 20, 147, 0.4)'
              : '0 0 10px rgba(57, 255, 20, 0.6), 0 0 20px rgba(57, 255, 20, 0.2)'
          }}
          transition={{ duration: 0.2 }}
        />
        
        {/* Pulse effect for hover */}
        {cursorState.cursorType === 'hover' && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-electric-blue"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.8, 0, 0.8],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        )}
      </motion.div>

      {/* Trailing cursor */}
      <motion.div
        ref={trailRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full"
        style={{
          x: trailX,
          y: trailY,
          translateX: `-${size.width / 4}px`,
          translateY: `-${size.height / 4}px`,
          width: size.width / 2,
          height: size.height / 2,
          backgroundColor: 'rgba(57, 255, 20, 0.3)',
          border: '1px solid rgba(57, 255, 20, 0.2)',
        }}
        animate={{
          scale: cursorState.isHovering ? 1.2 : 1,
          opacity: cursorState.isHovering ? 0.6 : 0.4,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30
        }}
      />

      {/* Particle trail effect */}
      {cursorState.cursorType === 'hover' && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9997]"
          style={{
            x: cursorX,
            y: cursorY,
            translateX: '-50%',
            translateY: '-50%',
          }}
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-electric-blue rounded-full"
              animate={{
                x: [0, (Math.random() - 0.5) * 60],
                y: [0, (Math.random() - 0.5) * 60],
                opacity: [1, 0],
                scale: [1, 0],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.1,
                ease: 'easeOut'
              }}
            />
          ))}
        </motion.div>
      )}
    </>
  )
}

export default CustomCursor