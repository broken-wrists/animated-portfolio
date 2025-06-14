'use client'

import { useState, useEffect, useRef } from 'react'

export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const rafRef = useRef<number>()

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      
      rafRef.current = requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY })
      })
    }

    const options: AddEventListenerOptions = { passive: true }
    window.addEventListener('mousemove', handleMouseMove, options)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  return mousePosition
}