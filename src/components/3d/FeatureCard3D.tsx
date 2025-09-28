import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// 3D Icon component
const Icon3D = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle rotation
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() / 2) * 0.1;
      meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() / 3) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} scale={[0.8, 0.8, 0.8]}>
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <MeshDistortMaterial 
        color="#10b981" 
        speed={0.5} 
        distort={0.1} 
        opacity={0.9} 
        transparent 
      />
    </mesh>
  );
};

// 3D Feature Card component
export const FeatureCard3D = ({ 
  icon, 
  title, 
  description,
  index
}: { 
  icon: JSX.Element;
  title: string;
  description: string;
  index: number;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={cardRef}
      className="bg-card p-6 rounded-xl shadow-sm border border-border hover:shadow-md transition-all duration-300 group relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      {/* 3D Icon Canvas */}
      <div className="mb-4 h-16 flex items-center justify-center">
        <div className="w-16 h-16">
          <Canvas camera={{ position: [0, 0, 2], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <Icon3D />
          </Canvas>
        </div>
      </div>
      
      {/* Content */}
      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </motion.div>
  );
};