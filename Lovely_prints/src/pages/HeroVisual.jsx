import { Canvas } from '@react-three/fiber'
import { OrthographicCamera } from '@react-three/drei'
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function MovingPapers() {
  const group1Ref = useRef()
  const group2Ref = useRef()
  
  useFrame((state) => {
    const speed = 0.35
    const loopDistance = 18
    const offset = (state.clock.elapsedTime * speed) % loopDistance
    
    if (group1Ref.current) {
      group1Ref.current.position.x = -9 + offset
    }
    if (group2Ref.current) {
      group2Ref.current.position.x = -9 + offset - loopDistance
    }
  })

  const createPaper = (xPos, seed) => {
    const lift = 0.25 + (seed % 3) * 0.06
    const baseTilt = Math.sin(seed * 0.8) * 0.018
    const zOffset = (seed % 4 - 1.5) * 0.15
    const timeOffset = seed * 0.1
    const hasContent = seed % 2 === 0
    const hasGraph = seed % 5 === 0
    
    return (
      <group key={seed} position={[xPos + timeOffset * 0.05, lift, zOffset]}>
        <mesh 
          castShadow 
          receiveShadow
          rotation={[baseTilt, 0, Math.sin(seed) * 0.008]}
        >
          <boxGeometry args={[2, 0.02, 2.8]} />
          <meshStandardMaterial 
            color="#f8f8f8" 
            roughness={0.7}
            metalness={0.03}
          />
          <mesh position={[1, 0, 0]} rotation={[0, 0, 0.03]}>
            <boxGeometry args={[0.01, 0.021, 2.8]} />
            <meshStandardMaterial 
              color="#ffffff" 
              roughness={0.5}
              emissive="#ffffff"
              emissiveIntensity={0.08}
            />
          </mesh>
        </mesh>
        
        {hasGraph ? (
          <>
            <mesh position={[0, 0.011, 0.5]}>
              <boxGeometry args={[1.6, 0.001, 0.12]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
            </mesh>
            
            <mesh position={[-0.3, 0.011, -0.1]}>
              <boxGeometry args={[0.15, 0.001, 0.8]} />
              <meshStandardMaterial color="#3a3a3a" roughness={0.9} />
            </mesh>
            <mesh position={[-0.1, 0.011, -0.1]}>
              <boxGeometry args={[0.15, 0.001, 0.6]} />
              <meshStandardMaterial color="#3a3a3a" roughness={0.9} />
            </mesh>
            <mesh position={[0.1, 0.011, -0.1]}>
              <boxGeometry args={[0.15, 0.001, 0.9]} />
              <meshStandardMaterial color="#3a3a3a" roughness={0.9} />
            </mesh>
            <mesh position={[0.3, 0.011, -0.1]}>
              <boxGeometry args={[0.15, 0.001, 0.5]} />
              <meshStandardMaterial color="#3a3a3a" roughness={0.9} />
            </mesh>
            
            <mesh position={[0.3, 0.011, -0.8]}>
              <boxGeometry args={[1.0, 0.001, 0.3]} />
              <meshStandardMaterial color="#4a4a4a" roughness={0.9} />
            </mesh>
          </>
        ) : hasContent ? (
          <>
            <mesh position={[0, 0.011, 0.4]}>
              <boxGeometry args={[1.6, 0.001, 0.15]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
            </mesh>
            
            <mesh position={[0, 0.011, 0.15]}>
              <boxGeometry args={[1.6, 0.001, 0.08]} />
              <meshStandardMaterial color="#3a3a3a" roughness={0.9} />
            </mesh>
            
            <mesh position={[0, 0.011, -0.05]}>
              <boxGeometry args={[1.6, 0.001, 0.08]} />
              <meshStandardMaterial color="#3a3a3a" roughness={0.9} />
            </mesh>
            
            <mesh position={[0, 0.011, -0.25]}>
              <boxGeometry args={[1.6, 0.001, 0.08]} />
              <meshStandardMaterial color="#3a3a3a" roughness={0.9} />
            </mesh>
            
            <mesh position={[-0.3, 0.011, -0.6]}>
              <boxGeometry args={[1.0, 0.001, 0.4]} />
              <meshStandardMaterial color="#4a4a4a" roughness={0.9} />
            </mesh>
          </>
        ) : null}
      </group>
    )
  }

  const papers = []
  const paperCount = 6
  const spacing = 3

  for (let i = 0; i < paperCount; i++) {
    papers.push(createPaper(i * spacing, i))
  }

  return (
    <>
      <group ref={group1Ref}>
        {papers}
      </group>
      <group ref={group2Ref}>
        {papers.map((_, i) => createPaper(i * spacing, i + paperCount))}
      </group>
    </>
  )
}

function ConveyorBelt() {
  const beltRef = useRef()
  const roller1Ref = useRef()
  const roller2Ref = useRef()
  const roller3Ref = useRef()
  const roller4Ref = useRef()
  
  useFrame((state) => {
    if (beltRef.current) {
      beltRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.012
    }
    
    const rotationSpeed = state.clock.elapsedTime * 0.5
    if (roller1Ref.current) roller1Ref.current.rotation.z = rotationSpeed
    if (roller2Ref.current) roller2Ref.current.rotation.z = rotationSpeed
    if (roller3Ref.current) roller3Ref.current.rotation.z = rotationSpeed
    if (roller4Ref.current) roller4Ref.current.rotation.z = rotationSpeed
  })

  return (
    <group ref={beltRef}>
      <mesh position={[0, 0, 0]} receiveShadow castShadow>
        <boxGeometry args={[20, 0.18, 3.8]} />
        <meshStandardMaterial 
          color="#282828" 
          roughness={0.65}
          metalness={0.12}
        />
      </mesh>

      {[...Array(40)].map((_, i) => (
        <mesh key={i} position={[-10 + i * 0.5, 0.091, 0]}>
          <boxGeometry args={[0.02, 0.001, 3.8]} />
          <meshStandardMaterial 
            color="#1a1a1a" 
            roughness={0.8}
          />
        </mesh>
      ))}

      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[20.5, 0.12, 4.2]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          roughness={0.5}
          metalness={0.2}
        />
      </mesh>

      <mesh ref={roller1Ref} position={[-9.5, 0.05, 1.7]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.5, 20]} />
        <meshStandardMaterial 
          color="#0f0f0f" 
          roughness={0.35}
          metalness={0.4}
        />
      </mesh>

      <mesh ref={roller2Ref} position={[-9.5, 0.05, -1.7]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.5, 20]} />
        <meshStandardMaterial 
          color="#0f0f0f" 
          roughness={0.35}
          metalness={0.4}
        />
      </mesh>

      <mesh ref={roller3Ref} position={[9.5, 0.05, 1.7]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.5, 20]} />
        <meshStandardMaterial 
          color="#0f0f0f" 
          roughness={0.35}
          metalness={0.4}
        />
      </mesh>

      <mesh ref={roller4Ref} position={[9.5, 0.05, -1.7]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.5, 20]} />
        <meshStandardMaterial 
          color="#0f0f0f" 
          roughness={0.35}
          metalness={0.4}
        />
      </mesh>

      <mesh position={[-9.5, -0.3, 0]}>
        <boxGeometry args={[0.4, 0.6, 4.5]} />
        <meshStandardMaterial 
          color="#141414" 
          roughness={0.45}
          metalness={0.25}
        />
      </mesh>

      <mesh position={[9.5, -0.3, 0]}>
        <boxGeometry args={[0.4, 0.6, 4.5]} />
        <meshStandardMaterial 
          color="#141414" 
          roughness={0.45}
          metalness={0.25}
        />
      </mesh>
    </group>
  )
}

