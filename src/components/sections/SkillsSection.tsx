'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Code2, 
  Palette, 
  Database, 
  Smartphone, 
  Globe, 
  Zap,
  Cpu,
  Layers
} from 'lucide-react'
import RevealAnimation from '@/components/animations/RevealAnimation'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { fadeInUp, staggerContainer, scaleIn } from '@/utils/animations'
import { Skill } from '@/types'

const SkillsSection: React.FC = () => {
  const [animationTriggered, setAnimationTriggered] = useState(false)
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.3,
    triggerOnce: true,
  })

  useEffect(() => {
    if (isIntersecting && !animationTriggered) {
      setAnimationTriggered(true)
    }
  }, [isIntersecting, animationTriggered])

  const skillCategories = [
    {
      title: 'Programming',
      icon: Code2,
      color: 'from-neon-green to-electric-blue',
      skills: [
        { name: 'Java', level: 85 },
        { name: 'HTML', level: 80 },
        { name: 'JavaScript', level: 75 },
        { name: 'Python', level: 70 },
      ]
    },
    {
      title: 'Machine Learning & AI',
      icon: Zap,
      color: 'from-electric-blue to-cyber-pink',
      skills: [
        { name: 'TensorFlow', level: 80 },
        { name: 'Keras', level: 75 },
        { name: 'LSTM Networks', level: 70 },
        { name: 'A* Algorithm', level: 85 },
      ]
    },
    {
      title: 'Cloud & Platform',
      icon: Database,
      color: 'from-cyber-pink to-deep-purple',
      skills: [
        { name: 'AWS Bedrock', level: 75 },
        { name: 'Amazon S3', level: 80 },
        { name: 'AWS Nova Pro', level: 70 },
        { name: 'System Architecture', level: 78 },
      ]
    },
    {
      title: 'Technical Skills',
      icon: Cpu,
      color: 'from-deep-purple to-neon-green',
      skills: [
        { name: 'PC/Mac Troubleshooting', level: 90 },
        { name: 'System Upgrades', level: 85 },
        { name: 'Microsoft Office Suite', level: 95 },
        { name: 'Project Management', level: 88 },
      ]
    }
  ]

  const professionalSkills = [
    { name: 'Team Leadership', icon: Palette, level: 90 },
    { name: 'Customer Service', icon: Layers, level: 95 },
    { name: 'Communication', icon: Globe, level: 92 },
    { name: 'Problem Solving', icon: Smartphone, level: 88 },
  ]

  const SkillBar: React.FC<{ skill: { name: string; level: number }; delay: number; color: string }> = ({ 
    skill, 
    delay, 
    color 
  }) => {
    const [width, setWidth] = useState(0)

    useEffect(() => {
      if (animationTriggered) {
        const timer = setTimeout(() => {
          setWidth(skill.level)
        }, delay)
        return () => clearTimeout(timer)
      }
    }, [animationTriggered, skill.level, delay])

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-300 font-medium">{skill.name}</span>
          <span className="text-sm text-gray-400">{skill.level}%</span>
        </div>
        <div className="w-full bg-gray-700/30 rounded-full h-2 overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${color} rounded-full relative`}
            initial={{ width: 0 }}
            animate={{ width: `${width}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          >
            <div className="absolute inset-0 bg-white/20 animate-shimmer" />
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <section id="skills" className="py-20 lg:py-32 relative overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-bg via-dark-surface/30 to-dark-bg">
        <div className="absolute inset-0 bg-cyber-grid opacity-10" />
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-neon-green/10 to-electric-blue/10 rounded-full blur-xl"
        animate={{
          y: [-30, 30, -30],
          x: [-15, 15, -15],
          rotate: [0, 360],
        }}
        transition={{
          duration: 25,
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
              Technical <span className="gradient-text">Expertise</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-400 max-w-3xl mx-auto"
            >
              A comprehensive toolkit for bringing digital visions to life
            </motion.p>
          </RevealAnimation>

          {/* Skills Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {skillCategories.map((category, categoryIndex) => (
              <RevealAnimation 
                key={category.title} 
                direction={categoryIndex % 2 === 0 ? 'left' : 'right'}
                delay={categoryIndex * 0.1}
              >
                <motion.div
                  className="p-8 glass-effect rounded-2xl hover:bg-white/5 transition-all duration-300 group"
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  {/* Category Header */}
                  <div className="flex items-center mb-6">
                    <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300`}>
                      <category.icon className="text-dark-bg" size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-white group-hover:gradient-text transition-all duration-300">
                      {category.title}
                    </h3>
                  </div>

                  {/* Skills */}
                  <div className="space-y-4">
                    {category.skills.map((skill, skillIndex) => (
                      <SkillBar
                        key={skill.name}
                        skill={skill}
                        delay={(categoryIndex * 200) + (skillIndex * 100)}
                        color={category.color}
                      />
                    ))}
                  </div>
                </motion.div>
              </RevealAnimation>
            ))}
          </div>

          {/* Professional Skills Section */}
          <RevealAnimation direction="up" className="mb-16">
            <h3 className="text-3xl font-bold text-center mb-8">
              Professional <span className="gradient-text">Skills</span>
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {professionalSkills.map((tool, index) => (
                <motion.div
                  key={tool.name}
                  className="text-center p-6 glass-effect rounded-xl hover:bg-white/10 transition-all duration-300 group cursor-pointer"
                  variants={scaleIn}
                  whileHover={{ y: -10, scale: 1.05 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-neon-green to-electric-blue rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <tool.icon className="text-dark-bg" size={28} />
                  </div>
                  
                  <h4 className="text-lg font-semibold mb-2 text-white group-hover:text-neon-green transition-colors duration-300">
                    {tool.name}
                  </h4>
                  
                  <div className="text-sm text-gray-400 mb-3">{tool.level}%</div>
                  
                  <div className="w-full bg-gray-700/30 rounded-full h-1">
                    <motion.div
                      className="h-full bg-gradient-to-r from-neon-green to-electric-blue rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: animationTriggered ? `${tool.level}%` : 0 }}
                      transition={{ duration: 1.5, delay: index * 0.2, ease: 'easeOut' }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </RevealAnimation>

          {/* Certifications & Achievements */}
          <RevealAnimation direction="up" className="text-center">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Hack The Box', subtitle: 'Academy (In Progress)', icon: '🛡️' },
                { title: 'Illinois Pesticide', subtitle: 'Applicator License', icon: '🌱' },
                { title: '4+ Years', subtitle: 'Management Experience', icon: '🚀' },
                { title: 'NASA Hackathon', subtitle: 'Winner', icon: '🏆' },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  className="p-6 glass-effect rounded-xl text-center hover:bg-white/10 transition-all duration-300"
                  whileHover={{ y: -5, scale: 1.05 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h4 className="text-lg font-bold text-white mb-1">{item.title}</h4>
                  <p className="text-gray-400 text-sm">{item.subtitle}</p>
                </motion.div>
              ))}
            </div>
          </RevealAnimation>
        </motion.div>
      </div>

      {/* Background Ambient Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-neon-green/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-cyber-pink/5 rounded-full blur-3xl animate-pulse-slow" />
      </div>
    </section>
  )
}

export default SkillsSection