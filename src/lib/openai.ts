import { supabase } from "@/integrations/supabase/client";

export interface OpenAIResponse {
  answer: string;
  funFacts: string[];
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