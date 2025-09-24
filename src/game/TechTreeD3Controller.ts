import * as d3 from 'd3'

export interface TechNode {
  id: string
  tier: number
  branch: string
  name: string
  x?: number
  y?: number
  fx?: number | null // fixed x position
  fy?: number | null // fixed y position
  requires?: { node: string }[]
}

export interface TechConnection {
  source: string
  target: string
  type: 'prerequisite' | 'synergy'
}

export interface LayoutBounds {
  width: number
  height: number
  padding: number
}

export class TechTreeD3Controller {
  private simulation: d3.Simulation<TechNode, TechConnection> | null = null
  private nodes: TechNode[] = []
  private links: TechConnection[] = []
  private bounds: LayoutBounds = { width: 800, height: 600, padding: 50 }

  constructor() {
    this.setupSimulation()
  }

  private setupSimulation() {
    this.simulation = d3.forceSimulation<TechNode>()
      .force('link', d3.forceLink<TechNode, TechConnection>()
        .id(d => d.id)
        .distance(120)
        .strength(0.2))
      .force('charge', d3.forceManyBody()
        .strength(-300)
        .distanceMin(40)
        .distanceMax(200))
      .force('collision', d3.forceCollide<TechNode>()
        .radius(60)
        .strength(0.7))
      .force('x', d3.forceX<TechNode>()
        .x(d => this.getTargetX(d))
        .strength(0.8))
      .force('y', d3.forceY<TechNode>()
        .y(d => this.getTargetY(d))
        .strength(0.8))
      .alphaDecay(0.08)
      .velocityDecay(0.7)
      .alphaMin(0.001)
  }

  private getTargetX(node: TechNode): number {
    const branchSpacing = 300
    const baseX = 150
    const branchOrder = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
    const branchIndex = branchOrder.indexOf(node.branch)

    if (branchIndex >= 0) {
      return baseX + (branchIndex * branchSpacing)
    }
    return baseX // fallback
  }

  private getTargetY(node: TechNode): number {
    const tierSpacing = 180
    const baseY = 100
    return baseY + (node.tier * tierSpacing)
  }

  // Check for structural changes that require simulation restart
  private hasStructuralChanges(newNodes: TechNode[], newConnections: TechConnection[]): boolean {
    // Check if node count changed
    if (this.nodes.length !== newNodes.length) return true

    // Check if connection count changed
    if (this.links.length !== newConnections.length) return true

    // Check if node IDs changed
    const existingIds = new Set(this.nodes.map(n => n.id))
    const newIds = new Set(newNodes.map(n => n.id))
    if (existingIds.size !== newIds.size) return true
    for (const id of newIds) {
      if (!existingIds.has(id)) return true
    }

    // Check if connection structure changed
    const existingConnections = new Set(this.links.map(l => `${l.source}->${l.target}`))
    const incomingConnections = new Set(newConnections.map(l => `${l.source}->${l.target}`))
    if (existingConnections.size !== incomingConnections.size) return true
    for (const conn of incomingConnections) {
      if (!existingConnections.has(conn)) return true
    }

    return false
  }

  updateData(nodes: TechNode[], connections: TechConnection[]) {
    const hasStructuralChange = this.hasStructuralChanges(nodes, connections)

    // Preserve existing node positions
    const existingPositions = new Map<string, { x: number, y: number }>()
    this.nodes.forEach(node => {
      if (node.x !== undefined && node.y !== undefined) {
        existingPositions.set(node.id, { x: node.x, y: node.y })
      }
    })

    this.nodes = [...nodes]
    this.links = [...connections]

    // Initialize positions for new nodes and restore existing positions
    let hasNewNodes = false
    this.nodes.forEach(node => {
      const existing = existingPositions.get(node.id)
      if (existing) {
        // Restore existing position
        node.x = existing.x
        node.y = existing.y
      } else if (node.x === undefined || node.y === undefined) {
        // Initialize new node near its target position
        const targetX = this.getTargetX(node)
        const targetY = this.getTargetY(node)

        node.x = targetX + (Math.random() - 0.5) * 100
        node.y = targetY + (Math.random() - 0.5) * 60
        hasNewNodes = true
      }
    })

    if (this.simulation) {
      this.simulation
        .nodes(this.nodes)
        .force('link', d3.forceLink<TechNode, TechConnection>(this.links)
          .id(d => d.id)
          .distance(120)
          .strength(0.2))

      // Only restart simulation for structural changes or new nodes
      if (hasStructuralChange || hasNewNodes) {
        console.log('Structural changes detected, restarting simulation')
        this.simulation.alpha(0.15).restart()
      } else {
        // No structural changes - just update visual states, no restart needed
        console.log('No structural changes, skipping simulation restart')
      }
    }
  }

  updateBounds(width: number, height: number) {
    this.bounds = { width, height, padding: 50 }

    if (this.simulation) {
      this.simulation
        .force('center', d3.forceCenter(width / 2, height / 2))
        .alpha(0.1)
        .restart()
    }
  }

  onTick(callback: (nodes: TechNode[], links: TechConnection[]) => void) {
    if (this.simulation) {
      this.simulation.on('tick', () => {
        callback(this.nodes, this.links)
      })
    }
  }

  onEnd(callback: () => void) {
    if (this.simulation) {
      this.simulation.on('end', callback)
    }
  }

  // Pin a node at specific coordinates
  pinNode(nodeId: string, x?: number, y?: number) {
    const node = this.nodes.find(n => n.id === nodeId)
    if (node) {
      node.fx = x ?? node.x
      node.fy = y ?? node.y

      if (this.simulation) {
        this.simulation.alpha(0.1).restart()
      }
    }
  }

  // Unpin a node to let it move freely
  unpinNode(nodeId: string) {
    const node = this.nodes.find(n => n.id === nodeId)
    if (node) {
      node.fx = null
      node.fy = null

      if (this.simulation) {
        this.simulation.alpha(0.1).restart()
      }
    }
  }

  // Get current node positions with rounding to prevent micro-movements
  getPositions(): Map<string, { x: number, y: number, size?: number }> {
    const positions = new Map()
    for (const node of this.nodes) {
      positions.set(node.id, {
        x: Math.round((node.x || 0) * 10) / 10, // Round to 0.1 pixel
        y: Math.round((node.y || 0) * 10) / 10,
        size: 120 // Base node size - will be overridden by component
      })
    }
    return positions
  }

  // Check if simulation has effectively stabilized
  isStable(): boolean {
    if (!this.simulation) return true

    const alpha = this.simulation.alpha()
    return alpha < 0.005 // Much lower threshold for true stability
  }

  // Force stabilization by pinning all nodes to their rounded positions
  stabilize() {
    this.nodes.forEach(node => {
      if (node.x !== undefined && node.y !== undefined) {
        // Round positions and pin them
        node.x = Math.round(node.x * 10) / 10
        node.y = Math.round(node.y * 10) / 10
        node.fx = node.x
        node.fy = node.y
      }
    })

    if (this.simulation) {
      this.simulation.alpha(0).stop()
    }
  }

  // Stop simulation
  stop() {
    if (this.simulation) {
      this.simulation.stop()
    }
  }

  // Restart simulation with some energy
  reheat(alpha = 0.3) {
    if (this.simulation) {
      this.simulation.alpha(alpha).restart()
    }
  }

  destroy() {
    if (this.simulation) {
      this.simulation.stop()
      this.simulation = null
    }
    this.nodes = []
    this.links = []
  }
}