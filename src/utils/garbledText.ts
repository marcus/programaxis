// Garbled Text Utility - Creates mysterious scrambled text for locked content

export type GarbledStyle =
  | 'corrupted'      // Mix of original chars and random symbols
  | 'redacted'       // █ blocks with occasional reveals
  | 'glitched'       // Random Unicode and technical symbols
  | 'encrypted'      // Hex-like patterns
  | 'static'         // TV static-like noise
  | 'fragmented'     // Partial words with gaps

// Character sets for different scrambling effects
const CHAR_SETS = {
  corrupted: '!@#$%^&*()_+-=[]{}|;:,.<>?~`',
  redacted: '█▇▆▅▄▃▂▁',
  glitched: 'ǝ˥ɔ∀◊♦◘○●◐◑▲▼◄►∞§¶±',
  encrypted: '0123456789ABCDEFabcdef',
  static: '▓▒░║╬╫╪╩╦╠╣╚╝╔╗',
  fragmented: '▬▭▮▯─━│┃┄┅┆┇┈┉┊┋'
}

// Get a deterministic but seemingly random character
function getScrambledChar(originalChar: string, position: number, seed: number, style: GarbledStyle): string {
  const charSet = CHAR_SETS[style]

  // Use position and seed to create deterministic "randomness"
  const hash = (seed + position + originalChar.charCodeAt(0)) % charSet.length

  switch (style) {
    case 'corrupted':
      // 85% chance of scramble, 15% chance of original char (much less revelation)
      return (hash % 20) < 3 ? originalChar : charSet[hash]

    case 'redacted':
      // Mostly blocks with very rare original character peek-through
      return (hash % 25) === 0 ? originalChar : charSet[hash % charSet.length]

    case 'glitched':
      // Always scrambled with Unicode symbols
      return charSet[hash]

    case 'encrypted':
      // Hex-like patterns, preserve word structure somewhat
      return originalChar === ' ' ? ' ' : charSet[hash]

    case 'static':
      // Dense static pattern
      return charSet[hash]

    case 'fragmented':
      // Show fragments with more gaps (less revealing)
      return (hash % 5) === 0 ? originalChar : (hash % 3 === 0 ? charSet[hash % charSet.length] : '░')
  }
}

// Main garbling function
export function garbleText(
  text: string,
  style: GarbledStyle = 'corrupted',
  intensity: number = 0.8,
  seed: number = 42
): string {
  if (intensity <= 0) return text
  if (intensity >= 1) {
    return text.split('').map((char, i) =>
      char === ' ' ? ' ' : getScrambledChar(char, i, seed, style)
    ).join('')
  }

  // Partial garbling based on intensity
  return text.split('').map((char, i) => {
    if (char === ' ') return ' '

    const shouldScramble = ((seed + i) % 100) / 100 < intensity
    return shouldScramble ? getScrambledChar(char, i, seed, style) : char
  }).join('')
}

// Create multiple corruption layers for extra mystery
export function deepGarble(text: string, seed: number = 42): string {
  const styles: GarbledStyle[] = ['corrupted', 'redacted', 'glitched', 'encrypted']
  const selectedStyle = styles[seed % styles.length]

  // Apply multiple passes for deep corruption
  let result = text
  for (let pass = 0; pass < 3; pass++) {
    result = garbleText(result, selectedStyle, 0.6 + (pass * 0.1), seed + pass)
  }

  return result
}

// Time-based dynamic garbling (for animations)
export function timeGarble(text: string, timestamp: number = Date.now(), seed: number = 42): string {
  // Create a unique random interval for each piece of text based on its content and seed
  const textHash = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const uniqueSeed = seed + textHash

  // Random interval between 1.5-3.5 seconds for each piece of text
  const baseInterval = 1500 + (uniqueSeed % 2000) // 1500-3500ms
  const cycle = Math.floor(timestamp / baseInterval)

  const styles: GarbledStyle[] = ['corrupted', 'glitched', 'static', 'fragmented']
  const style = styles[(cycle + uniqueSeed) % styles.length]

  // Higher intensity (less revelation) and vary it slightly
  const intensity = 0.92 + ((cycle + uniqueSeed) % 3) * 0.02 // Between 0.92-0.96
  return garbleText(text, style, intensity, cycle + uniqueSeed)
}

// Tech-themed garbling for different tech categories
export function techGarble(text: string, category: string, animated: boolean = false, timestamp?: number): string {
  const categorySeeds: Record<string, number> = {
    'A': 123, // AI Models - corrupted/glitched
    'B': 234, // Editor - fragmented
    'C': 345, // Hardware - static
    'D': 456, // Workspace - redacted
    'E': 567, // Agents - encrypted
    'F': 678, // Marketing - corrupted
    'G': 789, // Platforms - glitched
    'H': 890  // Graphics - static
  }

  const categoryStyles: Record<string, GarbledStyle> = {
    'A': 'glitched',
    'B': 'fragmented',
    'C': 'static',
    'D': 'redacted',
    'E': 'encrypted',
    'F': 'corrupted',
    'G': 'glitched',
    'H': 'static'
  }

  const seed = categorySeeds[category] || 42

  // If animated, use time-based garbling with category-specific seed
  if (animated && timestamp !== undefined) {
    return timeGarble(text, timestamp, seed)
  }

  const style = categoryStyles[category] || 'corrupted'

  // Increase intensity to 95% for more mystery
  return garbleText(text, style, 0.95, seed)
}

// Generate mysterious hints that partially reveal information
export function mysteriousHint(text: string, revealPercentage: number = 0.2): string {
  const words = text.split(' ')

  return words.map(word => {
    if (word.length <= 2) return word // Keep short words

    const revealCount = Math.max(1, Math.floor(word.length * revealPercentage))
    const revealPositions = new Set<number>()

    // Reveal first and last characters, plus some random ones
    revealPositions.add(0)
    revealPositions.add(word.length - 1)

    while (revealPositions.size < revealCount) {
      revealPositions.add(Math.floor(Math.random() * word.length))
    }

    return word.split('').map((char, i) =>
      revealPositions.has(i) ? char : '█'
    ).join('')
  }).join(' ')
}

// Export utility object for easier imports
export const GarbledText = {
  garble: garbleText,
  deep: deepGarble,
  time: timeGarble,
  tech: techGarble,
  hint: mysteriousHint
}