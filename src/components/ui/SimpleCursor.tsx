'use client'

import React, { useEffect, useRef } from 'react'

const SimpleCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log('SimpleCursor: Component mounted')
    
    // Don't initialize on mobile
    const isMobile = window.innerWidth < 768 || 'ontouchstart' in window
    if (isMobile) {
      console.log('SimpleCursor: Mobile detected, exiting')
      return
    }

    console.log('SimpleCursor: Desktop detected, initializing')

    // Hide default cursor
    document.body.style.cursor = 'none'
    
    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2

    // Simple mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    // Simple animation loop
    const animate = () => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${mouseX - 10}px`
        cursorRef.current.style.top = `${mouseY - 10}px`
        cursorRef.current.style.opacity = '1'
        cursorRef.current.style.visibility = 'visible'
      }
      requestAnimationFrame(animate)
    }

    // Start tracking
    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    animate()

    console.log('SimpleCursor: Animation started')

    return () => {
      console.log('SimpleCursor: Cleanup')
      document.removeEventListener('mousemove', handleMouseMove)
      document.body.style.cursor = 'auto'
    }
  }, [])

  // Don't render on mobile
  if (typeof window !== 'undefined' && (window.innerWidth < 768 || 'ontouchstart' in window)) {
    return null
  }

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        width: '20px',
        height: '20px',
        backgroundColor: '#39ff14',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 999999,
        opacity: 0,
        visibility: 'hidden',
        mixBlendMode: 'difference',
        transition: 'none',
        willChange: 'transform',
      }}
    />
  )
}

export default SimpleCursor