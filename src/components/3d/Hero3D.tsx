import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Simple 3D Cube component
const SpinningCube = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle rotation
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} scale={[1, 1, 1]}>
      <boxGeometry args={[1, 1, 1]} />
      <MeshDistortMaterial 
        color="#10b981" 
        speed={1} 
        distort={0.2} 
        opacity={0.9} 
        transparent 
      />
    </mesh>
  );
};

// Main 3D Hero component
export const Hero3D = () => {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[0, 5, 0]} angle={0.3} intensity={0.5} />
        
        {/* Simple spinning cube */}
        <SpinningCube />
      </Canvas>
    </div>
  );
};