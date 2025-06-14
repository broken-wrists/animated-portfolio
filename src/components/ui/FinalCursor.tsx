'use client'

import React, { useEffect, useRef } from 'react'

const FinalCursor: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const rafRef = useRef<number>()

  useEffect(() => {
    console.log('FinalCursor: Component mounted')
    
    // Don't initialize on mobile
    const isMobile = window.innerWidth < 768 || 'ontouchstart' in window
    if (isMobile) {
      console.log('FinalCursor: Mobile detected, exiting')
      return
    }

    console.log('FinalCursor: Creating bulletproof cursor system')

    // Create cursor container at body level - absolutely cannot be clipped
    const cursorContainer = document.createElement('div')
    cursorContainer.id = 'final-cursor-container'
    cursorContainer.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      pointer-events: none !important;
      z-index: 2147483647 !important;
      overflow: visible !important;
      transform: none !important;
    `
    
    // Add to body
    document.body.appendChild(cursorContainer)
    containerRef.current = cursorContainer

    // Create main cursor element
    const mainCursor = document.createElement('div')
    mainCursor.style.cssText = `
      position: absolute !important;
      width: 20px !important;
      height: 20px !important;
      background-color: #39ff14 !important;
      border-radius: 50% !important;
      pointer-events: none !important;
      mix-blend-mode: difference !important;
      transform: translate(-50%, -50%) !important;
      opacity: 1 !important;
      visibility: visible !important;
      transition: background-color 0.1s ease !important;
      will-change: transform !important;
      z-index: inherit !important;
    `
    
    // Create trail cursor
    const trailCursor = document.createElement('div')
    trailCursor.style.cssText = `
      position: absolute !important;
      width: 12px !important;
      height: 12px !important;
      background-color: #39ff14 !important;
      border-radius: 50% !important;
      pointer-events: none !important;
      opacity: 0.4 !important;
      visibility: visible !important;
      transform: translate(-50%, -50%) !important;
      will-change: transform !important;
      z-index: inherit !important;
    `
    
    cursorContainer.appendChild(mainCursor)
    cursorContainer.appendChild(trailCursor)

    // Hide default cursor everywhere
    document.body.style.cursor = 'none'
    document.documentElement.style.cursor = 'none'
    
    // Cursor state
    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let cursorX = mouseX
    let cursorY = mouseY
    let trailX = mouseX
    let trailY = mouseY
    let isHovering = false
    
    // Color cycling
    const colors = ['#39ff14', '#00ff88', '#00ffcc', '#007fff', '#ff1493', '#8000ff']
    let colorIndex = 0

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    // Hover detection for interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('button') || target.closest('a')) {
        isHovering = true
        mainCursor.style.backgroundColor = '#007fff'
        mainCursor.style.transform = 'translate(-50%, -50%) scale(1.5)'
      } else {
        isHovering = false
        mainCursor.style.transform = 'translate(-50%, -50%) scale(1)'
      }
    }

    // Animation loop with smooth interpolation
    let frameCount = 0
    const animate = () => {
      frameCount++
      
      // Smooth cursor following
      const mainLerp = 0.2
      const trailLerp = 0.1
      
      cursorX += (mouseX - cursorX) * mainLerp
      cursorY += (mouseY - cursorY) * mainLerp
      
      trailX += (mouseX - trailX) * trailLerp
      trailY += (mouseY - trailY) * trailLerp
      
      // Update positions
      if (mainCursor) {
        mainCursor.style.left = `${cursorX}px`
        mainCursor.style.top = `${cursorY}px`
      }
      
      if (trailCursor) {
        trailCursor.style.left = `${trailX}px`
        trailCursor.style.top = `${trailY}px`
      }
      
      // Color cycling every 30 frames
      if (frameCount % 30 === 0 && !isHovering) {
        const newColor = colors[Math.floor(colorIndex)]
        mainCursor.style.backgroundColor = newColor
        trailCursor.style.backgroundColor = newColor
        colorIndex = (colorIndex + 0.1) % colors.length
      }
      
      rafRef.current = requestAnimationFrame(animate)
    }

    // Start everything
    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseover', handleMouseOver, { passive: true })
    rafRef.current = requestAnimationFrame(animate)

    console.log('FinalCursor: Animation started - cursor should be visible on ALL pages')

    return () => {
      console.log('FinalCursor: Cleanup')
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleMouseOver)
      document.body.style.cursor = 'auto'
      document.documentElement.style.cursor = 'auto'
      
      // Remove cursor container
      if (containerRef.current && document.body.contains(containerRef.current)) {
        document.body.removeChild(containerRef.current)
      }
    }
  }, [])

  // Return null - we manage DOM directly
  return null
}

export default FinalCursor