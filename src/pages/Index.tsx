import React, { useState, useEffect } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { Mascot } from '@/components/Mascot';
import { TopicCategories } from '@/components/TopicCategories';
import { SearchResult } from '@/components/SearchResult';
import { DailySpotlight } from '@/components/DailySpotlight';
import { LoadingAnimation } from '@/components/LoadingAnimation';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { getKidFriendlyAnswer, getApiKey } from '@/lib/openai';
import { speakText } from '@/lib/textToSpeech';
import { toast } from 'sonner';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Daily spotlight topics that rotate
const spotlightTopics = [
  { topic: "Giant Pandas", description: "Did you know pandas spend 14 hours a day eating bamboo?", emoji: "🐼" },
  { topic: "The Solar System", description: "Jupiter is so big that all other planets could fit inside it!", emoji: "🪐" },
  { topic: "Rainforests", description: "The Amazon rainforest produces 20% of the world's oxygen!", emoji: "🌳" },
  { topic: "Ancient Egypt", description: "The pyramids were built over 4,500 years ago!", emoji: "🔺" },
  { topic: "Ocean Life", description: "The ocean is home to the largest animal ever - the blue whale!", emoji: "🐋" },
];

const Index = () => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [dailyTopic, setDailyTopic] = useState(spotlightTopics[0]);
  const [mascotMessage, setMascotMessage] = useState("Hi! I'm Quest the Owl! Ask me anything you want to learn about! 🦉");
  const [mascotEmotion, setMascotEmotion] = useState<'happy' | 'excited' | 'thinking' | 'waving'>('waving');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  useEffect(() => {
    // Rotate daily topic based on day
    const dayIndex = new Date().getDay() % spotlightTopics.length;
    setDailyTopic(spotlightTopics[dayIndex]);
    
    // Check if API key exists on mount
    if (!getApiKey()) {
      setShowApiKeyModal(true);
    }
  }, []);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setHasSearched(true);
    setSearchResults([]);
    setMascotMessage("Let me find that for you...");
    setMascotEmotion('thinking');

    try {
      const response = await getKidFriendlyAnswer(query);
      
      setSearchResults([{
        answer: response.answer,
        funFacts: response.funFacts,
        query: query
      }]);
      
      setMascotMessage("Great question! Here's what I found!");
      setMascotEmotion('excited');
      
      toast.success("Found some cool information for you! 🎉");
    } catch (error) {
      console.error('Search error:', error);
      toast.error("Oops! Something went wrong. Try again!");
      setMascotMessage("Hmm, I couldn't find that. Try asking something else!");
      setMascotEmotion('thinking');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryClick = (category: string) => {
    handleSearch(`Tell me about ${category}`);
  };

  const handleSpotlightClick = () => {
    handleSearch(dailyTopic.topic);
  };

  const handleSpeak = (text: string) => {
    speakText(text);
    toast.success("🔊 Reading aloud for you!");
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-pastel-pink rounded-full opacity-20 blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pastel-blue rounded-full opacity-20 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pastel-yellow rounded-full opacity-10 blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-6 max-w-7xl">
        {/* Settings Button */}
        <div className="absolute top-4 right-4">
          <Button
            onClick={() => setShowApiKeyModal(true)}
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-pastel-purple/20"
          >
            <Settings className="h-5 w-5 text-fun-purple" />
          </Button>
        </div>
        
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-rainbow bg-clip-text text-transparent mb-2 animate-bounce-gentle">
            KidQuest 🌟
          </h1>
          <p className="text-lg text-muted-foreground">Your Safe & Fun Learning Adventure!</p>
        </header>

        {/* Mascot */}
        <div className="flex justify-center mb-8">
          <Mascot message={mascotMessage} emotion={mascotEmotion} />
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Loading Animation */}
        {isLoading && (
          <div className="mb-8">
            <LoadingAnimation />
          </div>
        )}

        {/* Search Results */}
        {!isLoading && searchResults.length > 0 && (
          <div className="mb-8 space-y-4">
            {searchResults.map((result, index) => (
              <SearchResult
                key={index}
                answer={result.answer}
                funFacts={result.funFacts}
                onSpeak={handleSpeak}
              />
            ))}
          </div>
        )}

        {/* Home Content - Show when no search */}
        {!hasSearched && !isLoading && (
          <>
            {/* Daily Spotlight */}
            <div className="mb-8">
              <DailySpotlight
                topic={dailyTopic.topic}
                description={dailyTopic.description}
                onClick={handleSpotlightClick}
              />
            </div>

            {/* Topic Categories */}
            <div className="mb-8">
              <TopicCategories onCategoryClick={handleCategoryClick} />
            </div>
          </>
        )}

        {/* Back to Topics Button */}
        {hasSearched && !isLoading && (
          <div className="text-center mt-8">
            <button
              onClick={() => {
                setHasSearched(false);
                setSearchResults([]);
                setMascotMessage("What else would you like to explore?");
                setMascotEmotion('happy');
              }}
              className="px-6 py-3 bg-gradient-candy rounded-full font-semibold text-foreground hover:scale-105 transition-transform duration-300 shadow-soft"
            >
              ← Explore More Topics
            </button>
          </div>
        )}
      </div>
      
      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onSave={() => {
          toast.success("API key saved! Now you can search for anything!");
        }}
      />
    </div>
  );
};

export default Index;