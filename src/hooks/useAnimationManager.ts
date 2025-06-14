'use client'

import { useRef, useEffect, useCallback } from 'react'

interface AnimationSubscriber {
  id: string
  callback: (timestamp: number, deltaTime: number) => void
  priority: number
}

class AnimationManager {
  private subscribers: Map<string, AnimationSubscriber> = new Map()
  private rafId: number | null = null
  private lastTime = 0
  private isRunning = false
  private targetFPS = 60
  private frameInterval = 1000 / 60

  constructor() {
    this.tick = this.tick.bind(this)
  }

  setTargetFPS(fps: number) {
    this.targetFPS = fps
    this.frameInterval = 1000 / fps
  }

  subscribe(id: string, callback: (timestamp: number, deltaTime: number) => void, priority = 0) {
    this.subscribers.set(id, { id, callback, priority })
    this.start()
  }

  unsubscribe(id: string) {
    this.subscribers.delete(id)
    if (this.subscribers.size === 0) {
      this.stop()
    }
  }

  private tick(timestamp: number) {
    if (timestamp - this.lastTime < this.frameInterval) {
      this.rafId = requestAnimationFrame(this.tick)
      return
    }

    const deltaTime = timestamp - this.lastTime
    this.lastTime = timestamp

    // Sort by priority and execute callbacks
    const sortedSubscribers = Array.from(this.subscribers.values())
      .sort((a, b) => b.priority - a.priority)

    for (const subscriber of sortedSubscribers) {
      try {
        subscriber.callback(timestamp, deltaTime)
      } catch (error) {
        console.warn(`Animation callback error for ${subscriber.id}:`, error)
      }
    }

    this.rafId = requestAnimationFrame(this.tick)
  }

  private start() {
    if (!this.isRunning && this.subscribers.size > 0) {
      this.isRunning = true
      this.lastTime = performance.now()
      this.rafId = requestAnimationFrame(this.tick)
    }
  }

  private stop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
    this.isRunning = false
  }

  destroy() {
    this.stop()
    this.subscribers.clear()
  }
}

// Global animation manager instance
let globalAnimationManager: AnimationManager | null = null

const getAnimationManager = () => {
  if (!globalAnimationManager) {
    globalAnimationManager = new AnimationManager()
  }
  return globalAnimationManager
}

export const useAnimationManager = () => {
  const manager = getAnimationManager()
  const callbackRef = useRef<((timestamp: number, deltaTime: number) => void) | null>(null)
  const idRef = useRef<string>('')

  const subscribe = useCallback((
    callback: (timestamp: number, deltaTime: number) => void,
    priority = 0,
    targetFPS = 60
  ) => {
    const id = `anim_${Math.random().toString(36).substr(2, 9)}`
    idRef.current = id
    callbackRef.current = callback
    
    manager.setTargetFPS(targetFPS)
    manager.subscribe(id, callback, priority)

    return () => {
      manager.unsubscribe(id)
    }
  }, [manager])

  const unsubscribe = useCallback(() => {
    if (idRef.current) {
      manager.unsubscribe(idRef.current)
      idRef.current = ''
      callbackRef.current = null
    }
  }, [manager])

  useEffect(() => {
    return () => {
      unsubscribe()
    }
  }, [unsubscribe])

  return { subscribe, unsubscribe }
}