'use client'

import React, { useEffect, useState } from 'react'
import Navigation from '@/components/ui/Navigation'
import FluidAbstractHero from '@/components/sections/FluidAbstractHero'
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import ProjectsSection from '@/components/sections/ProjectsSection'
import SkillsSection from '@/components/sections/SkillsSection'
import ContactSection from '@/components/sections/ContactSection'
import Footer from '@/components/ui/Footer'
import LoadingScreen from '@/components/ui/LoadingScreen'
import FinalCursor from '@/components/ui/FinalCursor'

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)


  // Smooth scroll behavior for hash links
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash) {
        const element = document.querySelector(hash)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    
    // Handle initial hash on page load
    if (window.location.hash) {
      setTimeout(handleHashChange, 100)
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  // Performance optimization for reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.style.setProperty('--animation-duration', '0.01ms')
      } else {
        document.documentElement.style.removeProperty('--animation-duration')
      }
    }

    // Set initial state
    if (mediaQuery.matches) {
      document.documentElement.style.setProperty('--animation-duration', '0.01ms')
    }

    mediaQuery.addEventListener('change', handleChange)
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  // Progressive enhancement for mobile and performance
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    const isLowPerformance = window.matchMedia('(max-width: 768px) and (hover: none)').matches
    const hardwareConcurrency = (navigator as any).hardwareConcurrency || 4
    const deviceMemory = (navigator as any).deviceMemory || 4

    if (isMobile || isLowPerformance || hardwareConcurrency < 4 || deviceMemory < 4) {
      // Optimize for low performance devices
      document.documentElement.style.setProperty('--mobile-optimized', 'true')
      document.documentElement.style.setProperty('--animation-duration', '0.3s')
      document.documentElement.style.setProperty('--particle-count', '5')
    } else {
      document.documentElement.style.setProperty('--animation-duration', '0.6s')
      document.documentElement.style.setProperty('--particle-count', '12')
    }
  }, [])

  // Scroll progress tracking - throttled for performance
  useEffect(() => {
    let rafId: number
    let ticking = false
    
    const updateScrollProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / scrollHeight) * 100
      setScrollProgress(Math.min(progress, 100))
      ticking = false
    }

    const requestTick = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(updateScrollProgress)
        ticking = true
      }
    }

    const options: AddEventListenerOptions = { passive: true }
    window.addEventListener('scroll', requestTick, options)
    
    return () => {
      window.removeEventListener('scroll', requestTick)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      {/* Loading Screen */}
      <LoadingScreen onComplete={() => setIsLoading(false)} />

      {/* Main Content */}
      {!isLoading && (
        <main className="relative">
          {/* Navigation */}
          <Navigation />

          {/* Page Sections */}
          <FluidAbstractHero />
          <HeroSection />
          <AboutSection />
          <ProjectsSection />
          <SkillsSection />
          <ContactSection />

          {/* Footer */}
          <Footer />

          {/* Scroll Progress Indicator */}
          <div 
            className="fixed top-0 left-0 h-1 bg-gradient-to-r from-neon-green via-electric-blue to-cyber-pink z-50 transition-all duration-300 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </main>
      )}

      {/* Final Cursor - Bulletproof implementation that renders to document.body */}
      {!isLoading && <FinalCursor />}
      
      {/* Debug: Add visual indicator */}
      {!isLoading && (
        <div 
          className="fixed top-4 right-4 z-[999990] bg-green-500 text-black p-2 text-xs rounded opacity-50 pointer-events-none"
          style={{ display: 'block' }} // Enable for debugging
        >
          FinalCursor Active - Should work on ALL pages
        </div>
      )}
    </>
  )
}