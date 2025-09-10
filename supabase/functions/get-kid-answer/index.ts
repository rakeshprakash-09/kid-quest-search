import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Received request for kid-friendly answer');
    
    if (!openRouterApiKey) {
      throw new Error('OpenRouter API key is not configured');
    }

    const { query } = await req.json();
    
    if (!query) {
      throw new Error('Query is required');
    }

    console.log('Processing query:', query);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.3-70b-instruct:free',
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
      const error = await response.text();
      console.error('OpenRouter API error:', error);
      throw new Error('Failed to get response from OpenRouter');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    console.log('OpenRouter response received:', content);
    
    try {
      // Try to extract JSON from the content
      // Sometimes the model returns JSON wrapped in markdown code blocks
      let jsonContent = content;
      
      // Remove markdown code blocks if present
      jsonContent = jsonContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Try to find JSON object in the content
      const jsonMatch = jsonContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonContent = jsonMatch[0];
      }
      
      const parsed = JSON.parse(jsonContent);
      
      // Ensure funFacts is an array
      let funFacts = parsed.funFacts || [];
      if (typeof funFacts === 'string') {
        funFacts = [funFacts];
      }
      
      return new Response(
        JSON.stringify({
          answer: parsed.answer || "Let me help you learn about that!",
          funFacts: Array.isArray(funFacts) ? funFacts : []
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (parseError) {
      console.error('Error parsing OpenRouter response:', parseError);
      console.log('Raw content:', content);
      
      // Fallback: Try to extract answer and fun facts from plain text
      // Look for patterns like "funFacts": [...] in the text
      const funFactsMatch = content.match(/"funFacts":\s*\[(.*?)\]/s);
      let funFacts = [];
      
      if (funFactsMatch) {
        try {
          // Extract and parse the fun facts array
          funFacts = JSON.parse(`[${funFactsMatch[1]}]`);
        } catch (e) {
          console.error('Could not parse fun facts:', e);
        }
      }
      
      // Clean up the answer by removing the funFacts JSON if it's embedded
      let cleanAnswer = content;
      if (funFactsMatch) {
        cleanAnswer = content.replace(/"funFacts":\s*\[.*?\]/s, '').trim();
        // Also remove any trailing JSON syntax
        cleanAnswer = cleanAnswer.replace(/[,\}\{]*$/, '').trim();
      }
      
      return new Response(
        JSON.stringify({
          answer: cleanAnswer || content,
          funFacts: funFacts
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error in get-kid-answer function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred',
        answer: "Oops! I'm having trouble finding that information right now. Try asking something else!",
        funFacts: []
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
