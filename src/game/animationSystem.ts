// Animation system for managing tech purchase effects
export interface AnimationEvent {
  id: string
  nodeId: string
  branchKey: string
  position: { x: number; y: number }
  timestamp: number
  tier: number
  effects: Array<{ text: string; kind: 'loc' | 'ship' | 'revenue' | 'global' }>
}

export class AnimationSystem {
  private static instance: AnimationSystem | null = null
  private listeners: Array<(event: AnimationEvent) => void> = []
  private eventQueue: AnimationEvent[] = []
  private isProcessing = false

  static getInstance(): AnimationSystem {
    if (!AnimationSystem.instance) {
      AnimationSystem.instance = new AnimationSystem()
    }
    return AnimationSystem.instance
  }

  subscribe(listener: (event: AnimationEvent) => void): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  triggerTechPurchaseAnimation(
    nodeId: string,
    branchKey: string,
    position: { x: number; y: number },
    tier: number,
    effects: Array<{ text: string; kind: 'loc' | 'ship' | 'revenue' | 'global' }>
  ): void {
    const event: AnimationEvent = {
      id: `${nodeId}-${Date.now()}`,
      nodeId,
      branchKey,
      position,
      timestamp: Date.now(),
      tier,
      effects
    }

    this.eventQueue.push(event)
    this.processQueue()
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.eventQueue.length === 0) return

    this.isProcessing = true

    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift()!

      // Notify all listeners
      this.listeners.forEach(listener => {
        try {
          listener(event)
        } catch (error) {
          console.warn('Animation listener error:', error)
        }
      })

      // Small delay between animations to prevent overwhelming
      if (this.eventQueue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 150))
      }
    }

    this.isProcessing = false
  }

  // Get branch colors from CSS variables
  getBranchColor(branchKey: string): string {
    const colorMap: Record<string, string> = {
      'A': '#46e6ff', // Programming - cyan
      'B': '#5aa6ff', // Automation - blue
      'C': '#8a5aff', // Infrastructure - purple
      'D': '#ff5aa6', // Testing - magenta
      'E': '#ff8a5a', // Agents - orange
      'F': '#5aff8a', // Revenue - green
      'G': '#ffff5a', // Market - yellow
      'H': '#ff5a5a', // Quality - red
    }
    return colorMap[branchKey] || '#5ad6a0' // fallback to default accent
  }

  // Get branch theme data for animations
  getBranchTheme(branchKey: string): { color: string; symbols: string[]; name: string } {
    const themes: Record<string, { color: string; symbols: string[]; name: string }> = {
      'A': {
        color: '#46e6ff',
        symbols: ['<', '>', '{', '}', '(', ')', ';', '='],
        name: 'Programming'
      },
      'B': {
        color: '#5aa6ff',
        symbols: ['⚡', '⚙', '🤖', '▶', '⏸', '⏹', '🔄', '↻'],
        name: 'Automation'
      },
      'C': {
        color: '#8a5aff',
        symbols: ['🌐', '🔧', '⚡', '📡', '🖥', '💾', '🔌', '⚙'],
        name: 'Infrastructure'
      },
      'D': {
        color: '#ff5aa6',
        symbols: ['✓', '✗', '?', '!', '🧪', '🔍', '📊', '🎯'],
        name: 'Testing'
      },
      'E': {
        color: '#ff8a5a',
        symbols: ['🤖', '👤', '🧠', '💭', '⚡', '🔄', '📈', '🎯'],
        name: 'Agents'
      },
      'F': {
        color: '#5aff8a',
        symbols: ['$', '💰', '📈', '💎', '🏆', '⭐', '💵', '📊'],
        name: 'Revenue'
      },
      'G': {
        color: '#ffff5a',
        symbols: ['🌍', '📊', '📈', '🎯', '🚀', '💼', '🏢', '📱'],
        name: 'Market'
      },
      'H': {
        color: '#ff5a5a',
        symbols: ['🛡', '✨', '🔧', '⚡', '🎯', '📊', '🏆', '💎'],
        name: 'Quality'
      }
    }
    return themes[branchKey] || themes['A']
  }
}

// Export singleton instance
export const animationSystem = AnimationSystem.getInstance()