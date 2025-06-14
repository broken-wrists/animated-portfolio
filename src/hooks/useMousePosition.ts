'use client'

import { useState, useEffect, useRef } from 'react'

interface MousePosition {
  x: number
  y: number
  velocityX: number
  velocityY: number
}

export const useMousePosition = (throttleMs = 16) => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    velocityX: 0,
    velocityY: 0
  })
  
  const lastPositionRef = useRef({ x: 0, y: 0 })
  const lastTimeRef = useRef(0)
  const pendingUpdateRef = useRef(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (pendingUpdateRef.current) return
      
      pendingUpdateRef.current = true
      
      setTimeout(() => {
        const now = performance.now()
        const deltaTime = now - lastTimeRef.current
        
        const newX = e.clientX
        const newY = e.clientY
        
        // Calculate velocity
        const velocityX = deltaTime > 0 ? (newX - lastPositionRef.current.x) / deltaTime * 1000 : 0
        const velocityY = deltaTime > 0 ? (newY - lastPositionRef.current.y) / deltaTime * 1000 : 0
        
        setMousePosition({
          x: newX,
          y: newY,
          velocityX: Math.abs(velocityX) > 5000 ? 0 : velocityX, // Cap extreme velocities
          velocityY: Math.abs(velocityY) > 5000 ? 0 : velocityY
        })
        
        lastPositionRef.current = { x: newX, y: newY }
        lastTimeRef.current = now
        pendingUpdateRef.current = false
      }, throttleMs)
    }

    const options: AddEventListenerOptions = { passive: true }
    window.addEventListener('mousemove', handleMouseMove, options)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [throttleMs])

  return mousePosition
}