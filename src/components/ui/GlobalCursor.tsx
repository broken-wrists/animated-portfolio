'use client'

import React, { useEffect, useRef } from 'react'

const GlobalCursor: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const rafRef = useRef<number>()

  useEffect(() => {
    console.log('GlobalCursor: Component mounted')
    
    // Don't initialize on mobile
    const isMobile = window.innerWidth < 768 || 'ontouchstart' in window
    if (isMobile) {
      console.log('GlobalCursor: Mobile detected, exiting')
      return
    }

    console.log('GlobalCursor: Creating cursor container')

    // Create cursor container at body level to avoid any clipping
    const cursorContainer = document.createElement('div')
    cursorContainer.id = 'global-cursor-container'
    cursorContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 999999;
      overflow: visible !important;
    `
    
    // Add to body, not to any React container that might have overflow issues
    document.body.appendChild(cursorContainer)
    containerRef.current = cursorContainer

    // Create cursor element
    const cursor = document.createElement('div')
    cursor.style.cssText = `
      position: absolute;
      width: 20px;
      height: 20px;
      background-color: #39ff14;
      border-radius: 50%;
      pointer-events: none;
      mix-blend-mode: difference;
      transform: translate(-50%, -50%);
      opacity: 1;
      transition: background-color 0.1s ease;
      will-change: transform;
    `
    
    cursorContainer.appendChild(cursor)

    // Hide default cursor
    document.body.style.cursor = 'none'
    document.documentElement.style.cursor = 'none'
    
    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2

    // Simple mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    // Simple animation loop
    const animate = () => {
      if (cursor) {
        cursor.style.left = `${mouseX}px`
        cursor.style.top = `${mouseY}px`
      }
      rafRef.current = requestAnimationFrame(animate)
    }

    // Start tracking
    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    rafRef.current = requestAnimationFrame(animate)

    console.log('GlobalCursor: Animation started, cursor should be visible everywhere')

    return () => {
      console.log('GlobalCursor: Cleanup')
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      document.removeEventListener('mousemove', handleMouseMove)
      document.body.style.cursor = 'auto'
      document.documentElement.style.cursor = 'auto'
      
      // Remove cursor container from body
      if (containerRef.current && document.body.contains(containerRef.current)) {
        document.body.removeChild(containerRef.current)
      }
    }
  }, [])

  // Don't render anything in React - we're creating DOM elements directly
  return null
}

export default GlobalCursor