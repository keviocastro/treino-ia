import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

import benchPressAnimation from '../assets/exercises/bench-press.json';
import squatAnimation from '../assets/exercises/squat.json';
import tricepsCordaAnimation from '../assets/exercises/triceps-corda.json';
import puxadaFrontalAnimation from '../assets/exercises/puxada-frontal.json';
import abdominalAnimation from '../assets/exercises/abdominal.json';

const animationMap: Record<string, any> = {
  'supino reto com barra': benchPressAnimation,
  'supino': benchPressAnimation,
  'agachamento': squatAnimation,
  'agachamento livre': squatAnimation,
  'tríceps corda': tricepsCordaAnimation,
  'tríceps na polia com corda': tricepsCordaAnimation,
  'puxada frontal': puxadaFrontalAnimation,
  'abdominal': abdominalAnimation,
  'exercício abdominal completo': abdominalAnimation,
  'crucifixo com halteres': benchPressAnimation, // Fallback to bench press for now
  'rosca direta': benchPressAnimation, // Fallback to bench press for now
  'stiff': squatAnimation, // Fallback to squat for now
  'desenvolvimento com halteres': benchPressAnimation, // Fallback to bench press for now
};

const defaultAnimation = benchPressAnimation;

interface ExerciseAnimationProps {
  exerciseName: string;
  width?: number;
  height?: number;
}

const ExerciseAnimation: React.FC<ExerciseAnimationProps> = ({ 
  exerciseName, 
  width = 200, 
  height = 200 
}) => {
  const [animationData, setAnimationData] = useState<any>(defaultAnimation);
  
  useEffect(() => {
    try {
      const lowerCaseName = exerciseName.toLowerCase();
      console.log(`ExerciseAnimation: Rendering for "${lowerCaseName}"`);
      
      if (animationMap[lowerCaseName]) {
        console.log(`ExerciseAnimation: Direct match found for "${lowerCaseName}"`);
        setAnimationData(animationMap[lowerCaseName]);
        return;
      }
      
      for (const [key, animation] of Object.entries(animationMap)) {
        if (lowerCaseName.includes(key) || key.includes(lowerCaseName)) {
          console.log(`ExerciseAnimation: Partial match found - "${lowerCaseName}" matches "${key}"`);
          setAnimationData(animation);
          return;
        }
      }
      
      console.log(`ExerciseAnimation: No match found, using default animation for "${lowerCaseName}"`);
      setAnimationData(defaultAnimation);
    } catch (error) {
      console.error("Error loading animation:", error);
      setAnimationData(defaultAnimation);
    }
  }, [exerciseName]);

  return (
    <div className="exercise-animation" style={{ 
      width, 
      height, 
      border: '1px solid #e5e7eb', 
      borderRadius: '8px', 
      padding: '8px', 
      backgroundColor: '#f9fafb',
      overflow: 'hidden'
    }}>
      {animationData ? (
        <Lottie 
          animationData={animationData} 
          loop={true} 
          autoplay={true}
          style={{ width: '100%', height: '100%' }}
          rendererSettings={{
            preserveAspectRatio: 'xMidYMid slice'
          }}
        />
      ) : (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '100%'
        }}>
          Carregando animação...
        </div>
      )}
    </div>
  );
};

export default ExerciseAnimation;
