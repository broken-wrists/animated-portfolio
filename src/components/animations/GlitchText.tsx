'use client'

import React, { useEffect, useState } from 'react'
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

  const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?'
  
  const intensitySettings = {
    low: { frequency: 3000, duration: 100, charCount: 1 },
    medium: { frequency: 2000, duration: 150, charCount: 2 },
    high: { frequency: 1000, duration: 200, charCount: 3 }
  }

  const settings = intensitySettings[intensity]

  useEffect(() => {
    const glitch = () => {
      setIsGlitching(true)
      const textArray = text.split('')
      const glitchedArray = [...textArray]

      // Replace random characters with glitch chars
      for (let i = 0; i < settings.charCount; i++) {
        const randomIndex = Math.floor(Math.random() * textArray.length)
        const randomGlitchChar = glitchChars[Math.floor(Math.random() * glitchChars.length)]
        glitchedArray[randomIndex] = randomGlitchChar
      }

      setGlitchedText(glitchedArray.join(''))

      setTimeout(() => {
        setGlitchedText(text)
        setIsGlitching(false)
      }, settings.duration)
    }

    const interval = setInterval(glitch, settings.frequency)
    return () => clearInterval(interval)
  }, [text, settings])

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