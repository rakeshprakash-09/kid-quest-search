import { supabase } from "@/integrations/supabase/client";

export interface OpenAIResponse {
  answer: string;
  funFacts: string[];
}

export interface DailyTopic {
  topic: string;
  description: string;
  emoji: string;
}

export async function getKidFriendlyAnswer(query: string): Promise<OpenAIResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('get-kid-answer', {
      body: { query }
    });

    if (error) {
      console.error('Error calling edge function:', error);
      return {
        answer: "Oops! I'm having trouble finding that information right now. Try asking something else!",
        funFacts: []
      };
    }

    return {
      answer: data.answer || "Let me help you learn about that!",
      funFacts: data.funFacts || []
    };
  } catch (error) {
    console.error('Error getting answer:', error);
    return {
      answer: "Oops! I'm having trouble finding that information right now. Try asking something else!",
      funFacts: []
    };
  }
}

export async function getDailyTopic(): Promise<DailyTopic> {
  try {
    const { data, error } = await supabase.functions.invoke('get-daily-topic', {
      body: {}
    });

    if (error) {
      console.error('Error calling daily topic edge function:', error);
      // Fallback to a default topic
      return {
        topic: "Giant Pandas",
        description: "Did you know pandas spend 14 hours a day eating bamboo?",
        emoji: "🐼"
      };
    }

    return {
      topic: data.topic || "Giant Pandas",
      description: data.description || "Did you know pandas spend 14 hours a day eating bamboo?",
      emoji: data.emoji || "🐼"
    };
  } catch (error) {
    console.error('Error getting daily topic:', error);
    // Fallback to a default topic
    return {
      topic: "Giant Pandas",
      description: "Did you know pandas spend 14 hours a day eating bamboo?",
      emoji: "🐼"
    };
  }
}
