import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { TechTreeD3Controller, TechNode, TechConnection } from '../game/TechTreeD3Controller'
import { useStore } from '../state/store'
import techTree from '../data/tech-tree.json'
import type { Branch } from '../state/techSlice'

interface LayoutNode extends TechNode {
  isPurchased: boolean
  isUnlocked: boolean
  canAfford: boolean
}

interface UseLayoutOptions {
  width: number
  height: number
  enabled?: boolean
}

export function useTechTreeLayout({ width, height, enabled = true }: UseLayoutOptions) {
  const [positions, setPositions] = useState<Map<string, { x: number, y: number, size?: number }>>(new Map())
  const [isStabilized, setIsStabilized] = useState(false)
  const controllerRef = useRef<TechTreeD3Controller | null>(null)
  const hasStabilizedOnceRef = useRef(false)
  const lastDataHashRef = useRef<string>('')
  const nodeSizesRef = useRef<Map<string, number>>(new Map())

  // Get data from store and tech tree
  const branches = (techTree as any).branches as Branch[]
  const purchased = useStore(s => s.purchased)
  const unlocked = useStore(s => s.unlocked)
  const revenue = useStore(s => s.resources.revenue)
  const nodeById = useStore(s => s.nodeById)
  const nodeToBranch = useStore(s => s.nodeToBranch)
  const discounts = useStore(s => s.discounts)

  // Initialize controller
  useEffect(() => {
    if (!enabled) return

    if (!controllerRef.current) {
      controllerRef.current = new TechTreeD3Controller()
    }

    return () => {
      controllerRef.current?.destroy()
      controllerRef.current = null
    }
  }, [enabled])

  // Create a hash of the actual data that matters for layout
  const layoutDataHash = useMemo(() => {
    if (!branches.length) return ''

    const relevantData = {
      nodeIds: branches.flatMap(b => b.nodes?.map(n => n.id) || []),
      purchasedIds: Object.keys(purchased).sort(),
      unlockedIds: Array.from(unlocked).sort(),
      connections: branches.flatMap(b =>
        b.nodes?.flatMap(n =>
          n.requires?.map(req => `${req.node}->${n.id}`) || []
        ) || []
      ).sort()
    }

    return JSON.stringify(relevantData)
  }, [branches, purchased, unlocked])

  // Transform store data into layout format only when hash changes
  const layoutData = useMemo(() => {
    if (!branches.length) return { nodes: [], connections: [] }

    const nodes: LayoutNode[] = []
    const connections: TechConnection[] = []

    // Helper function to check if node can afford (without using store function)
    const canAffordNode = (nodeId: string): boolean => {
      const node = nodeById[nodeId]
      if (!node || purchased[nodeId] || !unlocked.has(nodeId)) return false

      const branchKey = nodeToBranch[nodeId]
      const branchDiscount = discounts[branchKey] ?? 1
      const cost = node.baseCost * branchDiscount

      return revenue >= cost
    }

    branches.forEach(branch => {
      branch.nodes?.forEach(node => {
        const isPurchased = !!purchased[node.id]
        const isUnlocked = unlocked.has(node.id)
        const canAfford = canAffordNode(node.id)

        nodes.push({
          id: node.id,
          tier: node.tier,
          branch: branch.key,
          name: node.name,
          requires: node.requires,
          isPurchased,
          isUnlocked,
          canAfford
        })

        // Create connections from requirements
        if (node.requires) {
          node.requires.forEach(req => {
            connections.push({
              source: req.node,
              target: node.id,
              type: 'prerequisite'
            })
          })
        }
      })
    })

    return { nodes, connections }
  }, [layoutDataHash, revenue, branches, purchased, unlocked, nodeById, nodeToBranch, discounts])

  // Update controller only when structural data actually changes
  useEffect(() => {
    if (!controllerRef.current || !enabled || !layoutData.nodes.length) return

    // Only update if the hash has actually changed (structural changes)
    if (layoutDataHash !== lastDataHashRef.current) {
      console.log('Layout data changed, updating controller')
      lastDataHashRef.current = layoutDataHash

      controllerRef.current.updateData(layoutData.nodes, layoutData.connections)
      setIsStabilized(false)
      hasStabilizedOnceRef.current = false
    }
  }, [layoutDataHash, layoutData, enabled])

  // Update bounds when container size changes
  useEffect(() => {
    if (!controllerRef.current || !enabled) return

    controllerRef.current.updateBounds(width, height)
  }, [width, height, enabled])

  // Handle simulation tick updates with hard timeout
  useEffect(() => {
    if (!controllerRef.current || !enabled) return

    const controller = controllerRef.current
    let stableFrames = 0
    let lastPositionCheck: Map<string, { x: number, y: number }> | null = null

    // Hard timeout to force stabilization after 3 seconds
    const hardTimeout = setTimeout(() => {
      console.log('Hard timeout reached, forcing stabilization')
      controller.stabilize()
      setIsStabilized(true)
      hasStabilizedOnceRef.current = true
    }, 3000)

    let lastUpdateTime = 0
    const throttledUpdate = (nodes: TechNode[], links: TechConnection[]) => {
      const now = Date.now()
      if (now - lastUpdateTime > 16) { // 60fps throttling
        const newPositions = controller.getPositions()
        setPositions(new Map(newPositions))
        lastUpdateTime = now

        // Enhanced stability checking: compare position changes
        if (lastPositionCheck && !hasStabilizedOnceRef.current) {
          let maxMovement = 0
          newPositions.forEach((pos, nodeId) => {
            const lastPos = lastPositionCheck!.get(nodeId)
            if (lastPos) {
              const dx = pos.x - lastPos.x
              const dy = pos.y - lastPos.y
              const movement = Math.sqrt(dx * dx + dy * dy)
              maxMovement = Math.max(maxMovement, movement)
            }
          })

          // Consider stable if movement is very small
          if (maxMovement < 0.05 || controller.isStable()) {
            stableFrames++
            if (stableFrames > 15) { // 15 frames of minimal movement
              console.log('Natural stabilization achieved')
              clearTimeout(hardTimeout)
              controller.stabilize() // Force complete stop
              setIsStabilized(true)
              hasStabilizedOnceRef.current = true
            }
          } else {
            stableFrames = 0
          }
        }

        lastPositionCheck = new Map(newPositions)
      }
    }

    controller.onTick(throttledUpdate)
    controller.onEnd(() => {
      if (!hasStabilizedOnceRef.current) {
        console.log('Simulation ended naturally')
        clearTimeout(hardTimeout)
        controller.stabilize() // Ensure complete stabilization
        setIsStabilized(true)
        hasStabilizedOnceRef.current = true
      }
      const finalPositions = controller.getPositions()
      setPositions(new Map(finalPositions))
    })

    // Get initial positions immediately
    const initialPositions = controller.getPositions()
    setPositions(new Map(initialPositions))

    return () => {
      clearTimeout(hardTimeout)
    }
  }, [layoutDataHash])

  // Pin node at specific position
  const pinNode = useCallback((nodeId: string, x?: number, y?: number) => {
    if (controllerRef.current) {
      controllerRef.current.pinNode(nodeId, x, y)
    }
  }, [])

  // Unpin node to allow free movement
  const unpinNode = useCallback((nodeId: string) => {
    if (controllerRef.current) {
      controllerRef.current.unpinNode(nodeId)
    }
  }, [])

  // Reheat simulation (useful after major changes)
  const reheatSimulation = useCallback((alpha = 0.1) => {
    if (controllerRef.current) {
      // Only reheat if needed - unpin nodes first
      controllerRef.current.nodes.forEach(node => {
        node.fx = null
        node.fy = null
      })

      controllerRef.current.reheat(alpha)
      setIsStabilized(false)
    }
  }, [])

  // Get viewport bounds that encompass all nodes
  const viewportBounds = useMemo(() => {
    if (positions.size === 0) {
      return {
        minX: 0,
        minY: 0,
        maxX: width,
        maxY: height,
        width: width,
        height: height
      }
    }

    let minX = Infinity, minY = Infinity
    let maxX = -Infinity, maxY = -Infinity

    positions.forEach(({ x, y }) => {
      minX = Math.min(minX, x - 80) // node width buffer
      minY = Math.min(minY, y - 80) // node height buffer
      maxX = Math.max(maxX, x + 80)
      maxY = Math.max(maxY, y + 80)
    })

    return {
      minX,
      minY,
      maxX,
      maxY,
      width: maxX - minX,
      height: maxY - minY
    }
  }, [positions, width, height])

  // Utility functions for edge connection calculations
  const getEdgePoint = useCallback((fromPos: {x: number, y: number}, toPos: {x: number, y: number}, nodeSize: number, isSource: boolean) => {
    const dx = toPos.x - fromPos.x
    const dy = toPos.y - fromPos.y
    const angle = Math.atan2(dy, dx)

    // Node radius with small visual offset
    const nodeRadius = nodeSize / 2
    const visualOffset = 8 // Offset from node edge for cleaner appearance

    if (isSource) {
      // For source node, extend outward toward target
      return {
        x: fromPos.x + Math.cos(angle) * (nodeRadius + visualOffset),
        y: fromPos.y + Math.sin(angle) * (nodeRadius + visualOffset)
      }
    } else {
      // For target node, point inward from source
      return {
        x: toPos.x - Math.cos(angle) * (nodeRadius + visualOffset),
        y: toPos.y - Math.sin(angle) * (nodeRadius + visualOffset)
      }
    }
  }, [])

  const generateConnectionPath = useCallback((sourcePos: {x: number, y: number}, targetPos: {x: number, y: number}, sourceSize: number, targetSize: number) => {
    // Get proper edge connection points
    const sourceEdge = getEdgePoint(sourcePos, targetPos, sourceSize, true)
    const targetEdge = getEdgePoint(sourcePos, targetPos, targetSize, false)

    const dx = targetEdge.x - sourceEdge.x
    const dy = targetEdge.y - sourceEdge.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    // Use straight lines for short vertical connections (within same branch)
    if (Math.abs(dx) < 80 && dy > 0) {
      return `M${sourceEdge.x},${sourceEdge.y} L${targetEdge.x},${targetEdge.y}`
    }

    // Use curved paths for diagonal or horizontal connections
    const curvature = Math.min(distance * 0.4, 100)
    const controlPoint1 = {
      x: sourceEdge.x + dx * 0.3,
      y: sourceEdge.y + curvature * (dy > 0 ? 0.6 : -0.6)
    }

    const controlPoint2 = {
      x: targetEdge.x - dx * 0.3,
      y: targetEdge.y - curvature * (dy > 0 ? 0.6 : -0.6)
    }

    return `M${sourceEdge.x},${sourceEdge.y} C${controlPoint1.x},${controlPoint1.y} ${controlPoint2.x},${controlPoint2.y} ${targetEdge.x},${targetEdge.y}`
  }, [getEdgePoint])

  // Function to update node size info
  const updateNodeSize = useCallback((nodeId: string, size: number) => {
    nodeSizesRef.current.set(nodeId, size)
  }, [])

  // Get connections with calculated paths using proper edge connections
  const connectionPaths = useMemo(() => {
    return layoutData.connections.map(connection => {
      const sourcePos = positions.get(connection.source)
      const targetPos = positions.get(connection.target)

      if (!sourcePos || !targetPos) return null

      // Get node sizes (fallback to default if not set)
      const sourceSize = nodeSizesRef.current.get(connection.source) || sourcePos.size || 120
      const targetSize = nodeSizesRef.current.get(connection.target) || targetPos.size || 120

      // Generate proper path from edge to edge
      const path = generateConnectionPath(sourcePos, targetPos, sourceSize, targetSize)

      // Calculate edge points for arrow positioning
      const sourceEdge = getEdgePoint(sourcePos, targetPos, sourceSize, true)
      const targetEdge = getEdgePoint(sourcePos, targetPos, targetSize, false)

      return {
        ...connection,
        path,
        sourcePos: sourceEdge,
        targetPos: targetEdge,
        length: Math.sqrt(Math.pow(targetEdge.x - sourceEdge.x, 2) + Math.pow(targetEdge.y - sourceEdge.y, 2))
      }
    }).filter(Boolean)
  }, [layoutData.connections, positions, generateConnectionPath, getEdgePoint])

  return {
    positions,
    connections: connectionPaths,
    nodes: layoutData.nodes,
    viewportBounds,
    isStabilized,
    pinNode,
    unpinNode,
    reheatSimulation,
    updateNodeSize,
    enabled
  }
}