import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoIcon } from 'lucide-react';

interface AnimalData {
  name: string;
  value: number;
  color: string;
  unit: string;
}

export const LivestockAntibioticGraph = () => {
  const [animationComplete, setAnimationComplete] = useState(false);
  
  // Data from the image
  const antibioticData: AnimalData[] = [
    { name: 'Sheep', value: 243, color: '#8a7a9e', unit: 'mg' },
    { name: 'Pigs', value: 173, color: '#8a7a9e', unit: 'mg of antibiotics per kilogram of meat' },
    { name: 'Cattle', value: 60, color: '#8a7a9e', unit: 'mg of antibiotics per kilogram of meat' },
    { name: 'Chicken', value: 35, color: '#8a7a9e', unit: 'mg of antibiotics per kilogram of meat' }
  ];

  // Sort data by value in descending order
  const sortedData = [...antibioticData].sort((a, b) => b.value - a.value);

  // Calculate the maximum value for scaling
  const maxValue = Math.max(...sortedData.map(item => item.value));
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const barVariants = {
    hidden: { width: 0, opacity: 0 },
    visible: (custom: number) => ({
      width: `${(custom / maxValue) * 100}%`,
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeOut"
      }
    })
  };

  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Livestock Antibiotic Usage</CardTitle>
          <InfoIcon className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Antibiotic use measured in mg per kg of animal product (2020 global average)
        </p>
      </CardHeader>
      <CardContent>
        <motion.div
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {sortedData.map((animal, index) => (
            <div key={animal.name} className="space-y-1">
              <div className="flex items-center justify-between">
                <motion.div className="flex items-center" variants={textVariants}>
                  <div className="w-8 h-8 flex items-center justify-center bg-muted rounded-md mr-2">
                    {animal.name === 'Sheep' && <span className="text-lg">🐑</span>}
                    {animal.name === 'Pigs' && <span className="text-lg">🐖</span>}
                    {animal.name === 'Cattle' && <span className="text-lg">🐄</span>}
                    {animal.name === 'Chicken' && <span className="text-lg">🐔</span>}
                  </div>
                  <span className="font-medium">{animal.name}</span>
                </motion.div>
                <motion.div 
                  className="text-right font-semibold"
                  variants={textVariants}
                >
                  {animationComplete ? animal.value : '0'} mg
                </motion.div>
              </div>
              <div className="relative h-6 bg-muted rounded-md overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full rounded-md"
                  style={{ backgroundColor: animal.color }}
                  custom={animal.value}
                  variants={barVariants}
                />
                {animal.name !== 'Sheep' && (
                  <motion.div 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-white font-medium"
                    variants={textVariants}
                  >
                    {animationComplete && "per kg of meat"}
                  </motion.div>
                )}
              </div>
            </div>
          ))}
        </motion.div>
        <motion.div 
          className="mt-4 text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <p>Note: Based on antibiotics classified as "medically important".</p>
          <p>Source: Ranya Mulchandani et al. (2023). Global trends in antimicrobial use in food-producing animals: 2020 to 2030.</p>
        </motion.div>
      </CardContent>
    </Card>
  );
};