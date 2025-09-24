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
  private animationThrottle = 80 // More aggressive throttling
  private performanceMode = 'medium' // Start at medium instead of high
  private frameCount = 0
  private fps = 60
  private batteryAware = false

  static getInstance(): ActionAnimationSystem {
    if (!ActionAnimationSystem.instance) {
      ActionAnimationSystem.instance = new ActionAnimationSystem()
      ActionAnimationSystem.instance.detectBatteryMode()
    }
    return ActionAnimationSystem.instance
  }

  // Detect battery saver mode or low battery
  private async detectBatteryMode(): Promise<void> {
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery()
        this.batteryAware = !battery.charging && battery.level < 0.3
        if (this.batteryAware) {
          this.performanceMode = 'low'
          this.animationThrottle = 200
        }

        // Listen for battery changes
        battery.addEventListener('levelchange', () => {
          const wasAware = this.batteryAware
          this.batteryAware = !battery.charging && battery.level < 0.3
          if (this.batteryAware !== wasAware) {
            this.performanceMode = this.batteryAware ? 'low' : 'medium'
            this.animationThrottle = this.batteryAware ? 200 : 80
          }
        })
      } catch (e) {
        // Battery API not supported, continue normally
      }
    }

    // Also check for reduced motion preference
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.performanceMode = 'low'
      this.animationThrottle = 300
    }
  }

  subscribe(listener: (event: ActionAnimationEvent) => void): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  // Monitor performance and adjust quality aggressively
  updatePerformance(deltaTime: number): void {
    this.frameCount++
    if (this.frameCount % 30 === 0) { // Check more frequently (every 30 frames)
      this.fps = Math.min(this.fps * 0.9 + (1000 / deltaTime) * 0.1, 1000 / deltaTime) // Smooth FPS calculation

      // More aggressive performance degradation for battery saving
      if (this.batteryAware || this.fps < 25) {
        this.performanceMode = 'low'
        this.animationThrottle = 300
      } else if (this.fps < 40) {
        this.performanceMode = 'medium'
        this.animationThrottle = 150
      } else if (this.fps < 55) {
        this.performanceMode = 'medium'
        this.animationThrottle = 100
      } else {
        // Only allow high mode if battery is not a concern and FPS is good
        if (!this.batteryAware) {
          this.performanceMode = 'high'
          this.animationThrottle = 80
        }
      }
    }
  }

  getPerformanceSettings() {
    switch (this.performanceMode) {
      case 'low':
        return { particleCount: 2, duration: 150, quality: 0.3 } // Reduced significantly
      case 'medium':
        return { particleCount: 4, duration: 200, quality: 0.5 } // Reduced significantly
      case 'high':
      default:
        return { particleCount: 6, duration: 250, quality: 0.6 } // Reduced by 50%
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
        particleCount: settings.particleCount, // Use the reduced settings directly
        duration: settings.duration, // Use the reduced settings directly
        symbols: ['<', '>', '{', '}'],
        color: '#5ad6a0',
        motion: 'float-up',
        gravity: 20, // Gentler physics
        spread: 15, // Much tighter spread
        size: [1.5, 2.5] // Smaller sparks for efficiency
      },
      'ship-build': {
        particleCount: settings.particleCount,
        duration: settings.duration,
        symbols: ['📦', '🚀'],
        color: '#ffca5f',
        motion: 'radial-burst',
        gravity: 40, // Much gentler fall
        spread: 20, // Tighter spread
        size: [2, 3] // Smaller particles
      },
      'pay-debt': {
        particleCount: settings.particleCount,
        duration: settings.duration,
        symbols: ['💸', '🔧'],
        color: '#f45b69',
        motion: 'spiral-dissolve',
        gravity: 15, // Very gentle
        spread: 18, // Tight spread
        size: [1.5, 2.5] // Small particles
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