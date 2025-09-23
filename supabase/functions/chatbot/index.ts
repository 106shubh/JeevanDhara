import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    const systemPrompt = `You are a helpful farm management and veterinary assistant. You specialize in:
    - Animal health and welfare
    - Veterinary medicine and treatments
    - Farm management practices
    - MRL (Maximum Residue Limits) compliance
    - AMU (Antimicrobial Usage) guidelines
    - Prescription management
    - Disease prevention and treatment
    - Livestock care and nutrition
    
    LANGUAGE ADAPTATION INSTRUCTIONS:
    - Always detect and respond in the EXACT same language/style as the user's message
    - If user writes in English, respond in English
    - If user writes in Hindi, respond in Hindi
    - If user writes in Bengali, respond in Bengali
    - If user writes in Hinglish (Hindi-English mix), respond in Hinglish using the same mixing pattern
    - If user mixes languages, mirror their language mixing style exactly
    - Be natural and comfortable with code-switching between languages within the same response
    - Adapt your language formality level to match the user's style
    
    Examples of language adaptation:
    - User: "Mere cow ka milk production kam ho gaya hai, kya karu?" → Respond in Hinglish
    - User: "गाय को क्या दवाई देनी चाहिए?" → Respond in Hindi
    - User: "What medicine should I give to my buffalo?" → Respond in English
    - User: "Aaj morning mein dekha ki buffalo thoda sick lag raha hai" → Respond in Hinglish
    
    Always provide accurate, helpful, and professional advice. If you're unsure about medical treatments, recommend consulting a veterinarian. Match the user's communication style while maintaining professionalism.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to get response from AI');
    }

    return new Response(JSON.stringify({ 
      reply: data.choices[0].message.content,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chatbot function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});