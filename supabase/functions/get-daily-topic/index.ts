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
    console.log('Received request for daily topic');

    if (!openRouterApiKey) {
      throw new Error('OpenRouter API key is not configured');
    }

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
            content: `You are a creative educational assistant that generates engaging daily topics for children aged 6-12.

            Generate a unique, interesting topic that would fascinate kids. The topic should be:
            - Educational and safe for children
            - Something kids would find exciting and want to learn about
            - Different from common topics like dinosaurs, space, animals (be creative!)
            - Include a fun fact or surprising information

            Return your response as JSON with this exact structure:
            {
              "topic": "Topic Name (2-4 words)",
              "description": "A short, exciting description (1 sentence, max 15 words)",
              "emoji": "single relevant emoji"
            }

            Examples of good topics:
            - "Magic of Magnets"
            - "Rainbow Colors"
            - "Amazing Ants"
            - "Floating Clouds"
            - "Secret of Seeds"`
          },
          {
            role: 'user',
            content: 'Generate a fascinating daily topic for kids to explore today.'
          }
        ],
        temperature: 0.9,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenRouter API error:', error);
      throw new Error('Failed to get response from OpenRouter');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    console.log('OpenRouter response received for daily topic');

    try {
      const parsed = JSON.parse(content);
      return new Response(
        JSON.stringify({
          topic: parsed.topic || "Amazing Discoveries",
          description: parsed.description || "Every day brings something new and exciting to learn!",
          emoji: parsed.emoji || "✨"
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (parseError) {
      console.error('Error parsing OpenRouter response:', parseError);
      // If JSON parsing fails, return a default topic
      return new Response(
        JSON.stringify({
          topic: "Amazing Discoveries",
          description: "Every day brings something new and exciting to learn!",
          emoji: "✨"
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error in get-daily-topic function:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'An error occurred',
        topic: "Amazing Discoveries",
        description: "Every day brings something new and exciting to learn!",
        emoji: "✨"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
