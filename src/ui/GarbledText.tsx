import React, { useState, useEffect } from 'react'
import { GarbledText as GT, GarbledStyle } from '../utils/garbledText'

interface GarbledTextProps {
  children: string
  isLocked: boolean
  category?: string
  style?: GarbledStyle
  animated?: boolean
  revealOnHover?: boolean
  className?: string
}

export const GarbledText: React.FC<GarbledTextProps> = ({
  children,
  isLocked,
  category = '',
  style,
  animated = true,
  revealOnHover = false,
  className = ''
}) => {
  const [displayText, setDisplayText] = useState(children)
  const [isRevealing, setIsRevealing] = useState(false)

  // Determine garbling style based on category if not provided
  const getGarbledStyle = (): GarbledStyle => {
    if (style) return style

    // Category-specific styles for tech branches
    const categoryStyles: Record<string, GarbledStyle> = {
      'A': 'glitched',    // AI Models
      'B': 'fragmented', // Editor
      'C': 'static',     // Hardware
      'D': 'redacted',   // Workspace
      'E': 'encrypted',  // Agents
      'F': 'corrupted',  // Marketing
      'G': 'glitched',   // Platforms
      'H': 'static'      // Graphics
    }

    return categoryStyles[category] || 'corrupted'
  }

  const garbledStyle = getGarbledStyle()

  // Update display text based on lock state and animation
  useEffect(() => {
    if (!isLocked) {
      setDisplayText(children)
      return
    }

    if (isRevealing && revealOnHover) {
      // Gradually reveal text on hover (but only partially)
      const revealSteps = 8
      const maxReveal = 0.3 // Only reveal 30% max
      let step = 0

      const revealInterval = setInterval(() => {
        const progress = (step / revealSteps) * maxReveal
        const revealed = GT.garble(children, garbledStyle, 1 - progress, 42)
        setDisplayText(revealed)

        step++
        if (step > revealSteps) {
          clearInterval(revealInterval)
        }
      }, 75)

      return () => clearInterval(revealInterval)
    }

    if (animated) {
      // Animated garbling effect (slower update)
      const interval = setInterval(() => {
        const garbled = GT.time(children, Date.now())
        setDisplayText(garbled)
      }, 1200) // Matches the timeGarble cycle time

      return () => clearInterval(interval)
    } else {
      // Static garbled text based on category
      const garbled = GT.tech(children, category)
      setDisplayText(garbled)
    }
  }, [isLocked, children, animated, isRevealing, revealOnHover, category, garbledStyle])

  const handleMouseEnter = () => {
    if (revealOnHover && isLocked) {
      setIsRevealing(true)
    }
  }

  const handleMouseLeave = () => {
    if (revealOnHover && isLocked) {
      setIsRevealing(false)
    }
  }

  if (!isLocked) {
    return <span className={className}>{children}</span>
  }

  return (
    <span
      className={`garbled-text ${garbledStyle} ${animated ? 'animated' : ''} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      title={revealOnHover ? "Hover to partially decode..." : "Technology locked"}
    >
      {displayText}
    </span>
  )
}