import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface SearchResultProps {
  answer: string;
  funFacts?: string[];
  imageUrl?: string;
  onSpeak: (text: string) => void;
}

export const SearchResult: React.FC<SearchResultProps> = ({ 
  answer, 
  funFacts = [], 
  imageUrl,
  onSpeak 
}) => {
  const [showMoreFacts, setShowMoreFacts] = useState(false);
  
  return (
    <Card className="p-6 bg-card hover:bg-card-hover transition-colors duration-300 shadow-card rounded-3xl">
      <div className="space-y-4">
        {/* Main Answer Section */}
        <div className="flex gap-4">
          {imageUrl && (
            <div className="flex-shrink-0">
              <img 
                src={imageUrl} 
                alt="Topic illustration" 
                className="w-32 h-32 object-cover rounded-2xl shadow-soft"
              />
            </div>
          )}
          
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-lg text-foreground leading-relaxed">{answer}</p>
              <Button
                onClick={() => onSpeak(answer)}
                variant="ghost"
                size="icon"
                className="flex-shrink-0 rounded-full hover:bg-pastel-blue transition-all duration-300"
              >
                <Volume2 className="h-5 w-5 text-fun-blue" />
              </Button>
            </div>
          </div>
        </div>

        {/* Fun Facts Section */}
        {funFacts.length > 0 && (
          <div className="pt-4 border-t border-border">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-fun-yellow" />
              <h3 className="font-bold text-foreground">Cool Facts!</h3>
            </div>
            
            <div className="space-y-2">
              {funFacts.slice(0, showMoreFacts ? funFacts.length : 2).map((fact, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-fun-purple mt-1">•</span>
                  <p className="text-sm text-foreground/80">{fact}</p>
                </div>
              ))}
            </div>
            
            {funFacts.length > 2 && (
              <Button
                onClick={() => setShowMoreFacts(!showMoreFacts)}
                variant="ghost"
                size="sm"
                className="mt-2 text-fun-purple hover:text-fun-purple/80"
              >
                {showMoreFacts ? (
                  <>Show Less <ChevronUp className="ml-1 h-4 w-4" /></>
                ) : (
                  <>Show More Facts <ChevronDown className="ml-1 h-4 w-4" /></>
                )}
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};