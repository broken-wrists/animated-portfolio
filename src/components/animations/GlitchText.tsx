'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface GlitchTextProps {
  text: string
  className?: string
  intensity?: 'low' | 'medium' | 'high' | 'extreme'
  enableTypewriter?: boolean
  enableWaveEffect?: boolean
  enableColorShift?: boolean
}

const GlitchText: React.FC<GlitchTextProps> = ({ 
  text, 
  className = '', 
  intensity = 'medium',
  enableTypewriter = false,
  enableWaveEffect = false,
  enableColorShift = false
}) => {
  const [glitchedText, setGlitchedText] = useState(text)
  const [displayedText, setDisplayedText] = useState('')
  const [isGlitching, setIsGlitching] = useState(false)
  const [typewriterComplete, setTypewriterComplete] = useState(!enableTypewriter)
  const [currentColorIndex, setCurrentColorIndex] = useState(0)
  
  const timeoutRef = useRef<NodeJS.Timeout>()
  const intervalRef = useRef<NodeJS.Timeout>()
  const typewriterRef = useRef<NodeJS.Timeout>()
  const colorShiftRef = useRef<NodeJS.Timeout>()

  const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`'
  const colors = [
    '#ff0080', '#00ff80', '#0080ff', '#ff8000', 
    '#8000ff', '#ff4080', '#40ff80', '#8040ff'
  ]
  
  const intensitySettings = {
    low: { frequency: 6000, duration: 60, charCount: 1, glitchProbability: 0.3 },
    medium: { frequency: 4000, duration: 80, charCount: 2, glitchProbability: 0.5 },
    high: { frequency: 2500, duration: 120, charCount: 3, glitchProbability: 0.7 },
    extreme: { frequency: 1500, duration: 200, charCount: 4, glitchProbability: 0.9 }
  }

  const settings = intensitySettings[intensity]

  // Typewriter effect
  useEffect(() => {
    if (!enableTypewriter) return
    
    let currentIndex = 0
    const typewriterInterval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayedText(text.slice(0, currentIndex))
        currentIndex++
      } else {
        setTypewriterComplete(true)
        clearInterval(typewriterInterval)
      }
    }, 150)

    return () => clearInterval(typewriterInterval)
  }, [text, enableTypewriter])

  // Color shifting effect
  useEffect(() => {
    if (!enableColorShift) return
    
    colorShiftRef.current = setInterval(() => {
      setCurrentColorIndex((prev) => (prev + 1) % colors.length)
    }, 2000)

    return () => {
      if (colorShiftRef.current) clearInterval(colorShiftRef.current)
    }
  }, [enableColorShift])

  const glitch = useCallback(() => {
    if (isGlitching || !typewriterComplete) return
    
    setIsGlitching(true)
    const currentText = enableTypewriter ? displayedText : text
    const glitchedArray = currentText.split('')

    // Multi-character glitch based on intensity
    for (let i = 0; i < settings.charCount; i++) {
      if (Math.random() < settings.glitchProbability) {
        const randomIndex = Math.floor(Math.random() * currentText.length)
        const randomGlitchChar = glitchChars[Math.floor(Math.random() * glitchChars.length)]
        glitchedArray[randomIndex] = randomGlitchChar
      }
    }

    setGlitchedText(glitchedArray.join(''))

    timeoutRef.current = setTimeout(() => {
      setGlitchedText(enableTypewriter ? displayedText : text)
      setIsGlitching(false)
    }, settings.duration)
  }, [text, displayedText, settings.duration, settings.charCount, settings.glitchProbability, isGlitching, typewriterComplete, enableTypewriter])

  useEffect(() => {
    if (!typewriterComplete) return
    
    intervalRef.current = setInterval(glitch, settings.frequency)
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [glitch, settings.frequency, typewriterComplete])

  const getTextShadow = () => {
    if (!isGlitching) return 'none'
    
    const shadows = [
      '2px 0 #ff00ff',
      '-2px 0 #00ffff',
      '0 2px #ffff00',
      '0 -2px #ff0080'
    ]
    
    return intensity === 'extreme' ? shadows.join(', ') : shadows.slice(0, 2).join(', ')
  }

  const textContent = enableTypewriter ? (isGlitching ? glitchedText : displayedText) : (isGlitching ? glitchedText : text)

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={textContent}
        className={`${className} ${isGlitching ? 'animate-pulse' : ''} relative inline-block`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          color: enableColorShift ? colors[currentColorIndex] : 'inherit'
        }}
        transition={{ 
          duration: 0.3,
          color: { duration: 1.5, ease: 'easeInOut' }
        }}
        style={{
          textShadow: getTextShadow(),
          filter: isGlitching && intensity === 'extreme' ? 'hue-rotate(90deg)' : 'none',
        }}
        whileHover={enableWaveEffect ? {
          textShadow: [
            '0 0 8px #ff0080',
            '0 0 16px #00ff80',
            '0 0 24px #0080ff',
            '0 0 16px #ff8000',
            '0 0 8px #ff0080'
          ],
          transition: { duration: 2, repeat: Infinity }
        } : {}}
      >
        {enableWaveEffect ? (
          textContent.split('').map((char, index) => (
            <motion.span
              key={index}
              className="inline-block"
              animate={{
                y: [0, -8, 0],
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.1,
                  ease: 'easeInOut'
                }
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))
        ) : (
          textContent
        )}
        
        {/* Extra glitch layers for extreme intensity */}
        {isGlitching && intensity === 'extreme' && (
          <>
            <motion.span
              className="absolute inset-0 opacity-30"
              animate={{
                x: [-2, 2, -1, 1, 0],
                y: [1, -1, 2, -2, 0],
                transition: { duration: 0.1, repeat: 2 }
              }}
              style={{
                color: '#ff00ff',
                mixBlendMode: 'screen'
              }}
            >
              {textContent}
            </motion.span>
            <motion.span
              className="absolute inset-0 opacity-30"
              animate={{
                x: [1, -1, 2, -2, 0],
                y: [-2, 2, -1, 1, 0],
                transition: { duration: 0.1, repeat: 2, delay: 0.05 }
              }}
              style={{
                color: '#00ffff',
                mixBlendMode: 'screen'
              }}
            >
              {textContent}
            </motion.span>
          </>
        )}
      </motion.span>
    </AnimatePresence>
  )
}

export default GlitchText