'use client'

import React, { useEffect, useState } from 'react'
import Navigation from '@/components/ui/Navigation'
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import ProjectsSection from '@/components/sections/ProjectsSection'
import SkillsSection from '@/components/sections/SkillsSection'
import ContactSection from '@/components/sections/ContactSection'
import Footer from '@/components/ui/Footer'
import LoadingScreen from '@/components/ui/LoadingScreen'
import { useMousePosition } from '@/hooks/useMousePosition'

export default function HomePage() {
  const mousePosition = useMousePosition()
  const [isLoading, setIsLoading] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)

  // Custom cursor follower effect
  useEffect(() => {
    const cursor = document.getElementById('cursor-follower')
    if (cursor) {
      const updateCursor = () => {
        cursor.style.left = `${mousePosition.x - 8}px`
        cursor.style.top = `${mousePosition.y - 8}px`
        cursor.style.opacity = '1'
      }

      const hideCursor = () => {
        cursor.style.opacity = '0'
      }

      const showCursor = () => {
        cursor.style.opacity = '1'
      }

      updateCursor()

      // Hide cursor when leaving window
      document.addEventListener('mouseleave', hideCursor)
      document.addEventListener('mouseenter', showCursor)

      // Hide cursor on mobile
      const isMobile = window.matchMedia('(max-width: 768px)').matches
      if (isMobile) {
        cursor.style.display = 'none'
      }

      return () => {
        document.removeEventListener('mouseleave', hideCursor)
        document.removeEventListener('mouseenter', showCursor)
      }
    }
  }, [mousePosition])

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

      {/* Main Content */}
      {!isLoading && (
        <main className="relative">
          {/* Navigation */}
          <Navigation />

          {/* Page Sections */}
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