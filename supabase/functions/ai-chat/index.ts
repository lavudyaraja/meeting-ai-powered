// Keep the XHR import which is still needed for fetch in Deno
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// Get the OpenAI API key from environment variables
// This should be set in your Supabase project settings
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

// Check if API key is set
if (!openAIApiKey) {
  console.error('OPENAI_API_KEY environment variable is not set');
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Use Deno.serve directly as shown in Supabase documentation
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Check if API key is available
  if (!openAIApiKey) {
    return new Response(JSON.stringify({ error: 'OpenAI API key is not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { messages } = await req.json();

    console.log('Received chat request with messages:', messages.length);

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
            content: 'You are an intelligent meeting assistant. Help users schedule meetings, manage tasks, and provide insights about their workflow. Be concise and helpful.' 
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    console.log('AI response generated successfully');

    return new Response(JSON.stringify({ message: generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});