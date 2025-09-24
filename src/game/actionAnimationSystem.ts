// Lightweight animation system for button action effects
export interface ActionAnimationEvent {
  id: string
  type: 'write-code' | 'ship-build' | 'pay-debt'
  position: { x: number; y: number }
  timestamp: number
  intensity?: number // 0-1 for scaling effects based on action magnitude
}

export class ActionAnimationSystem {
  private static instance: ActionAnimationSystem | null = null
  private listeners: Array<(event: ActionAnimationEvent) => void> = []
  private eventQueue: ActionAnimationEvent[] = []
  private isProcessing = false
  private lastAnimationTime = 0
  private animationThrottle = 50 // Minimum ms between animations
  private performanceMode = 'high' // 'high', 'medium', 'low'
  private frameCount = 0
  private fps = 60

  static getInstance(): ActionAnimationSystem {
    if (!ActionAnimationSystem.instance) {
      ActionAnimationSystem.instance = new ActionAnimationSystem()
    }
    return ActionAnimationSystem.instance
  }

  subscribe(listener: (event: ActionAnimationEvent) => void): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  // Monitor performance and adjust quality
  updatePerformance(deltaTime: number): void {
    this.frameCount++
    if (this.frameCount % 60 === 0) { // Check every 60 frames
      this.fps = 1000 / deltaTime

      if (this.fps < 30) {
        this.performanceMode = 'low'
        this.animationThrottle = 200
      } else if (this.fps < 50) {
        this.performanceMode = 'medium'
        this.animationThrottle = 100
      } else {
        this.performanceMode = 'high'
        this.animationThrottle = 50
      }
    }
  }

  getPerformanceSettings() {
    switch (this.performanceMode) {
      case 'low':
        return { particleCount: 4, duration: 280, quality: 0.4 }
      case 'medium':
        return { particleCount: 7, duration: 350, quality: 0.6 }
      case 'high':
      default:
        return { particleCount: 12, duration: 420, quality: 0.8 } // Dialed back 30%
    }
  }

  triggerWriteCodeAnimation(position: { x: number; y: number }, intensity = 1): void {
    this.triggerAnimation('write-code', position, intensity)
  }

  triggerShipBuildAnimation(position: { x: number; y: number }, intensity = 1): void {
    this.triggerAnimation('ship-build', position, intensity)
  }

  triggerPayDebtAnimation(position: { x: number; y: number }, intensity = 1): void {
    this.triggerAnimation('pay-debt', position, intensity)
  }

  private triggerAnimation(
    type: ActionAnimationEvent['type'],
    position: { x: number; y: number },
    intensity: number
  ): void {
    const now = Date.now()

    // Throttle animations to prevent performance issues
    if (now - this.lastAnimationTime < this.animationThrottle) {
      return
    }

    this.lastAnimationTime = now

    const event: ActionAnimationEvent = {
      id: `${type}-${now}`,
      type,
      position,
      timestamp: now,
      intensity: Math.min(1, Math.max(0, intensity))
    }

    this.eventQueue.push(event)
    this.processQueue()
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.eventQueue.length === 0) return

    this.isProcessing = true

    // Process multiple events quickly to avoid queue buildup
    const batchSize = this.performanceMode === 'low' ? 1 : 3

    for (let i = 0; i < batchSize && this.eventQueue.length > 0; i++) {
      const event = this.eventQueue.shift()!

      // Notify all listeners
      this.listeners.forEach(listener => {
        try {
          listener(event)
        } catch (error) {
          console.warn('Action animation listener error:', error)
        }
      })

      // Small delay between batch events
      if (i < batchSize - 1 && this.eventQueue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 10))
      }
    }

    this.isProcessing = false

    // Process remaining queue if needed
    if (this.eventQueue.length > 0) {
      setTimeout(() => this.processQueue(), 16) // ~60fps
    }
  }

  // Get animation configuration for each action type
  getAnimationConfig(type: ActionAnimationEvent['type']) {
    const settings = this.getPerformanceSettings()

    const baseConfigs = {
      'write-code': {
        particleCount: Math.round(settings.particleCount * 0.5), // Reduced by ~30%
        duration: settings.duration * 0.7, // Shorter
        symbols: ['<', '>', '{', '}', ';', '=', '(', ')'],
        color: '#5ad6a0',
        motion: 'float-up',
        gravity: -30, // Less aggressive
        spread: 25, // Tighter spread
        size: [1.5, 3.5] // Smaller sparks
      },
      'ship-build': {
        particleCount: Math.round(settings.particleCount * 0.6), // Reduced
        duration: settings.duration * 0.8, // Shorter
        symbols: ['📦', '🚀', '⚡', '✨'],
        color: '#ffca5f',
        motion: 'radial-burst',
        gravity: 80, // Less dramatic fall
        spread: 35, // Tighter spread
        size: [2, 5] // Smaller particles
      },
      'pay-debt': {
        particleCount: Math.round(settings.particleCount * 0.7), // Reduced
        duration: settings.duration * 0.85, // Shorter
        symbols: ['💸', '💰', '🔧', '✨'],
        color: '#f45b69',
        motion: 'spiral-dissolve',
        gravity: 20, // Gentler
        spread: 30, // Tighter spread
        size: [1.5, 4] // Smaller
      }
    }

    return {
      ...baseConfigs[type],
      quality: settings.quality
    }
  }

  // Debug info
  getStats() {
    return {
      performanceMode: this.performanceMode,
      fps: this.fps,
      queueLength: this.eventQueue.length,
      listeners: this.listeners.length,
      throttle: this.animationThrottle
    }
  }
}

// Export singleton instance
export const actionAnimationSystem = ActionAnimationSystem.getInstance()