import React, { useEffect, useState, useRef } from 'react'
import { getMilestoneTheme, interpolateTheme, MilestoneTheme } from '../utils/milestoneThemes'

interface MilestoneBackgroundProps {
  currentMilestoneId: string
  nextMilestoneId?: string
  progress: number // 0-100
  isAchieving?: boolean // True when milestone was just achieved
  children: React.ReactNode
  onAchievementAnimationComplete?: () => void
}

export const MilestoneBackground: React.FC<MilestoneBackgroundProps> = ({
  currentMilestoneId,
  nextMilestoneId,
  progress,
  isAchieving = false,
  children,
  onAchievementAnimationComplete
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showAchievementEffect, setShowAchievementEffect] = useState(false)
  const backgroundRef = useRef<HTMLDivElement>(null)
  const achievementTimeoutRef = useRef<NodeJS.Timeout>()

  // Get current and next themes
  const currentTheme = getMilestoneTheme(currentMilestoneId)
  const nextTheme = nextMilestoneId ? getMilestoneTheme(nextMilestoneId) : currentTheme

  // Calculate interpolated theme based on progress
  const progressFactor = Math.min(progress / 100, 1)
  const activeTheme = nextMilestoneId
    ? { ...currentTheme, ...interpolateTheme(currentTheme, nextTheme, progressFactor) }
    : currentTheme

  // Handle achievement animation
  useEffect(() => {
    if (isAchieving) {
      setShowAchievementEffect(true)
      setIsTransitioning(true)

      // Clear any existing timeout
      if (achievementTimeoutRef.current) {
        clearTimeout(achievementTimeoutRef.current)
      }

      // Achievement animation sequence
      achievementTimeoutRef.current = setTimeout(() => {
        setShowAchievementEffect(false)
        setIsTransitioning(false)
        onAchievementAnimationComplete?.()
      }, 3000) // 3 second achievement animation
    }

    return () => {
      if (achievementTimeoutRef.current) {
        clearTimeout(achievementTimeoutRef.current)
      }
    }
  }, [isAchieving, onAchievementAnimationComplete])

  // Dynamic particle count based on milestone tier
  const getParticleCount = (milestoneId: string): number => {
    if (milestoneId === 'M_10T') return 20 // Reality Architect gets most particles
    if (milestoneId.includes('T')) return 15
    if (milestoneId.includes('B')) return 12
    if (milestoneId.includes('M')) return 8
    return 5
  }

  const particleCount = getParticleCount(currentMilestoneId)

  // Create particle elements
  const particles = Array.from({ length: particleCount }, (_, i) => (
    <div
      key={i}
      className="milestone-particle"
      style={{
        '--particle-color': activeTheme.particleColor,
        '--animation-delay': `${i * 0.5}s`,
        '--particle-size': `${2 + Math.random() * 3}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      } as React.CSSProperties}
    />
  ))

  return (
    <div
      ref={backgroundRef}
      className={`milestone-background ${isTransitioning ? 'transitioning' : ''} ${showAchievementEffect ? 'achieving' : ''}`}
      style={{
        '--milestone-gradient': activeTheme.gradient,
        '--milestone-glow': activeTheme.glowColor,
        '--milestone-border-glow': activeTheme.borderGlow,
        '--milestone-text-shadow': activeTheme.textShadow,
        '--particle-color': activeTheme.particleColor,
        '--progress-factor': progressFactor,
      } as React.CSSProperties}
    >
      {/* Background gradient layer */}
      <div className="milestone-bg-gradient" />

      {/* Animated particles */}
      <div className="milestone-particles">
        {particles}
      </div>

      {/* Progress-based shimmer effect */}
      {nextMilestoneId && progress > 75 && (
        <div
          className="milestone-progress-shimmer"
          style={{
            opacity: (progress - 75) / 25, // Fade in from 75% to 100%
          }}
        />
      )}

      {/* Achievement flash effect */}
      {showAchievementEffect && (
        <>
          <div className="achievement-flash" />
          <div className="achievement-ripple" />
          <div className="achievement-burst">
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                className="burst-particle"
                style={{
                  '--burst-angle': `${i * 30}deg`,
                  '--burst-color': activeTheme.particleColor,
                } as React.CSSProperties}
              />
            ))}
          </div>
        </>
      )}

      {/* Content with optimized text contrast */}
      <div
        className="milestone-content"
        style={{
          textShadow: activeTheme.textShadow,
          color: activeTheme.luminance > 0.6 ? '#2c3e50' : '#ecf0f1'
        }}
      >
        {children}
      </div>
    </div>
  )
}