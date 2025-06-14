'use client'

import { useState, useEffect } from 'react'

interface PerformanceConfig {
  isLowPerformance: boolean
  isMobile: boolean
  reducedMotion: boolean
  targetFPS: number
  animationScale: number
}

export const usePerformance = (): PerformanceConfig => {
  const [config, setConfig] = useState<PerformanceConfig>({
    isLowPerformance: false,
    isMobile: false,
    reducedMotion: false,
    targetFPS: 60,
    animationScale: 1
  })

  useEffect(() => {
    const detectPerformance = () => {
      const isMobile = window.innerWidth < 768 || 'ontouchstart' in window
      const hardwareConcurrency = (navigator as any).hardwareConcurrency || 4
      const deviceMemory = (navigator as any).deviceMemory || 4
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      
      // Detect low performance based on multiple factors
      const isLowPerformance = 
        isMobile ||
        hardwareConcurrency < 4 ||
        deviceMemory < 4 ||
        window.innerWidth < 1024 ||
        reducedMotion

      // Adjust settings based on performance level
      const targetFPS = isLowPerformance ? 30 : 60
      const animationScale = isLowPerformance ? 0.5 : 1

      setConfig({
        isLowPerformance,
        isMobile,
        reducedMotion,
        targetFPS,
        animationScale
      })
    }

    detectPerformance()
    window.addEventListener('resize', detectPerformance)
    
    return () => window.removeEventListener('resize', detectPerformance)
  }, [])

  return config
}