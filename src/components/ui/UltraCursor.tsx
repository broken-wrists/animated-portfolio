'use client'

import React, { useEffect, useRef } from 'react'

const UltraCursor: React.FC = () => {
  const mainCursorRef = useRef<HTMLDivElement>(null)
  const trailCursorRef = useRef<HTMLDivElement>(null)
  const textCursorRef = useRef<HTMLDivElement>(null)
  const cleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    // Check if mobile
    const isMobile = window.matchMedia('(max-width: 768px)').matches || 
                    window.matchMedia('(hover: none)').matches
    
    if (isMobile) return

    // Hide default cursor
    document.body.style.cursor = 'none'

    // Cursor state
    let mouseX = 0
    let mouseY = 0
    let cursorX = 0
    let cursorY = 0
    let trailX = 0
    let trailY = 0
    let isHovering = false
    let currentScale = 1
    let currentColor = '#39ff14'
    let hoverText = ''
    
    // Color palette
    const colors = [
      '#39ff14', '#00ff88', '#00ffcc', '#00ccff', '#007fff', '#0044ff',
      '#4400ff', '#8800ff', '#cc00ff', '#ff00cc', '#ff0088', '#ff0044',
      '#ff4400', '#ff8800', '#ffcc00', '#ccff00', '#88ff00', '#44ff00'
    ]
    let colorIndex = 0

    // Ultra-smooth mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    // Hover detection
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      if (target.tagName === 'A' || target.closest('a')) {
        isHovering = true
        currentScale = 1.5
        currentColor = '#007fff'
        hoverText = 'CLICK'
      } else if (target.tagName === 'BUTTON' || target.closest('button') || target.getAttribute('role') === 'button') {
        isHovering = true
        currentScale = 2
        currentColor = '#ff1493'
        hoverText = 'PRESS'
      } else if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
        isHovering = true
        currentScale = 1.2
        currentColor = '#4a0080'
        hoverText = 'TYPE'
      } else {
        isHovering = false
        currentScale = 1
        hoverText = ''
      }
    }

    const handleMouseOut = () => {
      isHovering = false
      currentScale = 1
      hoverText = ''
    }

    // Animation loop - pure RAF without React overhead
    let rafId: number
    let frameCount = 0
    
    const animate = () => {
      frameCount++
      
      // Ultra-smooth interpolation
      const mainLerp = 0.25
      const trailLerp = 0.08
      
      cursorX += (mouseX - cursorX) * mainLerp
      cursorY += (mouseY - cursorY) * mainLerp
      
      trailX += (mouseX - trailX) * trailLerp
      trailY += (mouseY - trailY) * trailLerp
      
      // Update main cursor
      if (mainCursorRef.current) {
        const mainCursor = mainCursorRef.current
        mainCursor.style.transform = `translate3d(${cursorX - 16}px, ${cursorY - 16}px, 0) scale(${currentScale})`
        mainCursor.style.backgroundColor = isHovering ? currentColor : colors[Math.floor(colorIndex)]
        mainCursor.style.boxShadow = `0 0 20px ${currentColor}40`
        
        // Update inner dot
        const innerDot = mainCursor.firstElementChild as HTMLElement
        if (innerDot) {
          innerDot.style.opacity = isHovering ? '0' : '1'
          innerDot.style.transform = `translate(-50%, -50%) scale(${isHovering ? 0 : 1})`
        }
      }
      
      // Update trail cursor
      if (trailCursorRef.current) {
        trailCursorRef.current.style.transform = `translate3d(${trailX - 8}px, ${trailY - 8}px, 0)`
        trailCursorRef.current.style.backgroundColor = currentColor
        trailCursorRef.current.style.boxShadow = `0 0 15px ${currentColor}60`
      }
      
      // Update text cursor
      if (textCursorRef.current) {
        if (hoverText && isHovering) {
          textCursorRef.current.style.display = 'block'
          textCursorRef.current.style.transform = `translate3d(${cursorX + 30}px, ${cursorY - 10}px, 0)`
          textCursorRef.current.textContent = hoverText
        } else {
          textCursorRef.current.style.display = 'none'
        }
      }
      
      // Color cycling every 9 frames (~150ms at 60fps)
      if (frameCount % 9 === 0 && !isHovering) {
        colorIndex = (colorIndex + 0.1) % colors.length
      }
      
      rafId = requestAnimationFrame(animate)
    }

    // Start animation
    rafId = requestAnimationFrame(animate)

    // Add event listeners with passive option
    const options: AddEventListenerOptions = { passive: true }
    document.addEventListener('mousemove', handleMouseMove, options)
    document.addEventListener('mouseover', handleMouseOver, options)
    document.addEventListener('mouseout', handleMouseOut, options)

    // Cleanup function
    cleanupRef.current = () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
      document.body.style.cursor = 'auto'
    }

    // Initial visibility
    if (mainCursorRef.current) mainCursorRef.current.style.opacity = '1'
    if (trailCursorRef.current) trailCursorRef.current.style.opacity = '1'

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current()
      }
    }
  }, [])

  // Early return for mobile
  if (typeof window !== 'undefined') {
    const isMobile = window.matchMedia('(max-width: 768px)').matches || 
                    window.matchMedia('(hover: none)').matches
    if (isMobile) return null
  }

  return (
    <>
      {/* Main Cursor - Pure CSS transforms */}
      <div
        ref={mainCursorRef}
        className="fixed pointer-events-none z-[9999] rounded-full"
        style={{
          width: 32,
          height: 32,
          backgroundColor: '#39ff14',
          mixBlendMode: 'difference',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          transition: 'background-color 0.1s ease',
          opacity: 0,
        }}
      >
        {/* Inner dot */}
        <div
          className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full"
          style={{
            transform: 'translate(-50%, -50%)',
            transition: 'opacity 0.15s ease, transform 0.15s ease',
            willChange: 'transform',
          }}
        />
      </div>

      {/* Trail Cursor */}
      <div
        ref={trailCursorRef}
        className="fixed pointer-events-none z-[9998] rounded-full"
        style={{
          width: 16,
          height: 16,
          backgroundColor: '#39ff14',
          opacity: 0.3,
          willChange: 'transform',
          backfaceVisibility: 'hidden',
        }}
      />

      {/* Text Cursor */}
      <div
        ref={textCursorRef}
        className="fixed pointer-events-none z-[9996] text-white text-xs font-bold uppercase tracking-wider"
        style={{
          display: 'none',
          willChange: 'transform',
        }}
      >
        <div className="px-3 py-1 bg-black/80 rounded-full border border-white/20 backdrop-blur-sm">
        </div>
      </div>
    </>
  )
}

export default UltraCursor