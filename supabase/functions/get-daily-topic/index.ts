import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a creative educational assistant for children aged 6-12.
            Generate a single, interesting daily topic for kids to explore and learn about.
            
            Format your response as JSON with this structure:
            {
              "topic": "Topic Name",
              "description": "One interesting fact or question about the topic (max 2 sentences)",
              "emoji": "🎯"
            }
            
            Topics should be:
            - Educational but fun
            - Age-appropriate for 6-12 year olds
            - Diverse (science, nature, history, space, animals, etc.)
            - Engaging and spark curiosity`
          },
          {
            role: 'user',
            content: 'Generate a fun daily learning topic for kids.'
          }
        ],
        temperature: 0.9,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error('Failed to get response from OpenAI');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    console.log('OpenAI response received:', content);
    
    try {
      // Try to extract JSON from the content
      let jsonContent = content;
      
      // Remove markdown code blocks if present
      jsonContent = jsonContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Try to find JSON object in the content
      const jsonMatch = jsonContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonContent = jsonMatch[0];
      }
      
      const parsed = JSON.parse(jsonContent);
      
      return new Response(
        JSON.stringify({
          topic: parsed.topic || "Giant Pandas",
          description: parsed.description || "Did you know pandas spend 14 hours a day eating bamboo?",
          emoji: parsed.emoji || "🐼"
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      console.log('Raw content:', content);
      
      // Fallback to default topic
      return new Response(
        JSON.stringify({
          topic: "Giant Pandas",
          description: "Did you know pandas spend 14 hours a day eating bamboo?",
          emoji: "🐼"
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error in get-daily-topic function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred',
        topic: "Giant Pandas",
        description: "Did you know pandas spend 14 hours a day eating bamboo?",
        emoji: "🐼"
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});