export interface MilestoneTheme {
  id: string
  name: string
  gradient: string
  glowColor: string
  particleColor: string
  textShadow: string
  borderGlow: string
  luminance: number // 0-1, used for text contrast
}

export const milestoneThemes: Record<string, MilestoneTheme> = {
  'M_0': {
    id: 'M_0',
    name: 'Garage Hacker',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    glowColor: 'rgba(94, 84, 142, 0.3)',
    particleColor: '#5e548e',
    textShadow: '0 2px 4px rgba(0,0,0,0.7)',
    borderGlow: '0 0 20px rgba(94, 84, 142, 0.4)',
    luminance: 0.15
  },
  'M_1K': {
    id: 'M_1K',
    name: 'First Sale',
    gradient: 'linear-gradient(135deg, #0f3460 0%, #16213e 50%, #1e5128 100%)',
    glowColor: 'rgba(30, 81, 40, 0.4)',
    particleColor: '#2d6a4f',
    textShadow: '0 2px 4px rgba(0,0,0,0.8)',
    borderGlow: '0 0 20px rgba(30, 81, 40, 0.5)',
    luminance: 0.2
  },
  'M_10K': {
    id: 'M_10K',
    name: 'Micro-Studio',
    gradient: 'linear-gradient(135deg, #1e5128 0%, #2d6a4f 50%, #1b4f72 100%)',
    glowColor: 'rgba(27, 79, 114, 0.4)',
    particleColor: '#3498db',
    textShadow: '0 2px 4px rgba(0,0,0,0.7)',
    borderGlow: '0 0 20px rgba(27, 79, 114, 0.5)',
    luminance: 0.25
  },
  'M_100K': {
    id: 'M_100K',
    name: 'Tooling Pays Off',
    gradient: 'linear-gradient(135deg, #1b4f72 0%, #2980b9 50%, #17a2b8 100%)',
    glowColor: 'rgba(23, 162, 184, 0.4)',
    particleColor: '#17a2b8',
    textShadow: '0 2px 4px rgba(0,0,0,0.6)',
    borderGlow: '0 0 25px rgba(23, 162, 184, 0.5)',
    luminance: 0.35
  },
  'M_1M': {
    id: 'M_1M',
    name: 'Indie Darling',
    gradient: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 50%, #fd79a8 100%)',
    glowColor: 'rgba(253, 121, 168, 0.4)',
    particleColor: '#fd79a8',
    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
    borderGlow: '0 0 25px rgba(253, 121, 168, 0.5)',
    luminance: 0.5
  },
  'M_10M': {
    id: 'M_10M',
    name: 'Live-Ops On',
    gradient: 'linear-gradient(135deg, #d63031 0%, #e17055 50%, #fdcb6e 100%)',
    glowColor: 'rgba(253, 203, 110, 0.4)',
    particleColor: '#fdcb6e',
    textShadow: '0 2px 4px rgba(0,0,0,0.6)',
    borderGlow: '0 0 30px rgba(253, 203, 110, 0.5)',
    luminance: 0.6
  },
  'M_100M': {
    id: 'M_100M',
    name: 'Brand Found',
    gradient: 'linear-gradient(135deg, #f39c12 0%, #f1c40f 50%, #e67e22 100%)',
    glowColor: 'rgba(241, 196, 15, 0.5)',
    particleColor: '#f1c40f',
    textShadow: '0 2px 4px rgba(0,0,0,0.7)',
    borderGlow: '0 0 30px rgba(241, 196, 15, 0.6)',
    luminance: 0.7
  },
  'M_1B': {
    id: 'M_1B',
    name: 'Global Hit',
    gradient: 'linear-gradient(135deg, #00b894 0%, #00cec9 50%, #55a3ff 100%)',
    glowColor: 'rgba(0, 206, 201, 0.5)',
    particleColor: '#00cec9',
    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
    borderGlow: '0 0 35px rgba(0, 206, 201, 0.6)',
    luminance: 0.6
  },
  'M_10B': {
    id: 'M_10B',
    name: 'Studio Group',
    gradient: 'linear-gradient(135deg, #3742fa 0%, #5352ed 50%, #70a1ff 100%)',
    glowColor: 'rgba(112, 161, 255, 0.5)',
    particleColor: '#70a1ff',
    textShadow: '0 2px 4px rgba(0,0,0,0.6)',
    borderGlow: '0 0 35px rgba(112, 161, 255, 0.6)',
    luminance: 0.5
  },
  'M_100B': {
    id: 'M_100B',
    name: 'Platform Owner',
    gradient: 'linear-gradient(135deg, #8e44ad 0%, #9b59b6 50%, #bb6bd9 100%)',
    glowColor: 'rgba(187, 107, 217, 0.5)',
    particleColor: '#bb6bd9',
    textShadow: '0 2px 4px rgba(0,0,0,0.6)',
    borderGlow: '0 0 40px rgba(187, 107, 217, 0.6)',
    luminance: 0.45
  },
  'M_1T': {
    id: 'M_1T',
    name: 'Cultural Monopoly',
    gradient: 'linear-gradient(135deg, #7f8c8d 0%, #bdc3c7 50%, #ecf0f1 100%)',
    glowColor: 'rgba(236, 240, 241, 0.6)',
    particleColor: '#ecf0f1',
    textShadow: '0 2px 4px rgba(0,0,0,0.8)',
    borderGlow: '0 0 40px rgba(236, 240, 241, 0.7)',
    luminance: 0.8
  },
  'M_10T': {
    id: 'M_10T',
    name: 'Reality Architect',
    gradient: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 25%, #45b7d1 50%, #96ceb4 75%, #ffeaa7 100%)',
    glowColor: 'rgba(255, 255, 255, 0.6)',
    particleColor: '#ffffff',
    textShadow: '0 2px 4px rgba(0,0,0,0.7)',
    borderGlow: '0 0 50px rgba(255, 255, 255, 0.8)',
    luminance: 0.75
  }
}

