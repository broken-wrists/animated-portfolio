'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useOptimizedMouse } from '@/hooks/useOptimizedMouse'

interface CursorState {
  isVisible: boolean
  isHovering: boolean
}

const CustomCursor: React.FC = () => {
  const [cursorState, setCursorState] = useState<CursorState>({
    isVisible: false,
    isHovering: false
  })
  
  const mousePosition = useOptimizedMouse(8) // 120fps optimized
  const cursorRef = useRef<HTMLDivElement>(null)

  // Handle cursor visibility and interaction states
  useEffect(() => {
    const handleMouseEnter = () => setCursorState(prev => ({ ...prev, isVisible: true }))
    const handleMouseLeave = () => setCursorState(prev => ({ ...prev, isVisible: false }))
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      // Check for hover elements
      if (target.classList.contains('cursor-hover') || 
          target.dataset.cursor === 'hover' ||
          target.tagName === 'BUTTON' || 
          target.tagName === 'A' || 
          target.classList.contains('cursor-pointer')) {
        setCursorState(prev => ({ ...prev, isHovering: true }))
      } else {
        setCursorState(prev => ({ ...prev, isHovering: false }))
      }
    }

    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseover', handleMouseOver)

    return () => {
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseover', handleMouseOver)
    }
  }, [])

  // Hide default cursor
  useEffect(() => {
    document.body.style.cursor = 'none'
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [])

  // Update cursor position and styles with direct DOM manipulation for 120fps
  useEffect(() => {
    if (!cursorRef.current) return

    const cursor = cursorRef.current
    const size = cursorState.isHovering ? 48 : 20
    const color = cursorState.isHovering ? '#007fff' : '#39ff14'
    const opacity = cursorState.isHovering ? '0.8' : '0.6'

    // Direct style updates - no React re-renders
    cursor.style.transform = `translate3d(${mousePosition.x - size/2}px, ${mousePosition.y - size/2}px, 0)`
    cursor.style.width = `${size}px`
    cursor.style.height = `${size}px`
    cursor.style.backgroundColor = color
    cursor.style.opacity = opacity
    cursor.style.boxShadow = cursorState.isHovering 
      ? `0 0 20px ${color}40, 0 0 40px ${color}20`
      : `0 0 10px ${color}40`

  }, [mousePosition.x, mousePosition.y, cursorState.isHovering])

  if (!cursorState.isVisible) return null

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full transition-all duration-200 ease-out"
      style={{
        mixBlendMode: 'difference',
        willChange: 'transform, width, height, background-color, opacity, box-shadow',
        backfaceVisibility: 'hidden',
        transform: 'translate3d(0, 0, 0)' // Hardware acceleration
      }}
    />
  )
}

export default CustomCursor