function GlassContainer({ mousePos, isHovered }) {
  const containerRef = useRef()
  const glowRef = useRef()
  
  useFrame(() => {
    if (containerRef.current) {
      containerRef.current.rotation.y = mousePos.x * 0.08
      containerRef.current.rotation.x = -mousePos.y * 0.05
    }
    if (glowRef.current) {
      const targetOpacity = isHovered ? 0.15 : 0.08
      glowRef.current.opacity += (targetOpacity - glowRef.current.opacity) * 0.1
    }
  })

  const shape = new THREE.Shape()
  const width = 12
  const height = 4
  const radius = 0.3
  
  shape.moveTo(-width/2 + radius, -height/2)
  shape.lineTo(width/2 - radius, -height/2)
  shape.quadraticCurveTo(width/2, -height/2, width/2, -height/2 + radius)
  shape.lineTo(width/2, height/2 - radius)
  shape.quadraticCurveTo(width/2, height/2, width/2 - radius, height/2)
  shape.lineTo(-width/2 + radius, height/2)
  shape.quadraticCurveTo(-width/2, height/2, -width/2, height/2 - radius)
  shape.lineTo(-width/2, -height/2 + radius)
  shape.quadraticCurveTo(-width/2, -height/2, -width/2 + radius, -height/2)

  const extrudeSettings = {
    depth: 6,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelSegments: 3
  }
  
  return (
    <group ref={containerRef}>
      <mesh position={[0, 0, -3]}>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshPhysicalMaterial
          ref={glowRef}
          color="#F58220"
          transparent
          opacity={0.08}
          roughness={0.3}
          metalness={0.1}
          emissive="#F58220"
          emissiveIntensity={0.3}
          side={THREE.BackSide}
        />
      </mesh>
      
      <mesh position={[0, 0, -3]}>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.06}
          roughness={0.1}
          metalness={0.1}
          transmission={0.95}
          thickness={0.5}
        />
      </mesh>
    </group>
  )
}

