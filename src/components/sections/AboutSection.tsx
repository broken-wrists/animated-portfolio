'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Code, Palette, Zap, Users, Award, Coffee } from 'lucide-react'
import RevealAnimation from '@/components/animations/RevealAnimation'
import { fadeInUp, staggerContainer, scaleIn } from '@/utils/animations'

const AboutSection: React.FC = () => {
  const skills = [
    { icon: Code, title: 'Programming', description: 'Java, HTML, System Troubleshooting, PC/Mac Platforms' },
    { icon: Palette, title: 'Technical Skills', description: 'Microsoft Office Suite, Application Installation, System Upgrades' },
    { icon: Zap, title: 'Machine Learning', description: 'TensorFlow, Keras, LSTM Networks, AWS Bedrock' },
    { icon: Users, title: 'Leadership', description: 'Team Management, Project Management, Communication, Customer Service' },
  ]

  const stats = [
    { number: '2026', label: 'CS Graduation', color: 'text-neon-green' },
    { number: '4+', label: 'Years Experience', color: 'text-electric-blue' },
    { number: '3', label: 'Management Roles', color: 'text-cyber-pink' },
    { number: '1', label: 'NASA Hackathon Win', color: 'text-yellow-400' },
  ]

  return (
    <section id="about" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-bg via-dark-surface/50 to-dark-bg">
        <div className="absolute inset-0 bg-cyber-grid opacity-10" />
      </div>

      {/* Floating Shapes */}
      <motion.div
        className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-neon-green/10 to-electric-blue/10 rounded-full blur-xl"
        animate={{
          y: [-30, 30, -30],
          x: [-15, 15, -15],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Section Header */}
          <RevealAnimation direction="up" className="text-center mb-16">
            <motion.h2
              variants={fadeInUp}
              className="text-4xl lg:text-6xl font-bold mb-6"
            >
              About <span className="gradient-text">Me</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-400 max-w-3xl mx-auto"
            >
              Passionate about creating digital experiences that blend creativity with cutting-edge technology
            </motion.p>
          </RevealAnimation>

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Left Column - Bio */}
            <RevealAnimation direction="left" className="space-y-6">
              <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
                <p>
                  I'm <span className="text-neon-green font-semibold">James Guadagnoli</span>, a Computer Science student at 
                  Colorado State University with a unique background bridging <span className="text-electric-blue font-semibold">horticulture and technology</span>. 
                  My journey from managing plant cultivation operations to developing software solutions has given me 
                  a distinctive perspective on <span className="text-cyber-pink font-semibold">problem-solving and systems thinking</span>.
                </p>
                
                <p>
                  Currently pursuing my CS degree (graduating May 2026), I bring hands-on experience in 
                  <span className="text-neon-green font-semibold">Java, HTML, and system troubleshooting</span>. My professional background includes 
                  managing cultivation operations, leading teams, and designing controlled environments—skills that 
                  translate perfectly to <span className="text-electric-blue font-semibold">software development and project management</span>.
                </p>
                
                <p>
                  Recently, I had the honor of participating in the <span className="text-yellow-400 font-semibold">CSU NASA Hackathon</span>, 
                  where my team won the award for the most simplistic and easy-to-implement model. We developed 
                  autonomous navigation solutions using A* algorithms and machine learning with TensorFlow and AWS tools.
                </p>
              </div>

              {/* Personal Stats */}
              <motion.div 
                className="grid grid-cols-2 gap-6 pt-8"
                variants={staggerContainer}
              >
                {stats.map((stat, index) => (
                  <motion.div 
                    key={stat.label}
                    variants={scaleIn}
                    className="text-center p-4 glass-effect rounded-lg hover:bg-white/10 transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-400 uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </RevealAnimation>

            {/* Right Column - Profile Image */}
            <RevealAnimation direction="right" className="relative">
              <div className="relative mx-auto w-80 h-80 lg:w-96 lg:h-96">
                {/* Profile Image Placeholder */}
                <motion.div
                  className="w-full h-full bg-gradient-to-br from-neon-green/20 via-electric-blue/20 to-cyber-pink/20 rounded-2xl glass-effect flex items-center justify-center"
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-neon-green to-electric-blue rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Code size={48} className="text-dark-bg" />
                    </div>
                    <p className="text-gray-300 text-lg font-medium">Professional Photo</p>
                    <p className="text-gray-500 text-sm">Coming Soon</p>
                  </div>
                </motion.div>

                {/* Floating Icons */}
                <motion.div
                  className="absolute -top-4 -right-4 w-16 h-16 bg-neon-green/20 rounded-full flex items-center justify-center glass-effect"
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 10, repeat: Infinity, ease: 'linear' },
                    scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
                  }}
                >
                  <Award className="text-neon-green" size={24} />
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 -left-4 w-16 h-16 bg-cyber-pink/20 rounded-full flex items-center justify-center glass-effect"
                  animate={{ 
                    rotate: [360, 0],
                    y: [-5, 5, -5]
                  }}
                  transition={{ 
                    rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
                    y: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
                  }}
                >
                  <Coffee className="text-cyber-pink" size={24} />
                </motion.div>
              </div>
            </RevealAnimation>
          </div>

          {/* Skills Grid */}
          <RevealAnimation direction="up" className="mb-16">
            <h3 className="text-3xl font-bold text-center mb-12">
              What I <span className="gradient-text">Bring</span> to the Table
            </h3>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.title}
                  className="p-6 glass-effect rounded-xl hover:bg-white/10 transition-all duration-300 group cursor-pointer"
                  variants={scaleIn}
                  whileHover={{ y: -10, scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-neon-green to-electric-blue rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <skill.icon className="text-dark-bg" size={24} />
                  </div>
                  
                  <h4 className="text-xl font-semibold mb-3 text-white group-hover:text-neon-green transition-colors duration-300">
                    {skill.title}
                  </h4>
                  
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {skill.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </RevealAnimation>

          {/* Call to Action */}
          <RevealAnimation direction="up" className="text-center">
            <motion.div
              className="inline-flex items-center gap-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button 
                onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-gradient-to-r from-neon-green to-electric-blue rounded-full font-semibold text-dark-bg hover:shadow-lg hover:shadow-neon-green/25 transition-all duration-300"
              >
                See My Work
              </button>
              
              <div className="text-gray-400">or</div>
              
              <button 
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 border border-white/20 rounded-full font-semibold text-white hover:border-neon-green hover:text-neon-green transition-all duration-300"
              >
                Let's Talk
              </button>
            </motion.div>
          </RevealAnimation>
        </motion.div>
      </div>

      {/* Ambient Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-electric-blue/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-neon-green/5 rounded-full blur-3xl animate-pulse-slow" />
      </div>
    </section>
  )
}

export default AboutSection