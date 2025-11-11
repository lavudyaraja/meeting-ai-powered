// Import necessary modules for Supabase Edge Functions
/// <reference types="deno" />
// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
// @ts-ignore - Deno imports are not recognized by Node.js TypeScript
import OpenAI from "https://deno.land/x/openai@v4.52.0/mod.ts";
// @ts-ignore - Deno imports are not recognized by Node.js TypeScript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (_req: Request) => {
  console.log("Function invoked with method:", _req.method);
  console.log("Function invoked with URL:", _req.url);
  
  if (_req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Simple health check endpoint
  if (_req.method === "GET") {
    return new Response(
      JSON.stringify({ 
        status: "ok", 
        message: "AI Translation function is running",
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" }, 
        status: 200 
      }
    );
  }

  if (_req.method !== "POST") {
    console.log("Method not allowed:", _req.method);
    return new Response(
      JSON.stringify({ error: "Method not allowed. Use POST." }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" }, 
        status: 405 
      }
    );
  }

  try {
    // Get the OpenAI API key from environment variables
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || 'https://ewsiwbxjjhjqhbgemkxo.supabase.co';
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY");
    
    console.log("Function started, API key present:", !!OPENAI_API_KEY);
    console.log("SUPABASE_URL:", SUPABASE_URL);
    console.log("SUPABASE_SERVICE_ROLE_KEY present:", !!SUPABASE_SERVICE_ROLE_KEY);

    // Parse the request body
    let requestData;
    try {
      requestData = await _req.json();
      console.log("Received request data:", JSON.stringify(requestData, null, 2));
    } catch (parseError) {
      const errorMsg = "Invalid JSON in request body";
      console.error(errorMsg, parseError);
      return new Response(
        JSON.stringify({ error: errorMsg }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    const { 
      meetingId, 
      sourceText, 
      sourceLanguage = "en", 
      targetLanguage = "es",
      speaker 
    } = requestData;
    
    // Validate required fields
    if (!meetingId || !sourceText) {
      const errorMsg = "Meeting ID and source text are required";
      console.error(errorMsg);
      return new Response(
        JSON.stringify({ error: errorMsg }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Create Supabase client
    console.log("Creating Supabase client...");
    // @ts-ignore - Deno runtime will handle this correctly
    const supabaseClient = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY || ''
    );
    
    // Prepare the prompt for OpenAI
    const prompt = `
      Translate the following text from ${sourceLanguage} to ${targetLanguage}.
      
      Text to translate:
      ${sourceText}
      
      Please provide only the translated text without any additional explanation.
    `;
    
    console.log("Prepared prompt for OpenAI:", prompt.substring(0, 100) + "...");
    
    // Check if the API key is available
    if (!OPENAI_API_KEY) {
      const errorMsg = "Missing OPENAI_API_KEY environment variable";
      console.error(errorMsg);
      return new Response(
        JSON.stringify({ 
          error: errorMsg,
          suggestion: "Please set the OPENAI_API_KEY as a Supabase secret"
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" }, 
          status: 500 
        }
      );
    }
    
    // Create OpenAI client
    console.log("Creating OpenAI client...");
    // @ts-ignore - Deno runtime will handle this correctly
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });

    // Call OpenAI API
    console.log("Calling OpenAI API...");
    
    let chatCompletion;
    try {
      // @ts-ignore - Deno runtime will handle this correctly
      chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: 'system',
            content: 'You are a professional translator. Translate the given text accurately while preserving meaning and context.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      });
      console.log("OpenAI API response received successfully");
    } catch (openaiError: any) {
      console.error("OpenAI API error:", openaiError);
      
      // Extract error message and status code
      const errorMessage = openaiError?.message || openaiError?.error?.message || "Unknown OpenAI error";
      const statusCode = openaiError?.status || openaiError?.response?.status || 500;
      const errorCode = openaiError?.code || openaiError?.error?.code || "";
      
      // Handle specific OpenAI errors
      let userFriendlyMessage = "An error occurred while processing your request with the AI service";
      let errorType = "unknown";
      
      // Check for quota exceeded errors (429 or insufficient_quota)
      if (statusCode === 429 || errorMessage.includes("429") || 
          errorMessage.includes("insufficient_quota") || 
          errorMessage.includes("exceeded your current quota") ||
          errorCode === "insufficient_quota") {
        userFriendlyMessage = "OpenAI API quota exceeded. Please check your OpenAI account billing and add credits to continue using AI features.";
        errorType = "quota_exceeded";
      } else if (errorMessage.includes("rate_limit_exceeded") || errorCode === "rate_limit_exceeded") {
        userFriendlyMessage = "Rate limit exceeded. Please wait a moment and try again.";
        errorType = "rate_limit";
      } else if (errorMessage.includes("invalid_api_key") || errorCode === "invalid_api_key") {
        userFriendlyMessage = "Invalid OpenAI API key. Please check your API key configuration in Supabase secrets.";
        errorType = "invalid_key";
      }
      
      return new Response(
        JSON.stringify({ 
          error: userFriendlyMessage,
          errorType: errorType,
          details: errorMessage,
          statusCode: statusCode
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: statusCode === 429 ? 429 : 500 }
      );
    }
    
    // Extract the response
    const translatedText = chatCompletion.choices[0]?.message?.content?.trim() || "Translation not available";
    console.log("Extracted translation:", translatedText.substring(0, 100) + "...");

    // Save translation to database
    try {
      const { error: insertError } = await supabaseClient
        .from('meeting_translations')
        .insert({
          meeting_id: meetingId,
          speaker: speaker,
          original_text: sourceText,
          translated_text: translatedText,
          source_language: sourceLanguage,
          target_language: targetLanguage,
          created_at: new Date().toISOString()
        });
      
      if (insertError) {
        console.error("Error saving translation to database:", insertError);
      } else {
        console.log("Translation saved to database");
      }
    } catch (dbError) {
      console.error("Database error:", dbError);
    }

    // Return the response
    return new Response(
      JSON.stringify({ 
        translatedText,
        sourceLanguage,
        targetLanguage,
        speaker
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error in AI translation function:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    const errorStack = error instanceof Error ? error.stack : "";
    
    return new Response(
      JSON.stringify({ 
        error: "An unexpected error occurred while processing your request",
        details: errorMessage,
        stack: errorStack
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" }, 
        status: 500 
      }
    );
  }
});