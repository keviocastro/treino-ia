import React from 'react';
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
  const getAnimation = () => {
    const lowerCaseName = exerciseName.toLowerCase();
    
    if (animationMap[lowerCaseName]) {
      return animationMap[lowerCaseName];
    }
    
    for (const [key, animation] of Object.entries(animationMap)) {
      if (lowerCaseName.includes(key) || key.includes(lowerCaseName)) {
        return animation;
      }
    }
    
    return defaultAnimation;
  };

  return (
    <div className="exercise-animation" style={{ width, height }}>
      <Lottie 
        animationData={getAnimation()} 
        loop={true} 
        autoplay={true}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default ExerciseAnimation;
