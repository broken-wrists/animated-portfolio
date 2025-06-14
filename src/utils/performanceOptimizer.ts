'use client'

// Performance optimization utilities
export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer
  private rafCallbacks: Map<string, (timestamp: number) => void> = new Map()
  private rafId: number | null = null
  private isRunning = false
  private targetFPS = 60
  private frameTime = 1000 / 60
  private lastTime = 0

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer()
    }
    return PerformanceOptimizer.instance
  }

  private constructor() {
    this.tick = this.tick.bind(this)
  }

  setTargetFPS(fps: number) {
    this.targetFPS = fps
    this.frameTime = 1000 / fps
  }

  subscribe(id: string, callback: (timestamp: number) => void) {
    this.rafCallbacks.set(id, callback)
    this.start()
  }

  unsubscribe(id: string) {
    this.rafCallbacks.delete(id)
    if (this.rafCallbacks.size === 0) {
      this.stop()
    }
  }

  private tick(timestamp: number) {
    if (timestamp - this.lastTime < this.frameTime) {
      this.rafId = requestAnimationFrame(this.tick)
      return
    }

    this.lastTime = timestamp

    // Execute all callbacks in priority order
    this.rafCallbacks.forEach((callback) => {
      try {
        callback(timestamp)
      } catch (error) {
        console.warn('RAF callback error:', error)
      }
    })

    this.rafId = requestAnimationFrame(this.tick)
  }

  private start() {
    if (!this.isRunning && this.rafCallbacks.size > 0) {
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
}

// Force GPU layer creation
export const forceGPULayer = (element: HTMLElement) => {
  element.style.transform = 'translateZ(0)'
  element.style.backfaceVisibility = 'hidden'
  element.style.willChange = 'transform'
}

// Optimize for 60fps animations
export const optimizeForAnimation = (element: HTMLElement) => {
  element.style.willChange = 'transform, opacity'
  element.style.transform = 'translate3d(0, 0, 0)'
  element.style.backfaceVisibility = 'hidden'
  element.style.webkitBackfaceVisibility = 'hidden'
}

// Debounce function for expensive operations
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle function for frequent operations
export const throttle = <T extends (...args: any[]) => void>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Memory-efficient object pooling
export class ObjectPool<T> {
  private pool: T[] = []
  private createFn: () => T
  private resetFn: (obj: T) => void

  constructor(createFn: () => T, resetFn: (obj: T) => void, initialSize = 10) {
    this.createFn = createFn
    this.resetFn = resetFn
    
    // Pre-populate pool
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.createFn())
    }
  }

  acquire(): T {
    if (this.pool.length > 0) {
      return this.pool.pop()!
    }
    return this.createFn()
  }

  release(obj: T) {
    this.resetFn(obj)
    this.pool.push(obj)
  }
}