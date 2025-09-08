import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, TrendingUp } from 'lucide-react';

interface DailySpotlightProps {
  topic: string;
  description: string;
  imageUrl?: string;
  onClick: () => void;
}

export const DailySpotlight: React.FC<DailySpotlightProps> = ({ 
  topic, 
  description, 
  imageUrl,
  onClick 
}) => {
  return (
    <Card className="relative overflow-hidden bg-gradient-candy p-6 rounded-3xl shadow-card hover:shadow-glow transition-all duration-300 cursor-pointer"
          onClick={onClick}>
      <div className="absolute top-2 right-2">
        <div className="bg-fun-yellow px-3 py-1 rounded-full flex items-center gap-1 animate-bounce-gentle">
          <Star className="h-4 w-4 text-white fill-white" />
          <span className="text-xs font-bold text-white">TODAY'S PICK!</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4 mt-4">
        {imageUrl && (
          <div className="flex-shrink-0">
            <img 
              src={imageUrl} 
              alt={topic} 
              className="w-24 h-24 object-cover rounded-2xl shadow-soft"
            />
          </div>
        )}
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-fun-orange" />
            <h3 className="text-xl font-bold text-foreground">{topic}</h3>
          </div>
          <p className="text-foreground/80 mb-3">{description}</p>
          <Button 
            className="bg-gradient-sunset border-0 text-white hover:scale-105 transition-transform duration-300 rounded-full px-4 py-1 text-sm"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            Learn More! →
          </Button>
        </div>
      </div>
    </Card>
  );
};