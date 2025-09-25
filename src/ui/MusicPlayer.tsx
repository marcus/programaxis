import React, { useState, useRef, useEffect } from 'react'

const MUSIC_FILES = [
  '/music/neon-caverns-01.mp3',
  '/music/neon-caverns-02.mp3',
  '/music/neon-caverns-03.mp3'
]

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [showPulse, setShowPulse] = useState(true)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Hide pulse animation after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPulse(false)
    }, 10000)
    return () => clearTimeout(timer)
  }, [])

  // Set up audio event listeners
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleEnded = () => {
      // Auto-advance to next track
      const nextIndex = (currentTrackIndex + 1) % MUSIC_FILES.length
      setCurrentTrackIndex(nextIndex)
    }

    const handleCanPlay = () => {
      if (isPlaying) {
        audio.play().catch(console.error)
      }
    }

    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('canplay', handleCanPlay)

    return () => {
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('canplay', handleCanPlay)
    }
  }, [currentTrackIndex, isPlaying])

  // Update audio source when track changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.src = MUSIC_FILES[currentTrackIndex]
    audio.load()
  }, [currentTrackIndex])

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play().catch(console.error)
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <div className={`music-player ${showPulse ? 'pulse-hint' : ''}`}>
      <button
        className="music-button"
        onClick={togglePlayPause}
        title={isPlaying ? 'Pause music' : 'Play music'}
      >
        {isPlaying ? (
          // Pause icon (two vertical bars)
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="2" y="1" width="2" height="10" fill="currentColor" />
            <rect x="8" y="1" width="2" height="10" fill="currentColor" />
          </svg>
        ) : (
          // Play icon (triangle pointing right)
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 2L10 6L3 10V2Z" fill="currentColor" />
          </svg>
        )}
      </button>
      <audio
        ref={audioRef}
        volume={0.3}
        preload="none"
      />
    </div>
  )
}