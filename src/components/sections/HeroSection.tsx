'use client'

import React, { Suspense } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Sparkles } from 'lucide-react'
import ParticleField from '@/components/three/ParticleField'
import GlitchText from '@/components/animations/GlitchText'
import { fadeInUp, staggerContainer } from '@/utils/animations'

const HeroSection: React.FC = () => {
  const scrollToNext = () => {
    const element = document.querySelector('#about')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="hero-content" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-bg via-deep-purple/20 to-dark-bg">
        <div className="absolute inset-0 bg-cyber-grid opacity-30" />
        <Suspense fallback={<div className="loading-dots"><div></div><div></div><div></div><div></div></div>}>
          <ParticleField count={800} interactive className="absolute inset-0" />
        </Suspense>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-1/4 left-10 w-20 h-20 bg-gradient-to-br from-neon-green/20 to-electric-blue/20 rounded-full blur-xl"
        animate={{
          y: [-20, 20, -20],
          x: [-10, 10, -10],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute top-1/3 right-20 w-32 h-32 bg-gradient-to-br from-cyber-pink/20 to-deep-purple/20 rounded-full blur-xl"
        animate={{
          y: [20, -20, 20],
          x: [10, -10, 10],
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Hero Content */}
      <motion.div
        className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Greeting */}
        <motion.div
          variants={fadeInUp}
          className="mb-6"
        >
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-neon-green text-sm font-medium">
            <Sparkles className="w-4 h-4 mr-2" />
            Welcome to my digital realm
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          variants={fadeInUp}
          className="text-4xl sm:text-6xl lg:text-8xl font-bold mb-6 leading-tight"
        >
          <span className="block text-white">I'm a</span>
          <span className="block gradient-text text-shadow-neon">
            <GlitchText text="Digital Artisan" intensity="low" />
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeInUp}
          className="text-xl sm:text-2xl lg:text-3xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
        >
          Crafting{' '}
          <span className="text-electric-blue font-semibold">immersive experiences</span>
          {' '}through code, creativity, and{' '}
          <span className="text-cyber-pink font-semibold">cutting-edge technology</span>
        </motion.p>

        {/* Description */}
        <motion.p
          variants={fadeInUp}
          className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto"
        >
          I transform ideas into stunning digital realities using modern web technologies,
          3D animations, and interactive experiences that push the boundaries of what's possible.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <motion.button
            onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative px-8 py-4 bg-gradient-to-r from-neon-green to-electric-blue rounded-full font-semibold text-dark-bg transition-all duration-300 hover:shadow-2xl hover:shadow-neon-green/25 cursor-hover"
            data-cursor="hover"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">View My Work</span>
            <div className="absolute inset-0 bg-gradient-to-r from-electric-blue to-cyber-pink rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>

          <motion.button
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 border border-white/20 rounded-full font-semibold text-white hover:border-neon-green hover:text-neon-green transition-all duration-300 hover:shadow-lg hover:shadow-neon-green/10 cursor-hover"
            data-cursor="hover"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Get In Touch
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={fadeInUp}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          {[
            { number: '50+', label: 'Projects Completed' },
            { number: '5+', label: 'Years Experience' },
            { number: '100%', label: 'Client Satisfaction' },
            { number: '24/7', label: 'Passion Driven' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.1 }}
            >
              <div className="text-2xl sm:text-3xl font-bold gradient-text mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
        onClick={scrollToNext}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
        whileHover={{ scale: 1.1 }}
      >
        <div className="flex flex-col items-center text-gray-400 hover:text-neon-green transition-colors duration-300">
          <span className="text-sm mb-2 uppercase tracking-wider">Scroll Down</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown size={24} />
          </motion.div>
        </div>
      </motion.div>

      {/* Ambient Light Effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-electric-blue/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyber-pink/5 rounded-full blur-3xl animate-pulse-slow" />
      </div>
    </section>
  )
}

export default HeroSection