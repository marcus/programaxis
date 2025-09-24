import React, { useMemo, useRef, useEffect } from 'react'

interface Connection {
  source: string
  target: string
  type: 'prerequisite' | 'synergy'
  path?: string
  sourcePos?: { x: number, y: number }
  targetPos?: { x: number, y: number }
  length?: number
}

interface DependencyRendererProps {
  connections: Array<Connection | null>
  transform: { x: number, y: number, k: number }
  isStabilized: boolean
}

export const DependencyRenderer: React.FC<DependencyRendererProps> = ({
  connections,
  transform,
  isStabilized
}) => {
  const svgRef = useRef<SVGSVGElement>(null)

  // Filter out null connections and prepare them for rendering
  const validConnections = useMemo(() => {
    return connections.filter((conn): conn is Connection =>
      conn !== null &&
      conn.sourcePos !== undefined &&
      conn.targetPos !== undefined &&
      conn.path !== undefined
    )
  }, [connections])

  // Create unique gradient and marker IDs for each connection
  const connectionElements = useMemo(() => {
    return validConnections.map((connection, index) => {
      const uniqueId = `${connection.source}-${connection.target}-${index}`

      // Choose colors based on connection type and status
      const getConnectionTheme = () => {
        if (connection.type === 'synergy') {
          return {
            color: '#ff7ad9', // Pink for synergy
            glowColor: 'rgba(255, 122, 217, 0.4)',
            opacity: 0.6
          }
        }

        // Default prerequisite styling
        return {
          color: '#5ad6a0', // Accent green
          glowColor: 'rgba(90, 214, 160, 0.4)',
          opacity: 0.7
        }
      }

      const theme = getConnectionTheme()

      return {
        id: uniqueId,
        connection,
        theme,
        gradientId: `gradient-${uniqueId}`,
        markerId: `marker-${uniqueId}`,
        glowId: `glow-${uniqueId}`
      }
    })
  }, [validConnections])

  // Update SVG viewBox to cover the transformed area
  const viewBox = useMemo(() => {
    if (validConnections.length === 0) return "0 0 800 600"

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity

    validConnections.forEach(conn => {
      if (conn.sourcePos && conn.targetPos) {
        minX = Math.min(minX, conn.sourcePos.x, conn.targetPos.x)
        minY = Math.min(minY, conn.sourcePos.y, conn.targetPos.y)
        maxX = Math.max(maxX, conn.sourcePos.x, conn.targetPos.x)
        maxY = Math.max(maxY, conn.sourcePos.y, conn.targetPos.y)
      }
    })

    const padding = 100
    const width = Math.max(maxX - minX + padding * 2, 800)
    const height = Math.max(maxY - minY + padding * 2, 600)

    return `${minX - padding} ${minY - padding} ${width} ${height}`
  }, [validConnections])

  // Animate energy flow along paths when stabilized
  useEffect(() => {
    if (!isStabilized || !svgRef.current) return

    const lines = svgRef.current.querySelectorAll('.energy-flow')

    lines.forEach((line, index) => {
      const element = line as SVGLineElement
      const pathLength = element.getTotalLength?.() || 100

      // Stagger animation start times
      const delay = index * 200

      // Create flowing animation
      element.style.strokeDasharray = `10 ${pathLength}`
      element.style.strokeDashoffset = `${pathLength + 10}`
      element.style.animation = `energyFlow 2s infinite linear ${delay}ms`
    })
  }, [isStabilized, connectionElements])

  if (validConnections.length === 0) {
    return null
  }

  return (
    <svg
      ref={svgRef}
      className="dependency-renderer"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'visible'
      }}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Define gradients, markers, and filters for each connection */}
        {connectionElements.map(({ id, theme, gradientId, markerId, glowId }) => (
          <g key={id}>
            {/* Gradient for the connection line */}
            <linearGradient id={gradientId} gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={theme.color} stopOpacity="0.3" />
              <stop offset="50%" stopColor={theme.color} stopOpacity={theme.opacity} />
              <stop offset="100%" stopColor={theme.color} stopOpacity="0.3" />
            </linearGradient>

            {/* Arrow marker */}
            <marker
              id={markerId}
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="5"
              orient="auto"
              markerUnits="userSpaceOnUse"
              viewBox="0 0 10 10"
            >
              <polygon
                points="0,2 0,8 8,5"
                fill={theme.color}
                opacity={theme.opacity}
                filter={`url(#${glowId})`}
              />
            </marker>

            {/* Glow filter */}
            <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </g>
        ))}
      </defs>

      {/* Render connection lines */}
      {connectionElements.map(({ id, connection, theme, gradientId, markerId, glowId }) => (
        <g key={id} className="connection-group">
          {/* Glow background line */}
          <path
            d={connection.path}
            stroke={theme.glowColor}
            strokeWidth="6"
            fill="none"
            opacity="0.3"
            filter={`url(#${glowId})`}
            className="connection-glow"
          />

          {/* Main connection line */}
          <path
            d={connection.path}
            stroke={`url(#${gradientId})`}
            strokeWidth="2"
            fill="none"
            markerEnd={`url(#${markerId})`}
            className={`connection-line ${connection.type}`}
            style={{
              strokeDasharray: connection.type === 'synergy' ? '8,4' : 'none'
            }}
          />

          {/* Energy flow animation line (only when stabilized) */}
          {isStabilized && (
            <path
              d={connection.path}
              stroke={theme.color}
              strokeWidth="3"
              fill="none"
              opacity="0.8"
              className="energy-flow"
              style={{
                filter: `drop-shadow(0 0 4px ${theme.glowColor})`
              }}
            />
          )}
        </g>
      ))}
    </svg>
  )
}