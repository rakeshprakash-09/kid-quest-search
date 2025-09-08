import React, { useState, useRef } from 'react';
import { Search, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice search is not supported in your browser. Please try Chrome or Edge!');
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setIsListening(true);
    };

    recognitionRef.current.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');
      setQuery(transcript);
    };

    recognitionRef.current.onerror = () => {
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      if (query.trim()) {
        onSearch(query.trim());
      }
    };

    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-3xl mx-auto">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-rainbow opacity-75 blur-xl group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
        <div className="relative flex items-center bg-card rounded-full shadow-card hover:shadow-glow transition-all duration-300">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask me anything! What do you want to learn about? 🌟"
            className="flex-1 border-0 bg-transparent text-lg py-6 pl-6 pr-4 rounded-full placeholder:text-muted-foreground focus:outline-none focus:ring-0"
            disabled={isLoading}
          />
          
          <div className="flex items-center gap-2 pr-2">
            <Button
              type="button"
              onClick={toggleVoiceInput}
              variant="ghost"
              size="icon"
              className={`rounded-full hover:bg-pastel-purple transition-all duration-300 ${
                isListening ? 'animate-pulse-glow bg-fun-pink' : ''
              }`}
              disabled={isLoading}
            >
              {isListening ? (
                <MicOff className="h-5 w-5 text-fun-pink" />
              ) : (
                <Mic className="h-5 w-5 text-fun-purple" />
              )}
            </Button>
            
            <Button
              type="submit"
              size="icon"
              className="rounded-full bg-gradient-sunset hover:scale-110 transition-all duration-300 border-0"
              disabled={isLoading || !query.trim()}
            >
              <Search className="h-5 w-5 text-white" />
            </Button>
          </div>
        </div>
      </div>
      
      {isListening && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-fun-purple text-sm animate-bounce-gentle">
          🎤 I'm listening... Speak clearly!
        </div>
      )}
    </form>
  );
};