'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface ScrollRevealProps {
  children: React.ReactNode
  direction?: 'up' | 'down' | 'left' | 'right'
  distance?: number
  duration?: number
  delay?: number
  ease?: string
  className?: string
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'up',
  distance = 60,
  duration = 0.8,
  delay = 0,
  ease = 'power2.out',
  className = ''
}) => {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !elementRef.current) return

    const element = elementRef.current

    // Set initial state
    const initialState: any = { opacity: 0 }
    
    switch (direction) {
      case 'up':
        initialState.y = distance
        break
      case 'down':
        initialState.y = -distance
        break
      case 'left':
        initialState.x = distance
        break
      case 'right':
        initialState.x = -distance
        break
    }

    gsap.set(element, initialState)

    // Create scroll trigger animation
    const ScrollTrigger = require('gsap/ScrollTrigger')
    gsap.registerPlugin(ScrollTrigger)

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        end: 'bottom 15%',
        toggleActions: 'play none none reverse',
        once: true,
      }
    })

    tl.to(element, {
      opacity: 1,
      x: 0,
      y: 0,
      duration,
      delay,
      ease,
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger: any) => {
        if (trigger.trigger === element) {
          trigger.kill()
        }
      })
    }
  }, [direction, distance, duration, delay, ease])

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  )
}

export default ScrollReveal