'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface ParallaxSectionProps {
  children: React.ReactNode
  speed?: number
  className?: string
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  speed = 0.5,
  className = ''
}) => {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !elementRef.current) return

    const element = elementRef.current
    const ScrollTrigger = require('gsap/ScrollTrigger')
    gsap.registerPlugin(ScrollTrigger)

    // Create parallax effect
    gsap.to(element, {
      yPercent: -100 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      }
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger: any) => {
        if (trigger.trigger === element) {
          trigger.kill()
        }
      })
    }
  }, [speed])

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  )
}

export default ParallaxSection