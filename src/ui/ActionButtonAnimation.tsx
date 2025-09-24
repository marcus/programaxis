import React, { useRef, useEffect, useState, useCallback } from 'react'
import * as THREE from 'three'
import { actionAnimationSystem, ActionAnimationEvent } from '../game/actionAnimationSystem'

interface ParticleSystem {
  geometry: THREE.BufferGeometry
  material: THREE.ShaderMaterial
  points: THREE.Points
  startTime: number
  duration: number
  type: string
  config: any
  particles: Array<{
    position: THREE.Vector3
    velocity: THREE.Vector3
    life: number
  }>
}

export const ActionButtonAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const cameraRef = useRef<THREE.OrthographicCamera>()
  const frameIdRef = useRef<number>()
  const [isVisible, setIsVisible] = useState(false)
  const particleSystemsRef = useRef<ParticleSystem[]>([])
  const lastFrameTime = useRef(Date.now())

  // Shared materials and geometries for performance
  const sharedMaterialsRef = useRef<Record<string, THREE.ShaderMaterial>>({})
  const sharedGeometryRef = useRef<THREE.BufferGeometry>()

  // Simplified vertex shader for action particles
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
      gl_PointSize = size * 2.0; // Optimized particle visibility
      gl_Position = projectionMatrix * mvPosition;
    }
  `

  // Simplified fragment shader for efficient spark particles
  const fragmentShader = `
    varying float vAlpha;
    varying vec3 vColor;

    void main() {
      // Simple circular gradient for efficient rendering
      vec2 coord = gl_PointCoord - vec2(0.5);
      float dist = length(coord);

      // Sharp falloff for clean particles
      if (dist > 0.5) discard;

      // Bright, solid particles for debugging
      float intensity = 1.0 - (dist * 1.5);
      intensity = max(0.5, intensity); // Minimum 50% brightness

      gl_FragColor = vec4(vColor * 2.0, vAlpha * intensity); // Brighter colors
    }
  `

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return

    try {
      // Scene setup
      const scene = new THREE.Scene()
      sceneRef.current = scene

      // Camera setup - use screen dimensions for proper scaling
      const width = window.innerWidth
      const height = window.innerHeight
      const camera = new THREE.OrthographicCamera(-width/2, width/2, height/2, -height/2, 0.1, 1000)
      camera.position.z = 1
      cameraRef.current = camera

      // Renderer setup with minimal settings for performance
      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false, // Disabled for performance
        premultipliedAlpha: false,
        preserveDrawingBuffer: false
      })


      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setClearColor(0x000000, 0)
      renderer.domElement.style.pointerEvents = 'none'
      rendererRef.current = renderer

      containerRef.current.appendChild(renderer.domElement)

      // Create shared geometry for particle reuse - simplified for performance
      const maxParticles = 15 // Reduced from 30
      const geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(maxParticles * 3)
      const sizes = new Float32Array(maxParticles)
      const alphas = new Float32Array(maxParticles)
      const colors = new Float32Array(maxParticles * 3)

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
      geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1))
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

      sharedGeometryRef.current = geometry

      // Create shared materials for each action type
      const materialConfig = {
        vertexShader,
        fragmentShader,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }

      try {
        sharedMaterialsRef.current = {
          'write-code': new THREE.ShaderMaterial(materialConfig),
          'ship-build': new THREE.ShaderMaterial(materialConfig),
          'pay-debt': new THREE.ShaderMaterial(materialConfig),
        }
      } catch (error) {
        // Fallback to basic material
        sharedMaterialsRef.current = {
          'write-code': new THREE.PointsMaterial({ color: 0x5ad6a0, size: 4, transparent: true }),
          'ship-build': new THREE.PointsMaterial({ color: 0xffca5f, size: 4, transparent: true }),
          'pay-debt': new THREE.PointsMaterial({ color: 0xf45b69, size: 4, transparent: true }),
        }
      }

      // Handle resize
      const handleResize = () => {
        if (!cameraRef.current || !rendererRef.current) return
        const width = window.innerWidth
        const height = window.innerHeight

        const cam = cameraRef.current
        cam.left = -width / 2
        cam.right = width / 2
        cam.top = height / 2
        cam.bottom = -height / 2
        cam.updateProjectionMatrix()

        rendererRef.current.setSize(width, height)
      }

      window.addEventListener('resize', handleResize)
      handleResize()

      return () => {
        window.removeEventListener('resize', handleResize)
        if (containerRef.current && rendererRef.current?.domElement) {
          containerRef.current.removeChild(rendererRef.current.domElement)
        }
        rendererRef.current?.dispose()

        // Clean up shared resources
        sharedGeometryRef.current?.dispose()
        Object.values(sharedMaterialsRef.current).forEach(material => material.dispose())
      }
    } catch (error) {
      console.error('Failed to initialize Action Button Animation:', error)
      return
    }
  }, [])

  // Animation loop function with useCallback for stable reference
  const startAnimationLoop = useCallback(() => {
    const animate = () => {
      if (!rendererRef.current || !cameraRef.current || !sceneRef.current) {
        frameIdRef.current = undefined
        return
      }

      const now = Date.now()
      const deltaTime = (now - lastFrameTime.current) / 1000
      lastFrameTime.current = now

      // Update performance monitoring
      actionAnimationSystem.updatePerformance(deltaTime * 1000)

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

        // Optimized particle updates with early exit for invisible particles
        const positions = system.geometry.attributes.position.array as Float32Array
        const alphas = system.geometry.attributes.alpha.array as Float32Array
        const sizes = system.geometry.attributes.size.array as Float32Array

        let hasVisibleParticles = false

        system.particles.forEach((particle, index) => {
          const i3 = index * 3

          // Update position - simplified 2D physics
          particle.position.x += particle.velocity.x * deltaTime
          particle.position.y += particle.velocity.y * deltaTime

          // Apply gravity
          particle.velocity.y -= system.config.gravity * deltaTime

          // Update life
          particle.life = 1 - progress

          // Early exit for invisible particles
          if (particle.life <= 0.01) {
            alphas[index] = 0
            return
          }

          hasVisibleParticles = true

          // Write to geometry
          positions[i3] = particle.position.x
          positions[i3 + 1] = particle.position.y
          positions[i3 + 2] = 0 // Always Z=0

          // Simplified fade out
          let alpha = particle.life
          if (system.config.motion === 'spiral-dissolve') {
            alpha *= Math.sin(progress * Math.PI) // Sine wave fade
          }

          alphas[index] = alpha
          sizes[index] *= 0.995 // Gentler shrinking for longer visibility
        })

        // Skip updates if no visible particles
        if (!hasVisibleParticles) {
          scene.remove(system.points)
          system.geometry.dispose()
          system.material.dispose()
          return false
        }

        system.geometry.attributes.position.needsUpdate = true
        system.geometry.attributes.alpha.needsUpdate = true
        system.geometry.attributes.size.needsUpdate = true

        return true
      })

      // Continue animation loop if we have particles
      if (particleSystemsRef.current.length > 0) {
        rendererRef.current.render(scene, cameraRef.current)
        frameIdRef.current = requestAnimationFrame(animate)
        setIsVisible(true)
      } else {
        // Stop the animation loop when no particles are active
        setIsVisible(false)
        frameIdRef.current = undefined
      }
    }

    // Start the animation
    animate()
  }, [])

  // Create particle system for action with useCallback for stable reference
  const createParticleSystem = useCallback((event: ActionAnimationEvent) => {
    if (!sceneRef.current || !sharedGeometryRef.current) return

    const scene = sceneRef.current
    const config = actionAnimationSystem.getAnimationConfig(event.type)

    // Convert screen position to world position
    const worldX = event.position.x - window.innerWidth / 2
    const worldY = -event.position.y + window.innerHeight / 2

    // Use shared geometry and material
    const geometry = sharedGeometryRef.current.clone()
    const material = sharedMaterialsRef.current[event.type].clone()

    const particleCount = Math.min(config.particleCount, 15) // Reduced hard limit for performance

    // Initialize particle data - simplified 2D physics
    const particles = []
    const positions = geometry.attributes.position.array as Float32Array
    const sizes = geometry.attributes.size.array as Float32Array
    const alphas = geometry.attributes.alpha.array as Float32Array
    const colors = geometry.attributes.color.array as Float32Array

    const baseColor = new THREE.Color(config.color)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3

      // Initialize particle with centered start - simplified 2D
      const particle = {
        position: new THREE.Vector3(
          worldX + (Math.random() - 0.5) * 6, // Tighter start spread
          worldY + (Math.random() - 0.5) * 6,
          0 // Keep all particles at Z=0 for 2D
        ),
        velocity: new THREE.Vector3(),
        life: 1.0
      }

      // Simplified velocity patterns for better performance
      switch (config.motion) {
        case 'float-up':
          particle.velocity.set(
            (Math.random() - 0.5) * 20, // Reduced horizontal spread
            Math.random() * 25 + 10, // Gentler upward motion
            0 // No Z movement
          )
          break
        case 'radial-burst':
          const angle = Math.random() * Math.PI * 2
          const speed = Math.random() * 35 + 15 // Reduced speeds
          particle.velocity.set(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed,
            0 // No Z movement
          )
          break
        case 'spiral-dissolve':
          const spiralAngle = (i / particleCount) * Math.PI * 2 // Simpler spiral
          const spiralSpeed = Math.random() * 20 + 15 // Slower spiral
          particle.velocity.set(
            Math.cos(spiralAngle) * spiralSpeed,
            Math.sin(spiralAngle) * spiralSpeed,
            0 // No Z movement
          )
          break
      }

      particles.push(particle)

      // Set initial geometry attributes
      positions[i3] = particle.position.x
      positions[i3 + 1] = particle.position.y
      positions[i3 + 2] = 0 // Always Z=0

      const size = config.size[0] + Math.random() * (config.size[1] - config.size[0])
      sizes[i] = Math.max(3, size * (event.intensity || 1) * config.quality * 2.0) // Optimized particle size

      alphas[i] = 0.8 // Good visibility

      colors[i3] = baseColor.r
      colors[i3 + 1] = baseColor.g
      colors[i3 + 2] = baseColor.b

    }

    // Mark attributes for update
    geometry.attributes.position.needsUpdate = true
    geometry.attributes.size.needsUpdate = true
    geometry.attributes.alpha.needsUpdate = true
    geometry.attributes.color.needsUpdate = true

    // Create points mesh
    const points = new THREE.Points(geometry, material)
    scene.add(points)

    // Store particle system
    const particleSystem: ParticleSystem = {
      geometry,
      material,
      points,
      startTime: Date.now(),
      duration: config.duration,
      type: event.type,
      config,
      particles
    }

    particleSystemsRef.current.push(particleSystem)
    setIsVisible(true)

    // Always restart animation loop when new particles are added
    if (!frameIdRef.current) {
      startAnimationLoop()
    }
  }, [startAnimationLoop])


  // Subscribe to animation events
  useEffect(() => {
    const unsubscribe = actionAnimationSystem.subscribe((event: ActionAnimationEvent) => {
      createParticleSystem(event)
    })

    return unsubscribe
  }, [createParticleSystem])

  return (
    <div
      ref={containerRef}
      className="action-button-animation-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 500, // Lower than tech tree animations
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? 'visible' : 'hidden',
        transition: 'opacity 0.1s ease',
      }}
    />
  )
}