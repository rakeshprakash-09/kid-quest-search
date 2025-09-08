export interface OpenAIResponse {
  answer: string;
  funFacts: string[];
}

export function getApiKey(): string | null {
  return localStorage.getItem('openai_api_key');
}

export async function getKidFriendlyAnswer(query: string): Promise<OpenAIResponse> {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    // Return a fallback response if API key is not set
    return {
      answer: "Please set up your OpenAI API key first by clicking the settings button!",
      funFacts: ["I need an API key to help you learn!", "Ask your parent or teacher to help set it up!", "Once set up, I can answer all your questions!"]
    };
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a friendly educational assistant for children aged 6-12. 
            Your responses should be:
            - Simple and easy to understand
            - Safe and age-appropriate
            - Encouraging and positive
            - Maximum 3-4 sentences for the main answer
            - Include 3 fun facts related to the topic
            
            Format your response as JSON with this structure:
            {
              "answer": "main explanation here",
              "funFacts": ["fact 1", "fact 2", "fact 3"]
            }`
          },
          {
            role: 'user',
            content: query
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get response');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      const parsed = JSON.parse(content);
      return {
        answer: parsed.answer || "Let me help you learn about that!",
        funFacts: parsed.funFacts || []
      };
    } catch {
      // If JSON parsing fails, return the content as answer
      return {
        answer: content,
        funFacts: []
      };
    }
  } catch (error) {
    console.error('Error getting answer:', error);
    return {
      answer: "Oops! I'm having trouble finding that information right now. Try asking something else!",
      funFacts: []
    };
  }
}