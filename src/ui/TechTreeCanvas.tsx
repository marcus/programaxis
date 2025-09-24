import React, { useRef, useEffect, useState, useCallback } from 'react'
import { useTechTreeLayout } from '../hooks/useTechTreeLayout'
import { DependencyRenderer } from './DependencyRenderer'
import { TechNodeComponent } from './TechNodeComponent'
import * as d3 from 'd3'

interface TechTreeCanvasProps {
  className?: string
}

export const TechTreeCanvas: React.FC<TechTreeCanvasProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 })
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 })
  const [isUserInteracting, setIsUserInteracting] = useState(false)
  const hasAutoFittedRef = useRef(false)

  // D3 zoom behavior
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<Element, unknown> | null>(null)

  // Use our layout hook
  const {
    positions,
    connections,
    nodes,
    viewportBounds,
    isStabilized,
    reheatSimulation,
    updateNodeSize
  } = useTechTreeLayout({
    width: containerSize.width,
    height: containerSize.height,
    enabled: true
  })

  // Handle container resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setContainerSize({
          width: Math.max(rect.width, 400),
          height: Math.max(rect.height, 300)
        })
      }
    }

    handleResize() // Initial size
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Setup D3 zoom behavior with touch support
  useEffect(() => {
    if (!containerRef.current) return

    const zoom = d3.zoom<HTMLDivElement, unknown>()
      .scaleExtent([0.3, 3])
      .filter((event) => {
        // Allow all mouse events and touch events
        // Prevent zoom on right-click context menu
        if (event.type === 'mousedown' && event.button === 2) return false
        return true
      })
      .on('start', (event) => {
        setIsUserInteracting(true)
        // Add active class for visual feedback
        if (containerRef.current) {
          containerRef.current.classList.add('panning')
        }
      })
      .on('zoom', (event) => {
        const { x, y, k } = event.transform
        setTransform({ x, y, k })
      })
      .on('end', (event) => {
        setIsUserInteracting(false)
        // Remove active class
        if (containerRef.current) {
          containerRef.current.classList.remove('panning')
        }
        // Reheat simulation slightly if user moved things around
        if (Math.abs(transform.x) > 10 || Math.abs(transform.y) > 10) {
          reheatSimulation(0.1)
        }
      })
      .touchable(true) // Enable touch support

    zoomBehaviorRef.current = zoom
    const selection = d3.select(containerRef.current)
    selection.call(zoom)

    // Disable native touch behaviors that interfere
    const element = containerRef.current
    const preventDefaultTouch = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault() // Prevent native pinch-to-zoom
      }
    }

    element.addEventListener('touchstart', preventDefaultTouch, { passive: false })
    element.addEventListener('touchmove', preventDefaultTouch, { passive: false })

    return () => {
      selection.on('.zoom', null)
      element.removeEventListener('touchstart', preventDefaultTouch)
      element.removeEventListener('touchmove', preventDefaultTouch)
    }
  }, [reheatSimulation, transform.x, transform.y])

  // Add touch gesture hints for mobile
  const [showGestureHint, setShowGestureHint] = useState(false)

  useEffect(() => {
    // Show gesture hint on mobile after a delay
    const isMobile = window.innerWidth <= 768
    if (isMobile && isStabilized) {
      const timer = setTimeout(() => setShowGestureHint(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [isStabilized])

  // Auto-fit viewport only once when layout first stabilizes
  useEffect(() => {
    if (!isStabilized || isUserInteracting || !containerRef.current || !zoomBehaviorRef.current || hasAutoFittedRef.current) return

    console.log('Performing one-time auto-fit')

    // Calculate optimal zoom and pan to fit all nodes
    const padding = 100
    const availableWidth = containerSize.width - padding * 2
    const availableHeight = containerSize.height - padding * 2

    if (viewportBounds.width > 0 && viewportBounds.height > 0) {
      const scaleX = availableWidth / viewportBounds.width
      const scaleY = availableHeight / viewportBounds.height
      const scale = Math.min(scaleX, scaleY, 1) // Don't zoom in beyond 1x

      const centerX = viewportBounds.minX + viewportBounds.width / 2
      const centerY = viewportBounds.minY + viewportBounds.height / 2

      const translateX = containerSize.width / 2 - centerX * scale
      const translateY = containerSize.height / 2 - centerY * scale

      const newTransform = d3.zoomIdentity
        .translate(translateX, translateY)
        .scale(scale)

      hasAutoFittedRef.current = true // Mark as auto-fitted

      d3.select(containerRef.current)
        .transition()
        .duration(750)
        .call(zoomBehaviorRef.current.transform, newTransform)
    }
  }, [isStabilized, viewportBounds, containerSize, isUserInteracting])

  // Handle node click for purchasing
  const handleNodeClick = useCallback((nodeId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    // The TechNodeComponent will handle the actual purchase logic
  }, [])

  // Render loading state
  if (nodes.length === 0) {
    return (
      <div className={`tech-tree-canvas ${className || ''}`} ref={containerRef}>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <div className="loading-text">Initializing tech tree...</div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`tech-tree-canvas ${className || ''}`}
      ref={containerRef}
    >
      {/* Main content with zoom/pan transform */}
      <div
        className="tech-tree-content"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.k})`,
          transformOrigin: '0 0',
          position: 'absolute',
          width: '100%',
          height: '100%'
        }}
      >
        {/* SVG for connection lines */}
        <DependencyRenderer
          connections={connections}
          transform={transform}
          isStabilized={isStabilized}
        />

        {/* Tech nodes */}
        <div className="nodes-container">
          {nodes.map(node => {
            const position = positions.get(node.id)
            if (!position) return null

            return (
              <TechNodeComponent
                key={node.id}
                node={node}
                position={position}
                onClick={handleNodeClick}
                scale={transform.k}
                onSizeChange={updateNodeSize}
              />
            )
          })}
        </div>
      </div>

      {/* UI Controls */}
      <div className="canvas-controls">
        {/* Zoom controls */}
        <div className="zoom-controls">
          <button
            className="zoom-btn"
            onClick={() => {
              if (containerRef.current && zoomBehaviorRef.current) {
                d3.select(containerRef.current)
                  .transition()
                  .duration(300)
                  .call(zoomBehaviorRef.current.scaleBy, 1.5)
              }
            }}
          >
            +
          </button>
          <button
            className="zoom-btn"
            onClick={() => {
              if (containerRef.current && zoomBehaviorRef.current) {
                d3.select(containerRef.current)
                  .transition()
                  .duration(300)
                  .call(zoomBehaviorRef.current.scaleBy, 1 / 1.5)
              }
            }}
          >
            −
          </button>
        </div>

        {/* Fit to view button */}
        <button
          className="fit-view-btn tron-button"
          onClick={() => {
            if (!containerRef.current || !zoomBehaviorRef.current) return

            console.log('Manual fit-all triggered')

            // Calculate and apply fit transform immediately
            const padding = 100
            const availableWidth = containerSize.width - padding * 2
            const availableHeight = containerSize.height - padding * 2

            if (viewportBounds.width > 0 && viewportBounds.height > 0) {
              const scaleX = availableWidth / viewportBounds.width
              const scaleY = availableHeight / viewportBounds.height
              const scale = Math.min(scaleX, scaleY, 1)

              const centerX = viewportBounds.minX + viewportBounds.width / 2
              const centerY = viewportBounds.minY + viewportBounds.height / 2

              const translateX = containerSize.width / 2 - centerX * scale
              const translateY = containerSize.height / 2 - centerY * scale

              const newTransform = d3.zoomIdentity
                .translate(translateX, translateY)
                .scale(scale)

              d3.select(containerRef.current)
                .transition()
                .duration(500)
                .call(zoomBehaviorRef.current.transform, newTransform)
            }
          }}
        >
          Fit All
        </button>

        {/* Layout status */}
        <div className="layout-status">
          {!isStabilized && (
            <div className="layout-calculating">
              <div className="status-spinner"></div>
              <span>Calculating layout...</span>
            </div>
          )}
        </div>
      </div>

      {/* Mobile gesture hint */}
      {showGestureHint && (
        <div
          className="gesture-hint"
          onClick={() => setShowGestureHint(false)}
        >
          <div className="hint-content">
            <div className="hint-title">Touch Gestures</div>
            <div className="hint-actions">
              <div className="hint-action">
                <span className="hint-icon">👆</span>
                <span>Tap to select nodes</span>
              </div>
              <div className="hint-action">
                <span className="hint-icon">🤏</span>
                <span>Pinch to zoom</span>
              </div>
              <div className="hint-action">
                <span className="hint-icon">👋</span>
                <span>Drag to pan</span>
              </div>
            </div>
            <button className="hint-dismiss">Got it</button>
          </div>
        </div>
      )}

      {/* Mini-map (for larger screens) */}
      <div className="mini-map">
        {/* TODO: Implement mini-map component */}
      </div>
    </div>
  )
}