// Utility function to interpolate between two colors
export function interpolateColor(color1: string, color2: string, factor: number): string {
  if (factor <= 0) return color1
  if (factor >= 1) return color2

  // Extract RGB values from hex colors
  const hex1 = color1.replace('#', '')
  const hex2 = color2.replace('#', '')

  const r1 = parseInt(hex1.substring(0, 2), 16)
  const g1 = parseInt(hex1.substring(2, 4), 16)
  const b1 = parseInt(hex1.substring(4, 6), 16)

  const r2 = parseInt(hex2.substring(0, 2), 16)
  const g2 = parseInt(hex2.substring(2, 4), 16)
  const b2 = parseInt(hex2.substring(4, 6), 16)

  const r = Math.round(r1 + (r2 - r1) * factor)
  const g = Math.round(g1 + (g2 - g1) * factor)
  const b = Math.round(b1 + (b2 - b1) * factor)

  return `rgb(${r}, ${g}, ${b})`
}

// Create intermediate theme between two milestones based on progress
export function interpolateTheme(
  currentTheme: MilestoneTheme,
  nextTheme: MilestoneTheme,
  progress: number
): Partial<MilestoneTheme> {
  if (progress <= 0) return currentTheme
  if (progress >= 1) return nextTheme

  // Smoothed progress for more natural transitions
  const smoothProgress = progress * progress * (3 - 2 * progress) // Smoothstep function

  return {
    gradient: interpolateGradients(currentTheme.gradient, nextTheme.gradient, smoothProgress),
    glowColor: interpolateRgbaColors(currentTheme.glowColor, nextTheme.glowColor, smoothProgress),
    particleColor: interpolateColor(currentTheme.particleColor, nextTheme.particleColor, smoothProgress),
    borderGlow: interpolateShadows(currentTheme.borderGlow, nextTheme.borderGlow, smoothProgress),
    luminance: currentTheme.luminance + (nextTheme.luminance - currentTheme.luminance) * smoothProgress
  }
}

// Helper function to interpolate between gradient strings
function interpolateGradients(grad1: string, grad2: string, factor: number): string {
  // For now, return a simple mix - could be enhanced for full gradient interpolation
  if (factor < 0.5) return grad1
  return grad2
}

// Helper function to interpolate RGBA colors
function interpolateRgbaColors(rgba1: string, rgba2: string, factor: number): string {
  // Extract RGBA values and interpolate
  const rgba1Match = rgba1.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/)
  const rgba2Match = rgba2.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/)

  if (!rgba1Match || !rgba2Match) return rgba1

  const r = Math.round(parseInt(rgba1Match[1]) + (parseInt(rgba2Match[1]) - parseInt(rgba1Match[1])) * factor)
  const g = Math.round(parseInt(rgba1Match[2]) + (parseInt(rgba2Match[2]) - parseInt(rgba1Match[2])) * factor)
  const b = Math.round(parseInt(rgba1Match[3]) + (parseInt(rgba2Match[3]) - parseInt(rgba1Match[3])) * factor)
  const a = parseFloat(rgba1Match[4]) + (parseFloat(rgba2Match[4]) - parseFloat(rgba1Match[4])) * factor

  return `rgba(${r}, ${g}, ${b}, ${a.toFixed(3)})`
}

// Helper function to interpolate box-shadow values
function interpolateShadows(shadow1: string, shadow2: string, factor: number): string {
  if (factor < 0.5) return shadow1
  return shadow2
}

// Get milestone theme by ID with fallback
export function getMilestoneTheme(milestoneId: string): MilestoneTheme {
  return milestoneThemes[milestoneId] || milestoneThemes['M_0']
}