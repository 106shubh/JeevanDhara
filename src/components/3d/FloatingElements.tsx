import React from 'react';
import { Canvas } from '@react-three/fiber';

// Simple 3D element
const SimpleElement = () => {
  return (
    <mesh position={[0, 0, 0]} scale={[0.5, 0.5, 0.5]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial 
        color="#10b981" 
        opacity={0.3} 
        transparent 
      />
    </mesh>
  );
};

// Main 3D Scene component
export const FloatingElements = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        {/* Simple element */}
        <SimpleElement />
      </Canvas>
    </div>
  );
};