"use client";
import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { 
  MeshDistortMaterial, 
  Sphere, 
  Float,
  Environment,
  Stars
} from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

// The Sentient Core - Central 3D Orb
function SentientOrb({ state = "idle", sentiment = "neutral", progress = 0 }) {
  const meshRef = useRef();
  const lightRef = useRef();
  
  // Color based on sentiment result
  const colors = useMemo(() => {
    switch (sentiment) {
      case "positive":
        return { core: "#10b981", glow: "#34d399", ambient: "#064e3b" };
      case "negative":
        return { core: "#ef4444", glow: "#f87171", ambient: "#450a0a" };
      case "mixed":
        return { core: "#f59e0b", glow: "#fbbf24", ambient: "#451a03" };
      default:
        return { core: "#6366f1", glow: "#818cf8", ambient: "#1e1b4b" };
    }
  }, [sentiment]);

  // Animation parameters based on state
  const animParams = useMemo(() => {
    switch (state) {
      case "analyzing":
        return { 
          distort: 0.6 + (progress / 200), 
          speed: 3 + (progress / 20),
          emissive: 0.3,
          pulseSpeed: 0.1
        };
      case "result":
        return { distort: 0.3, speed: 1.5, emissive: 0.5, pulseSpeed: 0.02 };
      default: // idle
        return { distort: 0.2, speed: 1, emissive: 0.1, pulseSpeed: 0.015 };
    }
  }, [state, progress]);

  useFrame((frameState, delta) => {
    if (!meshRef.current) return;
    
    const time = frameState.clock.elapsedTime;
    
    // Gentle floating rotation
    meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
    meshRef.current.rotation.y += delta * 0.2;
    
    // Breathing scale effect
    const breathe = 1 + Math.sin(time * animParams.pulseSpeed * 10) * 0.03;
    meshRef.current.scale.setScalar(breathe * 2);
    
    // Pulsing light
    if (lightRef.current) {
      lightRef.current.intensity = 2 + Math.sin(time * 2) * 0.5;
    }
  });

  return (
    <group>
      {/* Main Orb */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Sphere ref={meshRef} args={[1, 128, 128]}>
          <MeshDistortMaterial
            color={colors.core}
            attach="material"
            distort={animParams.distort}
            speed={animParams.speed}
            roughness={0.1}
            metalness={0.8}
            emissive={colors.core}
            emissiveIntensity={animParams.emissive}
            envMapIntensity={1}
          />
        </Sphere>
      </Float>
      
      {/* Inner Glow Core */}
      <Sphere args={[0.7, 32, 32]}>
        <meshBasicMaterial 
          color={colors.glow} 
          transparent 
          opacity={0.3}
        />
      </Sphere>
      
      {/* Point Light at Center */}
      <pointLight
        ref={lightRef}
        color={colors.glow}
        intensity={2}
        distance={10}
        decay={2}
      />
    </group>
  );
}

// Particle Ring around the orb
function ParticleRing({ state }) {
  const pointsRef = useRef();
  const count = 1000;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 2.5 + Math.random() * 0.5;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, []);

  useFrame((frameState, delta) => {
    if (!pointsRef.current) return;
    const speed = state === "analyzing" ? 0.5 : 0.1;
    pointsRef.current.rotation.y += delta * speed;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#6366f1"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// Post-processing effects
function PostEffects({ state }) {
  const aberrationOffset = useMemo(() => {
    return state === "analyzing" 
      ? new THREE.Vector2(0.003, 0.003) 
      : new THREE.Vector2(0.001, 0.001);
  }, [state]);

  return (
    <EffectComposer>
      <Bloom
        intensity={1.5}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={aberrationOffset}
      />
      <Noise
        opacity={state === "analyzing" ? 0.15 : 0.05}
        blendFunction={BlendFunction.OVERLAY}
      />
      <Vignette
        offset={0.3}
        darkness={0.7}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}

// Camera controller for responsive positioning
function CameraRig() {
  const { camera, size } = useThree();
  
  useFrame(() => {
    // Adjust camera position based on viewport
    const isMobile = size.width < 768;
    const targetZ = isMobile ? 6 : 5;
    camera.position.z += (targetZ - camera.position.z) * 0.02;
  });
  
  return null;
}

// Loading fallback
function Loader() {
  return (
    <mesh>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial color="#1e1b4b" wireframe />
    </mesh>
  );
}

// Main Export
export default function CoreScene({ 
  state = "idle", // "idle" | "analyzing" | "result"
  sentiment = "neutral", // "positive" | "negative" | "mixed" | "neutral"
  progress = 0 // 0-100 for analyzing state
}) {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={<Loader />}>
          {/* Environment */}
          <color attach="background" args={["#030712"]} />
          <fog attach="fog" args={["#030712", 5, 15]} />
          <Environment preset="night" />
          <Stars 
            radius={50} 
            depth={50} 
            count={1000} 
            factor={2} 
            saturation={0} 
            fade 
            speed={0.5}
          />
          
          {/* Lighting */}
          <ambientLight intensity={0.2} />
          <directionalLight position={[5, 5, 5]} intensity={0.5} />
          <directionalLight position={[-5, -5, -5]} intensity={0.2} color="#6366f1" />
          
          {/* The Core */}
          <SentientOrb state={state} sentiment={sentiment} progress={progress} />
          <ParticleRing state={state} />
          
          {/* Post Processing */}
          <PostEffects state={state} />
          
          {/* Camera Control */}
          <CameraRig />
        </Suspense>
      </Canvas>
      
      {/* Gradient Overlay for text readability */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/60 via-transparent to-black/40" />
    </div>
  );
}
