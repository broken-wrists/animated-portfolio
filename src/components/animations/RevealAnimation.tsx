'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { AnimationProps } from '@/types'

const RevealAnimation: React.FC<AnimationProps> = ({
  children,
  delay = 0,
  duration = 0.6,
  direction = 'up',
  className = '',
}) => {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  })

  const directionVariants = {
    up: { y: 60, x: 0 },
    down: { y: -60, x: 0 },
    left: { x: -60, y: 0 },
    right: { x: 60, y: 0 },
  }

  const variants = {
    hidden: {
      opacity: 0,
      ...directionVariants[direction],
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  }

  return (
    <motion.div
      ref={ref as any}
      initial="hidden"
      animate={isIntersecting ? 'visible' : 'hidden'}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default RevealAnimation