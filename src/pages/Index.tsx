import React, { useState, useEffect } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { Mascot } from '@/components/Mascot';
import { TopicCategories } from '@/components/TopicCategories';
import { SearchResult } from '@/components/SearchResult';
import { DailySpotlight } from '@/components/DailySpotlight';
import { LoadingAnimation } from '@/components/LoadingAnimation';
import { getKidFriendlyAnswer, getDailyTopic, DailyTopic } from '@/lib/openai';
import { speakText } from '@/lib/textToSpeech';
import { toast } from 'sonner';



const Index = () => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [dailyTopic, setDailyTopic] = useState<DailyTopic>({
    topic: "Loading...",
    description: "Getting today's exciting topic!",
    emoji: "⏳"
  });
  const [mascotMessage, setMascotMessage] = useState("Hi! I'm Quest the Owl! Ask me anything you want to learn about! 🦉");
  const [mascotEmotion, setMascotEmotion] = useState<'happy' | 'excited' | 'thinking' | 'waving'>('waving');

  useEffect(() => {
    // Fetch daily topic from OpenAI
    const fetchDailyTopic = async () => {
      try {
        const topic = await getDailyTopic();
        setDailyTopic(topic);
      } catch (error) {
        console.error('Error fetching daily topic:', error);
        // Keep the loading state as fallback
      }
    };

    fetchDailyTopic();
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
      {/* Forest Theme Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Sky gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-200 via-blue-100 to-green-50"></div>
        
        {/* Clouds */}
        <div className="absolute top-10 left-20 text-8xl opacity-40 animate-float">☁️</div>
        <div className="absolute top-20 right-32 text-6xl opacity-30 animate-float" style={{ animationDelay: '3s' }}>☁️</div>
        <div className="absolute top-5 right-1/3 text-7xl opacity-40 animate-float" style={{ animationDelay: '1.5s' }}>☁️</div>
        
        {/* Sun */}
        <div className="absolute top-10 right-20 text-8xl animate-[spin_12s_linear_infinite]">☀️</div>
        
        {/* Trees */}
        <div className="absolute bottom-0 left-0 text-[200px] opacity-80">🌲</div>
        <div className="absolute bottom-0 left-32 text-[180px] opacity-70">🌳</div>
        <div className="absolute bottom-0 right-0 text-[200px] opacity-80">🌲</div>
        <div className="absolute bottom-0 right-40 text-[160px] opacity-75">🌳</div>
        <div className="absolute bottom-0 left-1/3 text-[190px] opacity-85">🌲</div>
        <div className="absolute bottom-0 right-1/3 text-[170px] opacity-70">🌳</div>
        
        {/* Animated Forest Animals */}
        <div className="absolute bottom-20 left-10 text-6xl animate-bounce-gentle" style={{ animationDelay: '0.5s' }}>🐰</div>
        <div className="absolute bottom-32 right-20 text-5xl animate-wiggle">🦝</div>
        <div className="absolute bottom-16 left-1/4 text-5xl animate-bounce-gentle" style={{ animationDelay: '2s' }}>🦊</div>
        <div className="absolute bottom-40 right-1/3 text-4xl animate-float" style={{ animationDelay: '1s' }}>🦋</div>
        <div className="absolute bottom-24 right-1/4 text-6xl animate-bounce-gentle" style={{ animationDelay: '3s' }}>🐻</div>
        <div className="absolute bottom-10 left-1/2 text-4xl animate-wiggle" style={{ animationDelay: '1.5s' }}>🐸</div>
        
        {/* Birds flying */}
        <div className="absolute top-32 left-1/4 text-4xl animate-float">🦜</div>
        <div className="absolute top-40 right-1/2 text-3xl animate-float" style={{ animationDelay: '2s' }}>🐦</div>
        <div className="absolute top-28 right-1/4 text-4xl animate-float" style={{ animationDelay: '4s' }}>🦅</div>
        
        {/* Flowers and decorations */}
        <div className="absolute bottom-5 left-16 text-3xl">🌻</div>
        <div className="absolute bottom-8 right-32 text-3xl">🌺</div>
        <div className="absolute bottom-3 left-1/3 text-2xl">🌼</div>
        <div className="absolute bottom-6 right-1/2 text-3xl">🌷</div>
        <div className="absolute bottom-4 left-2/3 text-2xl">🌸</div>
        
        {/* Mushrooms */}
        <div className="absolute bottom-12 left-40 text-3xl">🍄</div>
        <div className="absolute bottom-8 right-2/3 text-2xl">🍄</div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-6 max-w-7xl">
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

      {/* Footer */}
      <footer className="relative z-10 mt-12 pb-6">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-end">
            <button
              onClick={() => window.location.href = 'mailto:thoughtloom2025@gmail.com?subject=Feedback%20for%20KidQuest&body=Hi%20there,%0A%0AI%20have%20some%20feedback%20or%20suggestions%20for%20KidQuest:%0A%0A'}
              className="inline-flex items-center gap-2 px-4 py-2 text-black hover:text-primary transition-colors duration-300 group text-sm"
              title="Send Feedback"
            >
              <span className="text-lg group-hover:animate-bounce">💌</span>
              <span className="font-medium">Feedback/Suggestions</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
