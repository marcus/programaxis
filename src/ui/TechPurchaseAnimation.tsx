import React, { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { animationSystem, AnimationEvent } from '../game/animationSystem'

interface ParticleSystem {
  geometry: THREE.BufferGeometry
  material: THREE.ShaderMaterial
  points: THREE.Points
  startTime: number
  duration: number
  position: { x: number; y: number }
  branchColor: string
  branchKey: string
  velocityPattern: string
  symbols: string[]
  effects: Array<{ text: string; kind: string }>
}

export const TechPurchaseAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const cameraRef = useRef<THREE.OrthographicCamera>()
  const frameIdRef = useRef<number>()
  const [isVisible, setIsVisible] = useState(true)
  const particleSystemsRef = useRef<ParticleSystem[]>([])

  // Vertex shader for particles
  const vertexShader = `
    attribute float size;
    attribute float alpha;
    attribute vec3 color;

    varying float vAlpha;
    varying vec3 vColor;

    void main() {
      vAlpha = alpha;
      vColor = color;

      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `

  // Fragment shader for glowing particles
  const fragmentShader = `
    varying float vAlpha;
    varying vec3 vColor;

    void main() {
      float dist = length(gl_PointCoord - vec2(0.5));
      if (dist > 0.5) discard;

      float intensity = 1.0 - dist * 2.0;
      intensity = pow(intensity, 2.0);

      gl_FragColor = vec4(vColor, vAlpha * intensity);
    }
  `

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return

    try {
      // Scene setup
      const scene = new THREE.Scene()
      sceneRef.current = scene

      // Camera setup (orthographic for 2D overlay)
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000)
      camera.position.z = 1
      cameraRef.current = camera

      // Renderer setup
      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        premultipliedAlpha: false
      })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setClearColor(0x000000, 0) // Transparent background
      renderer.domElement.style.pointerEvents = 'none'
      rendererRef.current = renderer

      containerRef.current.appendChild(renderer.domElement)

      // Handle resize
      const handleResize = () => {
        if (!cameraRef.current || !rendererRef.current) return
        const width = window.innerWidth
        const height = window.innerHeight

        const cam = cameraRef.current
        const ren = rendererRef.current

        cam.left = -width / 2
        cam.right = width / 2
        cam.top = height / 2
        cam.bottom = -height / 2
        cam.updateProjectionMatrix()

        ren.setSize(width, height)
      }

      window.addEventListener('resize', handleResize)
      handleResize()

      return () => {
        window.removeEventListener('resize', handleResize)
        if (containerRef.current && rendererRef.current?.domElement) {
          containerRef.current.removeChild(rendererRef.current.domElement)
        }
        rendererRef.current?.dispose()
      }
    } catch (error) {
      console.error('Failed to initialize Three.js:', error)
      return
    }
  }, [])

  // Create particle burst animation
  const createParticleSystem = (event: AnimationEvent) => {
    if (!sceneRef.current) return

    const scene = sceneRef.current
    const theme = animationSystem.getBranchTheme(event.branchKey)
    const branchKey = event.branchKey

    // Branch-specific configurations
    let particleCount = 150
    let animationDuration = 2000
    let speedMultiplier = 1
    let sizeRange = [4, 12]
    let velocityPattern = 'explosion' // 'explosion', 'spiral', 'cascade', 'grid'

    // Programming Branch (A) - Matrix-style cascade effect
    if (branchKey === 'A') {
      particleCount = 200
      velocityPattern = 'cascade'
      sizeRange = [2, 6]
      animationDuration = 2500
    }
    // Automation Branch (B) - Mechanical spiral burst
    else if (branchKey === 'B') {
      particleCount = 120
      velocityPattern = 'spiral'
      sizeRange = [6, 14]
      speedMultiplier = 1.5
      animationDuration = 1800
    }

    // Convert screen position to world position
    const worldX = event.position.x - window.innerWidth / 2
    const worldY = -event.position.y + window.innerHeight / 2

    // Geometry for particles
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    const alphas = new Float32Array(particleCount)
    const colors = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount * 3)
    const phases = new Float32Array(particleCount) // For animation patterns

    const color = new THREE.Color(theme.color)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3

      // Starting position (centered on click)
      positions[i3] = worldX + (Math.random() - 0.5) * 20
      positions[i3 + 1] = worldY + (Math.random() - 0.5) * 20
      positions[i3 + 2] = 0

      // Branch-specific velocity patterns
      let angle, speed

      if (velocityPattern === 'cascade') {
        // Programming: Matrix-style downward cascade with slight randomness
        angle = (Math.PI / 2) + (Math.random() - 0.5) * 0.8 // Mostly downward
        speed = (Math.random() * 200 + 150) * speedMultiplier
        velocities[i3] = Math.cos(angle) * speed * 0.3 // Less horizontal spread
        velocities[i3 + 1] = Math.sin(angle) * speed
        velocities[i3 + 2] = (Math.random() - 0.5) * 50
        phases[i] = Math.random() * Math.PI * 2 // For wave effects
      }
      else if (velocityPattern === 'spiral') {
        // Automation: Mechanical spiral pattern
        const spiralAngle = (i / particleCount) * Math.PI * 4 + Math.random() * 0.5
        const radius = Math.random() * 150 + 100
        speed = radius * speedMultiplier
        velocities[i3] = Math.cos(spiralAngle) * speed
        velocities[i3 + 1] = Math.sin(spiralAngle) * speed
        velocities[i3 + 2] = (Math.random() - 0.5) * 80
        phases[i] = spiralAngle // Store spiral position
      }
      else {
        // Default explosion pattern for other branches
        angle = Math.random() * Math.PI * 2
        speed = (Math.random() * 300 + 100) * speedMultiplier
        velocities[i3] = Math.cos(angle) * speed
        velocities[i3 + 1] = Math.sin(angle) * speed
        velocities[i3 + 2] = (Math.random() - 0.5) * 100
        phases[i] = Math.random() * Math.PI * 2
      }

      // Branch-specific sizes
      sizes[i] = Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0]
      alphas[i] = 1.0

      // Color with branch-specific variations
      let hue = Math.random() * 0.1 - 0.05
      if (branchKey === 'A') {
        // Programming: More blue-green matrix colors
        hue = Math.random() * 0.15 - 0.075
      } else if (branchKey === 'B') {
        // Automation: More consistent mechanical blue
        hue = Math.random() * 0.05 - 0.025
      }

      const tempColor = color.clone()
      tempColor.offsetHSL(hue, 0, 0)
      colors[i3] = tempColor.r
      colors[i3 + 1] = tempColor.g
      colors[i3 + 2] = tempColor.b
    }

    geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1))

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3))

    // Shader material for glowing effect
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    // Create energy wave effect
    const waveGeometry = new THREE.RingGeometry(0, 1, 32)
    const waveMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(theme.color) },
        opacity: { value: 0.8 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        uniform float opacity;
        varying vec2 vUv;

        void main() {
          float dist = length(vUv - 0.5) * 2.0;
          float wave = sin(dist * 10.0 - time * 8.0) * 0.5 + 0.5;
          float alpha = (1.0 - dist) * opacity * wave;
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    })

    const waveMesh = new THREE.Mesh(waveGeometry, waveMaterial)
    waveMesh.position.set(worldX, worldY, -1)
    waveMesh.scale.set(50, 50, 1)
    scene.add(waveMesh)

    // Store particle system for animation
    const particleSystem: ParticleSystem = {
      geometry,
      material,
      points,
      startTime: Date.now(),
      duration: animationDuration,
      position: { x: worldX, y: worldY },
      branchColor: theme.color,
      branchKey: event.branchKey,
      velocityPattern: velocityPattern,
      symbols: theme.symbols,
      effects: event.effects,
    }

    particleSystemsRef.current.push(particleSystem)

    // Clean up wave mesh after animation
    setTimeout(() => {
      scene.remove(waveMesh)
      waveGeometry.dispose()
      waveMaterial.dispose()
    }, 1500)

    setIsVisible(true)
  }

  // Animation loop
  useEffect(() => {
    const animate = () => {
      if (!rendererRef.current || !cameraRef.current || !sceneRef.current) return

      const now = Date.now()
      const scene = sceneRef.current

      // Update particle systems
      particleSystemsRef.current = particleSystemsRef.current.filter(system => {
        const elapsed = now - system.startTime
        const progress = elapsed / system.duration

        if (progress >= 1) {
          // Remove completed system
          scene.remove(system.points)
          system.geometry.dispose()
          system.material.dispose()
          return false
        }

        // Update particles
        const positions = system.geometry.attributes.position.array as Float32Array
        const velocities = system.geometry.attributes.velocity!.array as Float32Array
        const alphas = system.geometry.attributes.alpha.array as Float32Array
        const sizes = system.geometry.attributes.size.array as Float32Array
        const phases = system.geometry.attributes.phase?.array as Float32Array

        const deltaTime = 0.016 // ~60fps
        const time = elapsed * 0.001 // Convert to seconds

        for (let i = 0; i < positions.length; i += 3) {
          const particleIndex = i / 3

          // Branch-specific behaviors
          if (system.velocityPattern === 'cascade') {
            // Programming: Matrix-style cascade with wave effects
            const wave = Math.sin(phases[particleIndex] + time * 3) * 0.1
            positions[i] += (velocities[i] + wave * 20) * deltaTime
            positions[i + 1] += velocities[i + 1] * deltaTime
            positions[i + 2] += velocities[i + 2] * deltaTime

            // Less gravity for cascade effect
            velocities[i + 1] -= 80 * deltaTime

            // Flicker alpha like matrix rain
            const flicker = Math.sin(time * 5 + phases[particleIndex]) * 0.2 + 0.8
            alphas[particleIndex] = (1 - progress) * flicker

            // Size pulsing
            const pulse = Math.sin(time * 4 + phases[particleIndex]) * 0.2 + 1
            sizes[particleIndex] = sizes[particleIndex] * 0.995 * pulse
          }
          else if (system.velocityPattern === 'spiral') {
            // Automation: Mechanical spiral with angular momentum
            const angularVel = 0.5 * (1 - progress * 0.5) // Slow down over time
            const currentAngle = phases[particleIndex] + time * angularVel
            const radius = Math.sqrt(positions[i] * positions[i] + positions[i + 1] * positions[i + 1])

            // Update spiral motion
            positions[i] += velocities[i] * deltaTime
            positions[i + 1] += velocities[i + 1] * deltaTime
            positions[i + 2] += velocities[i + 2] * deltaTime

            // Add centrifugal effect
            const centrifugal = radius * 0.1
            velocities[i] += Math.cos(currentAngle) * centrifugal * deltaTime
            velocities[i + 1] += Math.sin(currentAngle) * centrifugal * deltaTime

            // Moderate gravity
            velocities[i + 1] -= 100 * deltaTime

            // Steady fade
            alphas[particleIndex] = 1 - progress

            // Consistent size reduction
            sizes[particleIndex] = sizes[particleIndex] * 0.992
          }
          else {
            // Default explosion pattern
            positions[i] += velocities[i] * deltaTime
            positions[i + 1] += velocities[i + 1] * deltaTime
            positions[i + 2] += velocities[i + 2] * deltaTime

            // Standard gravity
            velocities[i + 1] -= 150 * deltaTime

            // Standard fade
            alphas[particleIndex] = 1 - progress

            // Standard shrink
            sizes[particleIndex] = sizes[particleIndex] * 0.99
          }
        }

        system.geometry.attributes.position.needsUpdate = true
        system.geometry.attributes.alpha.needsUpdate = true
        system.geometry.attributes.size.needsUpdate = true

        return true
      })

      // Hide animation container if no active systems
      if (particleSystemsRef.current.length === 0) {
        setIsVisible(false)
      }

      rendererRef.current.render(scene, cameraRef.current)
      frameIdRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current)
      }
    }
  }, [])

  // Subscribe to animation events
  useEffect(() => {
    const unsubscribe = animationSystem.subscribe((event: AnimationEvent) => {
      createParticleSystem(event)
    })

    return unsubscribe
  }, [])

  return (
    <div
      ref={containerRef}
      className="tech-purchase-animation-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1000,
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? 'visible' : 'hidden'
      }}
    />
  )
}