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
      <div className="relative group">
        {/* Playful sparkles around mascot */}
        <div className="absolute -top-4 -left-4 text-xl animate-pulse">✨</div>
        <div className="absolute -bottom-3 -right-3 text-lg animate-pulse" style={{ animationDelay: '0.5s' }}>⭐</div>
        <div className="absolute top-1/2 -left-6 text-sm animate-pulse" style={{ animationDelay: '1s' }}>🌟</div>
        
        {/* Main mascot container with happy face */}
        <div className="relative w-24 h-24 bg-gradient-candy rounded-full flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
          {/* Giraffe with happy expression */}
          <div className="text-5xl animate-bounce-gentle hover:animate-spin-slow cursor-pointer">
            🦒
          </div>
          
          {/* Happy face overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex gap-3 mb-2">
              <div className="w-2 h-2 bg-background rounded-full animate-blink"></div>
              <div className="w-2 h-2 bg-background rounded-full animate-blink" style={{ animationDelay: '0.1s' }}></div>
            </div>
            <div className="absolute bottom-6 w-8 h-3 border-b-2 border-background rounded-b-full"></div>
          </div>
        </div>
        
        {/* Emotion indicator with bounce */}
        <div className="absolute -top-2 -right-2 text-2xl animate-bounce">
          {getEmoji()}
        </div>
        
        {/* Playful spots that appear on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute top-2 right-2 w-2 h-2 bg-pastel-yellow rounded-full"></div>
          <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-pastel-pink rounded-full"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-pastel-blue rounded-full"></div>
        </div>
      </div>
      
      {message && (
        <div className="relative animate-fade-in">
          <div className="bg-card px-4 py-2 rounded-2xl shadow-soft hover:shadow-medium transition-shadow duration-300">
            <p className="text-foreground font-medium">{message}</p>
          </div>
          <div className="absolute -left-2 top-3 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-card border-b-8 border-b-transparent"></div>
        </div>
      )}
    </div>
  );
};