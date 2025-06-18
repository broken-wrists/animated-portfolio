'use client'

import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useMousePosition } from '@/hooks/useMousePosition'

interface ParticleFieldProps {
  count?: number
  interactive?: boolean
  className?: string
}

function Particles({ count = 50, interactive = true }: { count: number; interactive: boolean }) {
  const ref = useRef<THREE.Points>(null)
  const { size } = useThree()
  const mousePosition = useMousePosition()

  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return positions
  }, [count])

  const colors = useMemo(() => {
    const colors = new Float32Array(count * 3)
    const colorPalette = [
      new THREE.Color('#39ff14'), // neon green
      new THREE.Color('#007fff'), // electric blue
      new THREE.Color('#ff1493'), // cyber pink
      new THREE.Color('#4a0080'), // deep purple
    ]
    
    for (let i = 0; i < count; i++) {
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)]
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }
    return colors
  }, [count])

  useFrame((state) => {
    if (!ref.current) return

    const time = state.clock.getElapsedTime()
    const positions = ref.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      
      // Floating animation
      positions[i3 + 1] += Math.sin(time + positions[i3]) * 0.001
      
      // Simplified mouse effect (only every 4th particle for performance)
      if (interactive && i % 4 === 0) {
        const mouseX = (mousePosition.x / size.width) * 2 - 1
        const mouseY = -(mousePosition.y / size.height) * 2 + 1
        
        const dx = positions[i3] - mouseX * 5
        const dy = positions[i3 + 1] - mouseY * 5
        const distance = dx * dx + dy * dy // Skip sqrt for performance
        
        if (distance < 4) {
          const force = (4 - distance) * 0.001
          positions[i3] += dx * force * 0.5
          positions[i3 + 1] += dy * force * 0.5
        }
      }
      
      // Drift animation
      positions[i3] += Math.sin(time * 0.1 + i * 0.1) * 0.0005
      positions[i3 + 2] += Math.cos(time * 0.1 + i * 0.1) * 0.0005
    }

    ref.current.geometry.attributes.position.needsUpdate = true
    ref.current.rotation.x = time * 0.05
    ref.current.rotation.y = time * 0.075
  })

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#39ff14"
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        vertexColors
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}


const ParticleField: React.FC<ParticleFieldProps> = ({ 
  count = 50, 
  interactive = true, 
  className = '' 
}) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <Particles count={count} interactive={interactive} />
      </Canvas>
    </div>
  )
}

export default ParticleField