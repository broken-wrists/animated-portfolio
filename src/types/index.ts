export interface Project {
  id: string
  title: string
  description: string
  image: string
  tags: string[]
  demoUrl?: string
  githubUrl?: string
  featured: boolean
  category: string
}

export interface Skill {
  name: string
  level: number
  category: 'frontend' | 'backend' | 'tools' | 'design'
  icon: string
}

export interface Experience {
  id: string
  company: string
  position: string
  period: string
  description: string[]
  technologies: string[]
}

export interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

export interface AnimationProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  className?: string
}

export interface ParticleProps {
  position: [number, number, number]
  color: string
  size: number
  speed: number
}

export interface ThreeSceneProps {
  className?: string
  particleCount?: number
  interactive?: boolean
}