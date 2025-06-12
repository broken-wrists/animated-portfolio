'use client'

import React, { Suspense } from 'react'
import { motion } from 'framer-motion'
import AbstractShapes from '@/components/three/AbstractShapes'

const VisualShowcase: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-dark-bg via-deep-purple/10 to-dark-bg">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-cyber-grid opacity-5" />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-neon-green/5 via-transparent to-electric-blue/5"
          animate={{
            background: [
              'linear-gradient(45deg, rgba(57, 255, 20, 0.05) 0%, transparent 50%, rgba(0, 127, 255, 0.05) 100%)',
              'linear-gradient(135deg, rgba(0, 127, 255, 0.05) 0%, transparent 50%, rgba(255, 20, 147, 0.05) 100%)',
              'linear-gradient(225deg, rgba(255, 20, 147, 0.05) 0%, transparent 50%, rgba(74, 0, 128, 0.05) 100%)',
              'linear-gradient(315deg, rgba(74, 0, 128, 0.05) 0%, transparent 50%, rgba(57, 255, 20, 0.05) 100%)',
              'linear-gradient(45deg, rgba(57, 255, 20, 0.05) 0%, transparent 50%, rgba(0, 127, 255, 0.05) 100%)',
            ]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      </div>

      {/* Floating Geometric Shapes (2D) */}
      <motion.div
        className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-neon-green/20 to-electric-blue/20 blur-xl"
        animate={{
          y: [-40, 40, -40],
          x: [-20, 20, -20],
          rotate: [0, 180, 360],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
        }}
      />

      <motion.div
        className="absolute top-1/3 right-10 w-48 h-48 bg-gradient-to-br from-cyber-pink/15 to-deep-purple/15 blur-2xl"
        animate={{
          y: [30, -30, 30],
          x: [15, -15, 15],
          rotate: [360, 180, 0],
          scale: [1.2, 0.8, 1.2],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          borderRadius: '58% 42% 75% 25% / 76% 46% 54% 24%',
        }}
      />

      <motion.div
        className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-gradient-to-br from-electric-blue/25 to-neon-green/25 blur-lg"
        animate={{
          y: [-25, 25, -25],
          x: [-30, 30, -30],
          rotate: [0, -180, -360],
          scale: [0.8, 1.4, 0.8],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          borderRadius: '50% 50% 33% 67% / 55% 27% 73% 45%',
        }}
      />

      {/* Main 3D Scene */}
      <div className="relative z-10 w-full h-full">
        <Suspense 
          fallback={
            <div className="flex items-center justify-center h-full">
              <motion.div
                className="w-16 h-16 border-4 border-neon-green/30 border-t-neon-green rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          }
        >
          <AbstractShapes className="absolute inset-0" />
        </Suspense>
      </div>

      {/* Animated Light Rays */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-neon-green/20 to-transparent"
          animate={{
            opacity: [0, 1, 0],
            scaleY: [0, 1, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: 0,
          }}
        />
        
        <motion.div
          className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-electric-blue/20 to-transparent"
          animate={{
            opacity: [0, 1, 0],
            scaleY: [0, 1, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: 1,
          }}
        />
        
        <motion.div
          className="absolute top-0 left-2/3 w-px h-full bg-gradient-to-b from-transparent via-cyber-pink/20 to-transparent"
          animate={{
            opacity: [0, 1, 0],
            scaleY: [0, 1, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: 2,
          }}
        />
      </div>

      {/* Particle Trails */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-neon-green rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 50,
              opacity: 0,
            }}
            animate={{
              y: -50,
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'linear',
            }}
          />
        ))}
        
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`blue-${i}`}
            className="absolute w-1 h-1 bg-electric-blue rounded-full"
            initial={{
              x: -50,
              y: Math.random() * window.innerHeight,
              opacity: 0,
            }}
            animate={{
              x: window.innerWidth + 50,
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Infinity,
              delay: Math.random() * 6,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Central Energy Core */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full pointer-events-none"
        animate={{
          scale: [1, 2, 1],
          opacity: [0.8, 0.2, 0.8],
          boxShadow: [
            '0 0 20px rgba(255, 255, 255, 0.8)',
            '0 0 80px rgba(57, 255, 20, 0.8)',
            '0 0 20px rgba(255, 255, 255, 0.8)',
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-400 text-center cursor-pointer"
        onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
        whileHover={{ scale: 1.1 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-gray-400 rounded-full mx-auto mb-2 relative"
          whileHover={{ borderColor: '#39ff14' }}
        >
          <motion.div
            className="w-1 h-3 bg-gray-400 rounded-full absolute top-2 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
        <span className="text-xs uppercase tracking-wider">Explore</span>
      </motion.div>

      {/* Background Ambient Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-green/3 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-electric-blue/3 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-3/4 left-3/4 w-96 h-96 bg-cyber-pink/3 rounded-full blur-3xl animate-pulse-slow" />
      </div>
    </section>
  )
}

export default VisualShowcase