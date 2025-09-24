import React, { useRef, useEffect, useState } from 'react'
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
    rotation: number
    rotationSpeed: number
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

  // Vertex shader for action particles
  const vertexShader = `
    attribute float size;
    attribute float alpha;
    attribute vec3 color;
    attribute float rotation;

    varying float vAlpha;
    varying vec3 vColor;
    varying float vRotation;

    void main() {
      vAlpha = alpha;
      vColor = color;
      vRotation = rotation;

      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * (200.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `

  // Fragment shader for dramatic spark particles
  const fragmentShader = `
    varying float vAlpha;
    varying vec3 vColor;
    varying float vRotation;

    void main() {
      // Create dramatic spark-like particles
      vec2 coord = gl_PointCoord - vec2(0.5);
      float dist = length(coord);

      // Larger particles with spark-like shape
      if (dist > 0.45) discard;

      // Create bright center with glowing edges
      float intensity = 1.0 - (dist / 0.45);
      intensity = pow(intensity, 2.0); // Less harsh falloff for bigger sparks

      // Add dynamic sparkle and rotation effects
      float sparkle = sin(vRotation * 6.0) * 0.3 + 0.7;

      // Create cross-shaped spark pattern
      vec2 rotated = coord;
      float c = cos(vRotation);
      float s = sin(vRotation);
      rotated = vec2(rotated.x * c - rotated.y * s, rotated.x * s + rotated.y * c);

      float crossPattern = max(
        1.0 - abs(rotated.x) * 8.0,
        1.0 - abs(rotated.y) * 8.0
      );
      crossPattern = max(0.0, crossPattern);

      intensity = max(intensity, crossPattern * 0.7);
      intensity *= sparkle;

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

      // Camera setup
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000)
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

      // Create shared geometry for particle reuse
      const maxParticles = 30
      const geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(maxParticles * 3)
      const sizes = new Float32Array(maxParticles)
      const alphas = new Float32Array(maxParticles)
      const colors = new Float32Array(maxParticles * 3)
      const rotations = new Float32Array(maxParticles)

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
      geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1))
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      geometry.setAttribute('rotation', new THREE.BufferAttribute(rotations, 1))

      sharedGeometryRef.current = geometry

      // Create shared materials for each action type
      const materialConfig = {
        vertexShader,
        fragmentShader,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }

      sharedMaterialsRef.current = {
        'write-code': new THREE.ShaderMaterial(materialConfig),
        'ship-build': new THREE.ShaderMaterial(materialConfig),
        'pay-debt': new THREE.ShaderMaterial(materialConfig),
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

  // Create particle system for action
  const createParticleSystem = (event: ActionAnimationEvent) => {
    if (!sceneRef.current || !sharedGeometryRef.current) return

    const scene = sceneRef.current
    const config = actionAnimationSystem.getAnimationConfig(event.type)

    // Convert screen position to world position
    const worldX = event.position.x - window.innerWidth / 2
    const worldY = -event.position.y + window.innerHeight / 2

    // Use shared geometry and material
    const geometry = sharedGeometryRef.current.clone()
    const material = sharedMaterialsRef.current[event.type].clone()

    const particleCount = Math.min(config.particleCount, 30) // Hard limit for performance

    // Initialize particle data
    const particles = []
    const positions = geometry.attributes.position.array as Float32Array
    const sizes = geometry.attributes.size.array as Float32Array
    const alphas = geometry.attributes.alpha.array as Float32Array
    const colors = geometry.attributes.color.array as Float32Array
    const rotations = geometry.attributes.rotation.array as Float32Array

    const baseColor = new THREE.Color(config.color)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3

      // Initialize particle with centered start for dramatic scatter
      const particle = {
        position: new THREE.Vector3(
          worldX + (Math.random() - 0.5) * 8, // Slightly wider start for variety
          worldY + (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 10 // Add Z-axis depth for 3D effect
        ),
        velocity: new THREE.Vector3(),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 3, // Faster rotation for 3D effect
        life: 1.0
      }

      // Set initial velocity based on motion type - refined scatter
      switch (config.motion) {
        case 'float-up':
          particle.velocity.set(
            (Math.random() - 0.5) * 28, // Reduced horizontal spread
            Math.random() * 35 + 15, // Less aggressive upward motion
            (Math.random() - 0.5) * 20 // Gentler Z-axis movement
          )
          break
        case 'radial-burst':
          const angle = Math.random() * Math.PI * 2
          const speed = Math.random() * 55 + 25 // Reduced speeds
          particle.velocity.set(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed,
            (Math.random() - 0.5) * 35 // Less Z movement
          )
          break
        case 'spiral-dissolve':
          const spiralAngle = (i / particleCount) * Math.PI * 3 // Fewer spiral turns
          const spiralSpeed = Math.random() * 30 + 20 // Slower spiral
          particle.velocity.set(
            Math.cos(spiralAngle) * spiralSpeed,
            Math.sin(spiralAngle) * spiralSpeed,
            (Math.random() - 0.5) * 28 // Reduced Z spiral
          )
          break
      }

      particles.push(particle)

      // Set initial geometry attributes
      positions[i3] = particle.position.x
      positions[i3 + 1] = particle.position.y
      positions[i3 + 2] = particle.position.z

      const size = config.size[0] + Math.random() * (config.size[1] - config.size[0])
      sizes[i] = size * (event.intensity || 1) * config.quality * 0.9 // Refined spark size

      alphas[i] = 0.7 // Balanced visibility

      colors[i3] = baseColor.r
      colors[i3 + 1] = baseColor.g
      colors[i3 + 2] = baseColor.b

      rotations[i] = particle.rotation
    }

    // Mark attributes for update
    geometry.attributes.position.needsUpdate = true
    geometry.attributes.size.needsUpdate = true
    geometry.attributes.alpha.needsUpdate = true
    geometry.attributes.color.needsUpdate = true
    geometry.attributes.rotation.needsUpdate = true

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
  }

  // Animation loop
  useEffect(() => {
    const animate = () => {
      if (!rendererRef.current || !cameraRef.current || !sceneRef.current) return

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

        // Update particles
        const positions = system.geometry.attributes.position.array as Float32Array
        const alphas = system.geometry.attributes.alpha.array as Float32Array
        const sizes = system.geometry.attributes.size.array as Float32Array
        const rotations = system.geometry.attributes.rotation.array as Float32Array

        system.particles.forEach((particle, index) => {
          const i3 = index * 3

          // Update position
          particle.position.add(particle.velocity.clone().multiplyScalar(deltaTime))

          // Apply gravity
          particle.velocity.y -= system.config.gravity * deltaTime

          // Update rotation
          particle.rotation += particle.rotationSpeed * deltaTime

          // Update life
          particle.life = 1 - progress

          // Write to geometry
          positions[i3] = particle.position.x
          positions[i3 + 1] = particle.position.y
          positions[i3 + 2] = particle.position.z

          // Fade out based on motion type
          let alpha = particle.life
          if (system.config.motion === 'spiral-dissolve') {
            alpha *= Math.sin(progress * Math.PI) // Sine wave fade
          }

          alphas[index] = alpha
          sizes[index] *= 0.998 // Slight shrinking
          rotations[index] = particle.rotation
        })

        system.geometry.attributes.position.needsUpdate = true
        system.geometry.attributes.alpha.needsUpdate = true
        system.geometry.attributes.size.needsUpdate = true
        system.geometry.attributes.rotation.needsUpdate = true

        return true
      })

      // Hide animation container if no active systems
      if (particleSystemsRef.current.length === 0) {
        setIsVisible(false)
      }

      if (isVisible) {
        rendererRef.current.render(scene, cameraRef.current)
      }

      frameIdRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current)
      }
    }
  }, [isVisible])

  // Subscribe to animation events
  useEffect(() => {
    const unsubscribe = actionAnimationSystem.subscribe((event: ActionAnimationEvent) => {
      createParticleSystem(event)
    })

    return unsubscribe
  }, [])

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
        transition: 'opacity 0.1s ease'
      }}
    />
  )
}