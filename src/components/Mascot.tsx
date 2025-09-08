import React from 'react';

interface MascotProps {
  message?: string;
  emotion?: 'happy' | 'excited' | 'thinking' | 'waving';
}

export const Mascot: React.FC<MascotProps> = ({ message = "Hi there! I'm Quest!", emotion = 'happy' }) => {
  const getEmoji = () => {
    switch (emotion) {
      case 'excited': return '🎉';
      case 'thinking': return '🤔';
      case 'waving': return '👋';
      default: return '😊';
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <div className="w-20 h-20 bg-gradient-ocean rounded-full flex items-center justify-center text-4xl animate-float shadow-glow">
          🦉
        </div>
        <div className="absolute -top-2 -right-2 text-2xl animate-bounce-gentle">
          {getEmoji()}
        </div>
      </div>
      {message && (
        <div className="relative">
          <div className="bg-card px-4 py-2 rounded-2xl shadow-soft">
            <p className="text-foreground font-medium">{message}</p>
          </div>
          <div className="absolute -left-2 top-3 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-card border-b-8 border-b-transparent"></div>
        </div>
      )}
    </div>
  );
};