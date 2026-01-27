"use client";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";

function FloatingShard({ position, color, speed, rotationIntensity }) {
  const mesh = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    mesh.current.rotation.x = Math.cos(t / 4) / 2;
    mesh.current.rotation.y = Math.sin(t / 4) / 2;
  });

  return (
    <Float 
      speed={speed} 
      rotationIntensity={rotationIntensity} 
      floatIntensity={2}
    >
      <mesh ref={mesh} position={position}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.1} 
          metalness={0.8} 
          transparent 
          opacity={0.2} 
          wireframe
        />
      </mesh>
    </Float>
  );
}

export default function SentimentScene({ sentiment = "neutral" }) {
  const isNegative = sentiment.toLowerCase().includes("negative") || sentiment.toLowerCase().includes("polarized");
  const color = isNegative ? "#f43f5e" : "#10b981"; // Rose vs Emerald

  return (
    <div className="absolute inset-0 z-0 opacity-30 pointer-events-none overflow-hidden rounded-3xl">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        {/* Main Floating Element */}
        <FloatingShard position={[3, 1, 0]} color={color} speed={2} rotationIntensity={1.5} />
        <FloatingShard position={[-3, -2, -2]} color={color} speed={1.5} rotationIntensity={1} />
        <FloatingShard position={[0, 3, -5]} color="#71717a" speed={1} rotationIntensity={0.5} />
        
        {/* Fog to blend edges */}
        <fog attach="fog" args={['#18181b', 5, 20]} /> 
      </Canvas>
    </div>
  );
}
