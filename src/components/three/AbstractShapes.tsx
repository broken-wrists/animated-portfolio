'use client'

import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Sphere, Torus, Octahedron } from '@react-three/drei'
import * as THREE from 'three'

interface FloatingShapeProps {
  position: [number, number, number]
  scale: number
  speed: number
  color: string
  shape: 'sphere' | 'torus' | 'octahedron'
}

function FloatingShape({ position, scale, speed, color, shape }: FloatingShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    
    const time = state.clock.getElapsedTime()
    
    // Floating motion
    meshRef.current.position.y = position[1] + Math.sin(time * speed) * 0.5
    meshRef.current.position.x = position[0] + Math.cos(time * speed * 0.5) * 0.3
    
    // Rotation
    meshRef.current.rotation.x = time * speed * 0.3
    meshRef.current.rotation.y = time * speed * 0.2
    meshRef.current.rotation.z = time * speed * 0.1
    
    // Scale pulsing
    const pulseScale = scale + Math.sin(time * speed * 2) * 0.1
    meshRef.current.scale.setScalar(pulseScale)
  })

  const renderShape = () => {
    switch (shape) {
      case 'sphere':
        return (
          <Sphere args={[1, 32, 32]}>
            <MeshDistortMaterial
              color={color}
              transparent
              opacity={0.8}
              distort={0.3}
              speed={2}
              roughness={0.4}
            />
          </Sphere>
        )
      case 'torus':
        return (
          <Torus args={[1, 0.4, 16, 32]}>
            <MeshDistortMaterial
              color={color}
              transparent
              opacity={0.7}
              distort={0.5}
              speed={1.5}
              metalness={0.8}
            />
          </Torus>
        )
      case 'octahedron':
        return (
          <Octahedron args={[1]}>
            <MeshDistortMaterial
              color={color}
              transparent
              opacity={0.9}
              distort={0.2}
              speed={3}
              roughness={0.2}
            />
          </Octahedron>
        )
      default:
        return null
    }
  }

  return (
    <mesh ref={meshRef} position={position}>
      {renderShape()}
    </mesh>
  )
}

function LiquidBlob() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    
    const time = state.clock.getElapsedTime()
    
    // Continuous rotation
    meshRef.current.rotation.x = time * 0.1
    meshRef.current.rotation.y = time * 0.15
    
    // Morphing scale
    meshRef.current.scale.x = 1 + Math.sin(time * 0.5) * 0.3
    meshRef.current.scale.y = 1 + Math.cos(time * 0.7) * 0.3
    meshRef.current.scale.z = 1 + Math.sin(time * 0.3) * 0.3
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[2, 64, 64]} />
      <MeshDistortMaterial
        color="#39ff14"
        transparent
        opacity={0.3}
        distort={0.8}
        speed={4}
        roughness={0.1}
        metalness={0.9}
      />
    </mesh>
  )
}

function ParticleSwarm() {
  const particlesRef = useRef<THREE.Points>(null)
  
  const particleCount = 2000
  const positions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    return positions
  }, [])

  const colors = useMemo(() => {
    const colors = new Float32Array(particleCount * 3)
    const colorPalette = [
      new THREE.Color('#39ff14'),
      new THREE.Color('#007fff'),
      new THREE.Color('#ff1493'),
      new THREE.Color('#4a0080'),
    ]
    
    for (let i = 0; i < particleCount; i++) {
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)]
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }
    return colors
  }, [])

  useFrame((state) => {
    if (!particlesRef.current) return
    
    const time = state.clock.getElapsedTime()
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      // Swirling motion
      const radius = 5
      const angle = time * 0.5 + i * 0.01
      const height = Math.sin(time + i * 0.1) * 3
      
      positions[i3] = Math.cos(angle) * radius + Math.sin(time + i) * 2
      positions[i3 + 1] = height
      positions[i3 + 2] = Math.sin(angle) * radius + Math.cos(time + i) * 2
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true
    particlesRef.current.rotation.y = time * 0.1
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

interface AbstractShapesProps {
  className?: string
}

const AbstractShapes: React.FC<AbstractShapesProps> = ({ className = '' }) => {
  const shapes = useMemo(() => [
    { position: [-4, 2, -2] as [number, number, number], scale: 0.8, speed: 1.2, color: '#39ff14', shape: 'sphere' as const },
    { position: [3, -1, -3] as [number, number, number], scale: 1.2, speed: 0.8, color: '#007fff', shape: 'torus' as const },
    { position: [-2, -3, 1] as [number, number, number], scale: 1.0, speed: 1.5, color: '#ff1493', shape: 'octahedron' as const },
    { position: [4, 3, 2] as [number, number, number], scale: 0.6, speed: 2.0, color: '#4a0080', shape: 'sphere' as const },
    { position: [0, 4, -1] as [number, number, number], scale: 0.9, speed: 1.1, color: '#39ff14', shape: 'torus' as const },
    { position: [-3, 0, 3] as [number, number, number], scale: 1.1, speed: 0.9, color: '#007fff', shape: 'octahedron' as const },
  ], [])

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        {/* Ambient lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#39ff14" />
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#007fff" />
        <pointLight position={[0, 10, -10]} intensity={0.6} color="#ff1493" />

        {/* Central liquid blob */}
        <LiquidBlob />

        {/* Floating shapes */}
        {shapes.map((shape, index) => (
          <FloatingShape key={index} {...shape} />
        ))}

        {/* Particle swarm */}
        <ParticleSwarm />
      </Canvas>
    </div>
  )
}

export default AbstractShapes