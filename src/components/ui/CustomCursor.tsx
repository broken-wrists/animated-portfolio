'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMousePosition } from '@/hooks/useMousePosition'
import { useAnimationManager } from '@/hooks/useAnimationManager'

interface CursorState {
  isHovering: boolean
  cursorType: 'default' | 'link' | 'button' | 'text' | 'image'
  color: string
  scale: number
  text?: string
}

const CustomCursor: React.FC = () => {
  const mousePosition = useMousePosition(8) // Ultra-smooth tracking
  const { subscribe } = useAnimationManager()
  const [cursorState, setCursorState] = useState<CursorState>({
    isHovering: false,
    cursorType: 'default',
    color: '#39ff14',
    scale: 1,
  })
  const [dynamicColor, setDynamicColor] = useState('#39ff14')
  const [isVisible, setIsVisible] = useState(false)
  const lastUpdateRef = useRef(0)
  const cursorPositionRef = useRef({ x: 0, y: 0 })
  const trailPositionRef = useRef({ x: 0, y: 0 })
  const [, setRenderTrigger] = useState(0)

  useEffect(() => {
    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    const handleElementHover = (e: MouseEvent) => {
      const now = Date.now()
      if (now - lastUpdateRef.current < 32) return // Throttle to ~30fps for hover detection
      lastUpdateRef.current = now
      
      const target = e.target as HTMLElement
      
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

    const options: AddEventListenerOptions = { passive: true }
    document.addEventListener('mouseenter', handleMouseEnter, options)
    document.addEventListener('mouseleave', handleMouseLeave, options)
    document.addEventListener('mouseover', handleElementHover, options)
    document.addEventListener('mouseout', handleElementLeave, options)

    document.body.style.cursor = 'none'
    
    return () => {
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseover', handleElementHover)
      document.removeEventListener('mouseout', handleElementLeave)
      document.body.style.cursor = 'auto'
    }
  }, [dynamicColor])

  // Optimized animation loop with centralized management
  useEffect(() => {
    const colorPalette = [
      '#39ff14', '#00ff88', '#00ffcc', '#00ccff', '#007fff', '#0044ff',
      '#4400ff', '#8800ff', '#cc00ff', '#ff00cc', '#ff0088', '#ff0044',
      '#ff4400', '#ff8800', '#ffcc00', '#ccff00', '#88ff00', '#44ff00'
    ]
    
    let colorIndex = 0
    let frameCount = 0
    
    const unsubscribe = subscribe(
      () => {
        frameCount++
        
        // Ultra-smooth cursor following with different easing
        const mainLerp = 0.25
        const trailLerp = 0.1
        
        cursorPositionRef.current = {
          x: cursorPositionRef.current.x + (mousePosition.x - cursorPositionRef.current.x) * mainLerp,
          y: cursorPositionRef.current.y + (mousePosition.y - cursorPositionRef.current.y) * mainLerp
        }
        
        trailPositionRef.current = {
          x: trailPositionRef.current.x + (mousePosition.x - trailPositionRef.current.x) * trailLerp,
          y: trailPositionRef.current.y + (mousePosition.y - trailPositionRef.current.y) * trailLerp
        }
        
        // Color cycling every 9 frames
        if (frameCount % 9 === 0 && !cursorState.isHovering) {
          setDynamicColor(colorPalette[colorIndex])
          colorIndex = (colorIndex + 1) % colorPalette.length
        }
        
        // Force re-render for smooth visual updates
        setRenderTrigger(prev => prev + 1)
      },
      3, // Highest priority
      120 // Target 120 FPS for ultra-smooth cursor
    )
    
    return unsubscribe
  }, [subscribe, cursorState.isHovering, mousePosition.x, mousePosition.y])

  // Velocity-based color changes
  const updateColorFromVelocity = useCallback(() => {
    const velocity = Math.sqrt(mousePosition.velocityX ** 2 + mousePosition.velocityY ** 2)
    
    if (velocity > 200 && !cursorState.isHovering) {
      const colors = ['#39ff14', '#007fff', '#ff1493', '#4a0080', '#00ffcc', '#ff8800']
      const randomColor = colors[Math.floor(Math.random() * colors.length)]
      setDynamicColor(randomColor)
    }
  }, [mousePosition.velocityX, mousePosition.velocityY, cursorState.isHovering])
  
  useEffect(() => {
    updateColorFromVelocity()
  }, [updateColorFromVelocity])

  // Hide cursor on mobile
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches || 
                    window.matchMedia('(hover: none)').matches
    
    if (isMobile) {
      setIsVisible(false)
    }
  }, [])

  const currentColor = cursorState.isHovering ? cursorState.color : dynamicColor

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Main Cursor - Now using native div for better performance */}
          <div
            className="fixed pointer-events-none z-[9999] rounded-full"
            style={{
              left: cursorPositionRef.current.x - 16,
              top: cursorPositionRef.current.y - 16,
              width: 32,
              height: 32,
              backgroundColor: currentColor,
              mixBlendMode: 'difference',
              boxShadow: `0 0 20px ${currentColor}40`,
              transform: `scale(${cursorState.scale})`,
              willChange: 'transform',
              transition: 'transform 0.15s ease, background-color 0.1s ease',
              backfaceVisibility: 'hidden',
            }}
          >
            {/* Inner dot */}
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"
              style={{
                opacity: cursorState.isHovering ? 0 : 1,
                transform: `scale(${cursorState.isHovering ? 0 : 1})`,
                transition: 'opacity 0.15s ease, transform 0.15s ease'
              }}
            />
          </div>

          {/* Cursor Trail - Optimized */}
          <div
            className="fixed pointer-events-none z-[9998] rounded-full opacity-30"
            style={{
              left: trailPositionRef.current.x - 8,
              top: trailPositionRef.current.y - 8,
              width: 16,
              height: 16,
              backgroundColor: currentColor,
              boxShadow: `0 0 15px ${currentColor}60`,
              willChange: 'transform',
              backfaceVisibility: 'hidden',
            }}
          />

          {/* Secondary trail */}
          <div
            className="fixed pointer-events-none z-[9997] rounded-full opacity-15"
            style={{
              left: trailPositionRef.current.x - 6,
              top: trailPositionRef.current.y - 6,
              width: 12,
              height: 12,
              backgroundColor: cursorState.isHovering ? cursorState.color : '#ffffff',
              willChange: 'transform',
              backfaceVisibility: 'hidden',
            }}
          />

          {/* Cursor Text */}
          <AnimatePresence>
            {cursorState.text && cursorState.isHovering && (
              <motion.div
                className="fixed pointer-events-none z-[9996] text-white text-xs font-bold uppercase tracking-wider"
                style={{
                  left: cursorPositionRef.current.x + 30,
                  top: cursorPositionRef.current.y - 10,
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
        </>
      )}
    </AnimatePresence>
  )
}

export default CustomCursor