'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Heart, ArrowUp, Github, Linkedin, Mail } from 'lucide-react'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-dark-surface/50 border-t border-white/10 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-cyber-grid opacity-5" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-4"
            >
              <h3 className="text-2xl font-bold gradient-text">Digital Artisan</h3>
              <p className="text-gray-400 mt-2 text-sm">
                Crafting digital experiences with passion and precision.
              </p>
            </motion.div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <nav className="space-y-2">
                {[
                  { name: 'Home', href: '#hero-content' },
                  { name: 'About', href: '#about' },
                  { name: 'Projects', href: '#projects' },
                  { name: 'Skills', href: '#skills' },
                  { name: 'Contact', href: '#contact' },
                ].map((link) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault()
                      document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="block text-gray-400 hover:text-neon-green transition-colors duration-200 cursor-pointer"
                    whileHover={{ x: 5 }}
                  >
                    {link.name}
                  </motion.a>
                ))}
              </nav>
            </motion.div>
          </div>

          {/* Services */}
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold text-white mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Web Development</li>
                <li>3D Animations</li>
                <li>UI/UX Design</li>
                <li>Performance Optimization</li>
                <li>Technical Consulting</li>
              </ul>
            </motion.div>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold text-white mb-4">Get in Touch</h4>
              <div className="space-y-3">
                <a
                  href="mailto:hello@digitalartisan.dev"
                  className="flex items-center text-gray-400 hover:text-neon-green transition-colors duration-200"
                >
                  <Mail size={16} className="mr-2" />
                  hello@digitalartisan.dev
                </a>
                <div className="flex gap-3">
                  {[
                    { icon: Github, href: 'https://github.com', label: 'GitHub' },
                    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
                  ].map((social) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-neon-green transition-colors duration-200"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <social.icon size={20} />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center"
        >
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            <p className="flex items-center">
              © {currentYear} Digital Artisan. Made with{' '}
              <Heart className="mx-1 text-red-500 animate-pulse" size={16} />{' '}
              and lots of coffee.
            </p>
          </div>

          {/* Back to Top Button */}
          <motion.button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-gray-400 hover:text-neon-green hover:bg-white/10 transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-sm">Back to Top</span>
            <ArrowUp size={16} />
          </motion.button>
        </motion.div>
      </div>

      {/* Ambient Background Effects */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-neon-green via-electric-blue to-cyber-pink opacity-50" />
    </footer>
  )
}

export default Footer