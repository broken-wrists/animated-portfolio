'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Github, 
  Linkedin, 
  Twitter,
  MessageSquare,
  Clock,
  CheckCircle
} from 'lucide-react'
import RevealAnimation from '@/components/animations/RevealAnimation'
import { fadeInUp, staggerContainer, scaleIn } from '@/utils/animations'
import { ContactForm } from '@/types'

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'hello@digitalartisan.dev',
      href: 'mailto:hello@digitalartisan.dev',
      color: 'from-neon-green to-electric-blue'
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+1 (555) 123-4567',
      href: 'tel:+15551234567',
      color: 'from-electric-blue to-cyber-pink'
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'San Francisco, CA',
      href: '#',
      color: 'from-cyber-pink to-deep-purple'
    }
  ]

  const socialLinks = [
    { icon: Github, href: 'https://github.com', label: 'GitHub', color: 'hover:text-gray-300' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn', color: 'hover:text-blue-400' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter', color: 'hover:text-sky-400' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    
    // Reset form after success message
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 3000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <section id="contact" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-surface/30 via-dark-bg to-dark-surface/30">
        <div className="absolute inset-0 bg-cyber-grid opacity-5" />
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-40 right-10 w-40 h-40 bg-gradient-to-br from-neon-green/10 to-electric-blue/10 rounded-full blur-2xl"
        animate={{
          y: [-40, 40, -40],
          x: [-20, 20, -20],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
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
              Let's <span className="gradient-text">Connect</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-400 max-w-3xl mx-auto"
            >
              Ready to bring your digital vision to life? Let's discuss your project and create something amazing together.
            </motion.p>
          </RevealAnimation>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Contact Form */}
            <RevealAnimation direction="left" className="order-2 lg:order-1">
              <motion.div
                className="p-8 glass-effect rounded-2xl"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-neon-green to-electric-blue rounded-xl flex items-center justify-center mr-4">
                    <MessageSquare className="text-dark-bg" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Send a Message</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <motion.div whileFocus={{ scale: 1.02 }}>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-neon-green focus:outline-none focus:ring-2 focus:ring-neon-green/20 transition-all duration-300"
                        placeholder="Your name"
                      />
                    </motion.div>

                    <motion.div whileFocus={{ scale: 1.02 }}>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-neon-green focus:outline-none focus:ring-2 focus:ring-neon-green/20 transition-all duration-300"
                        placeholder="your@email.com"
                      />
                    </motion.div>
                  </div>

                  <motion.div whileFocus={{ scale: 1.02 }}>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-neon-green focus:outline-none focus:ring-2 focus:ring-neon-green/20 transition-all duration-300"
                      placeholder="Project inquiry"
                    />
                  </motion.div>

                  <motion.div whileFocus={{ scale: 1.02 }}>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-neon-green focus:outline-none focus:ring-2 focus:ring-neon-green/20 transition-all duration-300 resize-none"
                      placeholder="Tell me about your project..."
                    />
                  </motion.div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting || isSubmitted}
                    className={`w-full py-4 rounded-lg font-semibold transition-all duration-300 ${
                      isSubmitted
                        ? 'bg-green-600 text-white'
                        : 'bg-gradient-to-r from-neon-green to-electric-blue text-dark-bg hover:shadow-lg hover:shadow-neon-green/25'
                    }`}
                    whileHover={!isSubmitting && !isSubmitted ? { scale: 1.02, y: -2 } : {}}
                    whileTap={!isSubmitting && !isSubmitted ? { scale: 0.98 } : {}}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <>
                          <div className="loading-dots">
                            <div></div><div></div><div></div><div></div>
                          </div>
                          Sending...
                        </>
                      ) : isSubmitted ? (
                        <>
                          <CheckCircle size={20} />
                          Message Sent!
                        </>
                      ) : (
                        <>
                          <Send size={20} />
                          Send Message
                        </>
                      )}
                    </span>
                  </motion.button>
                </form>
              </motion.div>
            </RevealAnimation>

            {/* Contact Info */}
            <RevealAnimation direction="right" className="order-1 lg:order-2">
              <div className="space-y-8">
                {/* Contact Cards */}
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <motion.a
                      key={info.title}
                      href={info.href}
                      className="block p-6 glass-effect rounded-xl hover:bg-white/10 transition-all duration-300 group"
                      whileHover={{ x: 10, scale: 1.02 }}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="flex items-center">
                        <div className={`w-12 h-12 bg-gradient-to-br ${info.color} rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300`}>
                          <info.icon className="text-dark-bg" size={24} />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white group-hover:gradient-text transition-all duration-300">
                            {info.title}
                          </h4>
                          <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                            {info.value}
                          </p>
                        </div>
                      </div>
                    </motion.a>
                  ))}
                </div>

                {/* Availability */}
                <motion.div
                  className="p-6 glass-effect rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-deep-purple to-neon-green rounded-xl flex items-center justify-center mr-4">
                      <Clock className="text-dark-bg" size={24} />
                    </div>
                    <h4 className="text-lg font-semibold text-white">Availability</h4>
                  </div>
                  <div className="space-y-2 text-gray-400">
                    <p>🟢 Currently available for new projects</p>
                    <p>⏰ Response time: 24-48 hours</p>
                    <p>🌍 PST timezone (UTC-8)</p>
                  </div>
                </motion.div>

                {/* Social Links */}
                <motion.div
                  className="p-6 glass-effect rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <h4 className="text-lg font-semibold text-white mb-4">Connect Socially</h4>
                  <div className="flex gap-4">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300 hover:bg-white/10`}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <social.icon size={20} />
                      </motion.a>
                    ))}
                  </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                  className="text-center p-6 glass-effect rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  <h4 className="text-xl font-bold gradient-text mb-2">
                    Ready to Start?
                  </h4>
                  <p className="text-gray-400 mb-4">
                    Let's discuss your project and bring your vision to life.
                  </p>
                  <motion.button
                    onClick={() => document.querySelector('#contact form')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-6 py-3 bg-gradient-to-r from-neon-green to-electric-blue rounded-lg font-semibold text-dark-bg hover:shadow-lg hover:shadow-neon-green/25 transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Start Project
                  </motion.button>
                </motion.div>
              </div>
            </RevealAnimation>
          </div>
        </motion.div>
      </div>

      {/* Background Ambient Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric-blue/3 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-pink/3 rounded-full blur-3xl animate-pulse-slow" />
      </div>
    </section>
  )
}

export default ContactSection