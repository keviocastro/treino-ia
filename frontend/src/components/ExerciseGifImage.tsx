import React from 'react';

interface ExerciseGifImageProps {
  exerciseName: string;
  width?: number;
  height?: number;
}

const gifMap: Record<string, string> = {
  'supino reto com barra': '/images/exercises/bench-press.gif',
  'supino': '/images/exercises/bench-press.gif',
  'agachamento': '/images/exercises/squat.gif',
  'agachamento livre': '/images/exercises/squat.gif',
  'tríceps corda': '/images/exercises/triceps-corda.gif',
  'tríceps na polia com corda': '/images/exercises/triceps-corda.gif',
  'puxada frontal': '/images/exercises/puxada-frontal.gif',
  'abdominal': '/images/exercises/abdominal.gif',
  'exercício abdominal completo': '/images/exercises/abdominal.gif',
  'crucifixo com halteres': '/images/exercises/bench-press.gif',
  'rosca direta': '/images/exercises/rosca-direta.gif',
  'stiff': '/images/exercises/stiff.gif',
  'desenvolvimento com halteres': '/images/exercises/desenvolvimento.gif',
  'elevação lateral': '/images/exercises/elevacao-lateral.gif'
};

const defaultGif = '/images/exercises/bench-press.gif';

const ExerciseGifImage: React.FC<ExerciseGifImageProps> = ({ 
  exerciseName, 
  width = 200, 
  height = 200 
}) => {
  const getGifPath = (name: string): string => {
    try {
      const lowerCaseName = name.toLowerCase();
      console.log(`ExerciseGifImage: Finding GIF for "${lowerCaseName}"`);
      
      if (gifMap[lowerCaseName]) {
        console.log(`ExerciseGifImage: Direct match found for "${lowerCaseName}"`);
        return gifMap[lowerCaseName];
      }
      
      for (const [key, gifPath] of Object.entries(gifMap)) {
        if (lowerCaseName.includes(key) || key.includes(lowerCaseName)) {
          console.log(`ExerciseGifImage: Partial match found - "${lowerCaseName}" matches "${key}"`);
          return gifPath;
        }
      }
      
      console.log(`ExerciseGifImage: No match found, using default GIF for "${lowerCaseName}"`);
      return defaultGif;
    } catch (error) {
      console.error("Error finding GIF:", error);
      return defaultGif;
    }
  };

  const gifPath = getGifPath(exerciseName);

  return (
    <div className="exercise-gif-container" style={{ 
      width, 
      height, 
      border: '1px solid #e5e7eb', 
      borderRadius: '8px', 
      padding: '8px', 
      backgroundColor: '#f9fafb',
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <img 
        src={gifPath} 
        alt={`Como fazer ${exerciseName}`} 
        style={{ 
          maxWidth: '100%', 
          maxHeight: '100%', 
          objectFit: 'contain' 
        }} 
      />
      <div className="exercise-gif-caption" style={{
        position: 'absolute',
        bottom: '8px',
        left: '0',
        right: '0',
        textAlign: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        color: 'white',
        padding: '4px',
        fontSize: '12px'
      }}>
        Como fazer: {exerciseName}
      </div>
    </div>
  );
};

export default ExerciseGifImage;
