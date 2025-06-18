'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

interface GlitchTextProps {
  text: string
  className?: string
  intensity?: 'low' | 'medium' | 'high'
}

const GlitchText: React.FC<GlitchTextProps> = ({ 
  text, 
  className = '', 
  intensity = 'medium' 
}) => {
  const [glitchedText, setGlitchedText] = useState(text)
  const [isGlitching, setIsGlitching] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const intervalRef = useRef<NodeJS.Timeout>()

  const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?'
  
  const intensitySettings = {
    low: { frequency: 8000, duration: 40, charCount: 1 },
    medium: { frequency: 6000, duration: 60, charCount: 1 },
    high: { frequency: 4000, duration: 80, charCount: 2 }
  }

  const settings = intensitySettings[intensity]

  const glitch = useCallback(() => {
    if (isGlitching) return // Prevent overlapping glitches
    
    setIsGlitching(true)
    const glitchedArray = text.split('')

    // Only glitch one character for performance
    const randomIndex = Math.floor(Math.random() * text.length)
    const randomGlitchChar = glitchChars[Math.floor(Math.random() * glitchChars.length)]
    glitchedArray[randomIndex] = randomGlitchChar

    setGlitchedText(glitchedArray.join(''))

    timeoutRef.current = setTimeout(() => {
      setGlitchedText(text)
      setIsGlitching(false)
    }, settings.duration)
  }, [text, settings.duration, isGlitching])

  useEffect(() => {
    intervalRef.current = setInterval(glitch, settings.frequency)
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [glitch, settings.frequency])

  return (
    <motion.span
      className={`${className} ${isGlitching ? 'animate-glitch' : ''}`}
      style={{
        textShadow: isGlitching 
          ? '2px 0 #ff00ff, -2px 0 #00ffff' 
          : 'none',
      }}
    >
      {glitchedText}
    </motion.span>
  )
}

export default GlitchText