import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Simple rotating cube for background
const BackgroundCube = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle rotation
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -5]} scale={[2, 2, 2]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial 
        color="#10b981" 
        opacity={0.1} 
        transparent 
      />
    </mesh>
  );
};

// Animated background component
export const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <ambientLight intensity={0.1} />
        <BackgroundCube />
      </Canvas>
    </div>
  );
};