'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

if (typeof window !== 'undefined') {
  const ScrollTrigger = require('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)
}

export const useScrollTrigger = (
  animation: (element: HTMLElement) => void,
  deps: any[] = []
) => {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current || typeof window === 'undefined') return

    const element = ref.current
    animation(element)

    return () => {
      if (typeof window !== 'undefined') {
        const ScrollTrigger = require('gsap/ScrollTrigger')
        ScrollTrigger.getAll().forEach((trigger: any) => {
          if (trigger.trigger === element) {
            trigger.kill()
          }
        })
      }
    }
  }, deps)

  return ref
}