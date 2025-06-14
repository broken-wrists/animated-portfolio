'use client'

import { useState, useEffect, useRef } from 'react'

interface OptimizedMousePosition {
  x: number
  y: number
}

export const useOptimizedMouse = (throttleMs = 4) => {
  const [mousePosition, setMousePosition] = useState<OptimizedMousePosition>({ x: 0, y: 0 })
  const lastUpdateRef = useRef(0)
  const positionRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now()
      
      // Update internal ref immediately for other components
      positionRef.current = { x: e.clientX, y: e.clientY }
      
      // Throttle state updates
      if (now - lastUpdateRef.current >= throttleMs) {
        setMousePosition({ x: e.clientX, y: e.clientY })
        lastUpdateRef.current = now
      }
    }

    // Use passive listener for maximum performance
    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [throttleMs])

  return mousePosition
}

// Ultra-lightweight hook that just returns refs (no re-renders)
export const useMouseRef = () => {
  const positionRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      positionRef.current = { x: e.clientX, y: e.clientY }
    }

    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return positionRef
}