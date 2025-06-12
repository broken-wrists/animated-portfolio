'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Github, Eye, Filter } from 'lucide-react'
import RevealAnimation from '@/components/animations/RevealAnimation'
import { fadeInUp, staggerContainer, scaleIn } from '@/utils/animations'
import { Project } from '@/types'

const ProjectsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)

  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'web', name: 'Web Apps' },
    { id: 'animation', name: '3D & Animation' },
    { id: 'ecommerce', name: 'E-commerce' },
    { id: 'mobile', name: 'Mobile' },
  ]

  const projects: Project[] = [
    {
      id: '1',
      title: 'Immersive 3D Portfolio',
      description: 'A stunning portfolio website featuring advanced Three.js animations, particle systems, and interactive 3D elements.',
      image: '/api/placeholder/600/400',
      tags: ['React', 'Three.js', 'GSAP', 'TypeScript'],
      demoUrl: 'https://demo.example.com',
      githubUrl: 'https://github.com/example/project',
      featured: true,
      category: 'animation'
    },
    {
      id: '2',
      title: 'E-commerce Platform',
      description: 'Modern e-commerce solution with real-time inventory, payment integration, and advanced analytics dashboard.',
      image: '/api/placeholder/600/400',
      tags: ['Next.js', 'Stripe', 'PostgreSQL', 'Redux'],
      demoUrl: 'https://demo.example.com',
      githubUrl: 'https://github.com/example/project',
      featured: true,
      category: 'ecommerce'
    },
    {
      id: '3',
      title: 'AI-Powered Dashboard',
      description: 'Interactive dashboard with machine learning insights, real-time data visualization, and predictive analytics.',
      image: '/api/placeholder/600/400',
      tags: ['React', 'D3.js', 'Python', 'TensorFlow'],
      demoUrl: 'https://demo.example.com',
      githubUrl: 'https://github.com/example/project',
      featured: false,
      category: 'web'
    },
    {
      id: '4',
      title: 'Mobile Gaming App',
      description: 'Cross-platform mobile game with WebGL graphics, multiplayer functionality, and social features.',
      image: '/api/placeholder/600/400',
      tags: ['React Native', 'WebGL', 'Socket.io', 'Node.js'],
      demoUrl: 'https://demo.example.com',
      githubUrl: 'https://github.com/example/project',
      featured: false,
      category: 'mobile'
    },
    {
      id: '5',
      title: 'Creative Agency Website',
      description: 'Award-winning website with scroll-triggered animations, custom shaders, and immersive storytelling.',
      image: '/api/placeholder/600/400',
      tags: ['Vue.js', 'WebGL', 'GSAP', 'Nuxt.js'],
      demoUrl: 'https://demo.example.com',
      githubUrl: 'https://github.com/example/project',
      featured: true,
      category: 'web'
    },
    {
      id: '6',
      title: 'VR Experience Platform',
      description: 'Virtual reality web experience using WebXR, featuring interactive 3D environments and spatial audio.',
      image: '/api/placeholder/600/400',
      tags: ['A-Frame', 'WebXR', 'Three.js', 'Web Audio API'],
      demoUrl: 'https://demo.example.com',
      githubUrl: 'https://github.com/example/project',
      featured: false,
      category: 'animation'
    },
  ]

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory)

  return (
    <section id="projects" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-surface/50 via-dark-bg to-dark-surface/50">
        <div className="absolute inset-0 bg-cyber-grid opacity-5" />
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-40 left-10 w-20 h-20 bg-gradient-to-br from-cyber-pink/10 to-electric-blue/10 rounded-full blur-lg"
        animate={{
          y: [-20, 20, -20],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Section Header */}
          <RevealAnimation direction="up" className="text-center mb-16">
            <motion.h2
              variants={fadeInUp}
              className="text-4xl lg:text-6xl font-bold mb-6"
            >
              Featured <span className="gradient-text">Projects</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-400 max-w-3xl mx-auto mb-12"
            >
              A showcase of my latest work, blending creativity with cutting-edge technology
            </motion.p>
          </RevealAnimation>

          {/* Category Filter */}
          <RevealAnimation direction="up" className="mb-12">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-neon-green to-electric-blue text-dark-bg'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  layout
                >
                  <span className="flex items-center gap-2">
                    <Filter size={16} />
                    {category.name}
                  </span>
                </motion.button>
              ))}
            </div>
          </RevealAnimation>

          {/* Projects Grid */}
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            layout
          >
            <AnimatePresence mode="wait">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`group relative ${
                    project.featured ? 'md:col-span-2 lg:col-span-1' : ''
                  }`}
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  <div className="perspective-card h-full">
                    <div className="card-3d bg-dark-surface rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-500">
                      {/* Project Image */}
                      <div className="relative h-64 overflow-hidden">
                        <motion.div
                          className="w-full h-full bg-gradient-to-br from-neon-green/20 via-electric-blue/20 to-cyber-pink/20 flex items-center justify-center"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="text-center">
                            <Eye size={48} className="text-white/50 mx-auto mb-4" />
                            <p className="text-white/70">Project Preview</p>
                          </div>
                        </motion.div>

                        {/* Overlay */}
                        <motion.div
                          className="absolute inset-0 bg-dark-bg/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                          initial={false}
                          animate={{ opacity: hoveredProject === project.id ? 1 : 0 }}
                        >
                          <div className="flex gap-4">
                            <motion.a
                              href={project.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-3 bg-neon-green rounded-full text-dark-bg hover:bg-electric-blue transition-colors duration-300"
                              whileHover={{ scale: 1.1, y: -2 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <ExternalLink size={20} />
                            </motion.a>
                            <motion.a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors duration-300"
                              whileHover={{ scale: 1.1, y: -2 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Github size={20} />
                            </motion.a>
                          </div>
                        </motion.div>

                        {/* Featured Badge */}
                        {project.featured && (
                          <div className="absolute top-4 right-4">
                            <span className="px-3 py-1 bg-gradient-to-r from-neon-green to-electric-blue rounded-full text-xs font-semibold text-dark-bg">
                              Featured
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Project Info */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:gradient-text transition-all duration-300">
                          {project.title}
                        </h3>
                        
                        <p className="text-gray-400 mb-4 leading-relaxed">
                          {project.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 bg-white/5 rounded-full text-xs font-medium text-gray-300 border border-white/10"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* View More */}
          <RevealAnimation direction="up" className="text-center mt-16">
            <motion.div className="space-y-4">
              <p className="text-gray-400">
                Interested in seeing more of my work?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-neon-green to-electric-blue rounded-full font-semibold text-dark-bg hover:shadow-lg hover:shadow-neon-green/25 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View All Projects
                </motion.button>
                <motion.button
                  onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 border border-white/20 rounded-full font-semibold text-white hover:border-neon-green hover:text-neon-green transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Discuss Your Project
                </motion.button>
              </div>
            </motion.div>
          </RevealAnimation>
        </motion.div>
      </div>

      {/* Background Ambient Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyber-pink/3 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-electric-blue/3 rounded-full blur-3xl animate-pulse-slow" />
      </div>
    </section>
  )
}

export default ProjectsSection