function Scene({ mousePos, isHovered }) {
  const cameraRef = useRef()
  const spotlightRef = useRef()
  
  useFrame((state) => {
    if (cameraRef.current) {
      cameraRef.current.position.x = 5 + Math.sin(state.clock.elapsedTime * 0.08) * 0.02
      cameraRef.current.position.y = 3.5 + Math.cos(state.clock.elapsedTime * 0.1) * 0.02
    }
    if (spotlightRef.current) {
      spotlightRef.current.position.x = mousePos.x * 3
      spotlightRef.current.position.z = mousePos.y * 3
      const targetIntensity = isHovered ? 8 : 0
      spotlightRef.current.intensity += (targetIntensity - spotlightRef.current.intensity) * 0.1
    }
  })
  
  return (
    <>
      <OrthographicCamera 
        ref={cameraRef}
        makeDefault 
        position={[5, 3.5, 7]} 
        zoom={75}
        rotation={[-0.3, 0.55, 0.14]}
      />

      <ambientLight intensity={0.45} color="#ffffff" />
      
      <directionalLight
        position={[7, 10, 5]}
        intensity={1.3}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      <pointLight 
        position={[-5, 2.5, 4]} 
        intensity={10} 
        color="#F58220"
        distance={12}
        decay={2}
      />

      <pointLight 
        position={[4, 1.5, -3]} 
        intensity={5} 
        color="#ff9955"
        distance={9}
        decay={2}
      />

      <spotLight
        position={[0, 6, 2]}
        angle={0.5}
        penumbra={0.9}
        intensity={0.6}
        castShadow
      />
      
      <spotLight
        ref={spotlightRef}
        position={[0, 5, 3]}
        angle={0.4}
        penumbra={1}
        intensity={0}
        color="#ffffff"
        distance={10}
      />

      <MovingPapers />
      <ConveyorBelt />
      <GlassContainer mousePos={mousePos} isHovered={isHovered} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.55, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <shadowMaterial opacity={0.16} />
      </mesh>
    </>
  )
}

export default function HeroVisual() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    setMousePos({ x: x * 0.5, y: y * 0.5 })
  }
  
  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => setIsHovered(false)
  
  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ width: '100%', height: '100%' }}
    >
      <Canvas shadows>
        <Scene mousePos={mousePos} isHovered={isHovered} />
      </Canvas>
    </div>
  )
}