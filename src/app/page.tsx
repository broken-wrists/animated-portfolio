'use client'

import React, { useEffect, useState } from 'react'
import Navigation from '@/components/ui/Navigation'
import MercuryHero from '@/components/sections/MercuryHero'
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import ProjectsSection from '@/components/sections/ProjectsSection'
import SkillsSection from '@/components/sections/SkillsSection'
import ContactSection from '@/components/sections/ContactSection'
import Footer from '@/components/ui/Footer'
import LoadingScreen from '@/components/ui/LoadingScreen'
import CustomCursor from '@/components/ui/CustomCursor'

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

  // Progressive enhancement for mobile
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    const isLowPerformance = window.matchMedia('(max-width: 768px) and (hover: none)').matches

    if (isMobile || isLowPerformance) {
      // Reduce particle count and animation complexity on mobile
      document.documentElement.style.setProperty('--mobile-optimized', 'true')
    }
  }, [])

  // Scroll progress tracking
  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / scrollHeight) * 100
      setScrollProgress(Math.min(progress, 100))
    }

    window.addEventListener('scroll', updateScrollProgress)
    return () => window.removeEventListener('scroll', updateScrollProgress)
  }, [])

  return (
    <>
      {/* Loading Screen */}
      <LoadingScreen onComplete={() => setIsLoading(false)} />

      {/* Custom Cursor */}
      {!isLoading && <CustomCursor />}

      {/* Main Content */}
      {!isLoading && (
        <main className="relative">
          {/* Navigation */}
          <Navigation />

          {/* Page Sections */}
          <MercuryHero />
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
    </>
  )
}