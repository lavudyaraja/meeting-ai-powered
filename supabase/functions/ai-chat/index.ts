// Import necessary modules for Supabase Edge Functions
// @ts-ignore - Deno imports are not recognized by Node.js TypeScript
import { serve } from "std/http/server.ts";
// @ts-ignore - Deno imports are not recognized by Node.js TypeScript
import OpenAI from "openai";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (_req) => {
  console.log("Function invoked with method:", _req.method);
  console.log("Function invoked with URL:", _req.url);
  
  if (_req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
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
    
    console.log("Function started, API key present:", !!OPENAI_API_KEY);

    // Check if the API key is available
    if (!OPENAI_API_KEY) {
      const errorMsg = "Missing OPENAI_API_KEY environment variable";
      console.error(errorMsg);
      return new Response(
        JSON.stringify({ 
          error: errorMsg,
          suggestion: "Please set the OPENAI_API_KEY as a Supabase secret using: npx supabase secrets set OPENAI_API_KEY=your_key_here"
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" }, 
          status: 500 
        }
      );
    }

    console.log("API key found, length:", OPENAI_API_KEY.length);

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
    
    const { messages } = requestData;
    
    // Validate messages
    if (!messages || !Array.isArray(messages)) {
      const errorMsg = "Messages are required and must be an array";
      console.error(errorMsg);
      return new Response(
        JSON.stringify({ error: errorMsg }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Create OpenAI client
    console.log("Creating OpenAI client...");
    // @ts-ignore - Deno runtime will handle this correctly
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });

    // Call OpenAI API
    console.log("Calling OpenAI API with messages:", JSON.stringify(messages, null, 2));
    
    let chatCompletion;
    try {
      // @ts-ignore - Deno runtime will handle this correctly
      chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
      });
      console.log("OpenAI API response received successfully");
    } catch (openaiError) {
      console.error("OpenAI API error:", openaiError);
      const errorMessage = openaiError instanceof Error ? openaiError.message : "Unknown OpenAI error";
      
      return new Response(
        JSON.stringify({ 
          error: `OpenAI API error: ${errorMessage}`,
          details: "Check your API key and OpenAI account status"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    // Extract the response
    const response = chatCompletion.choices[0]?.message?.content || "No response from AI";
    console.log("Extracted response:", response.substring(0, 100) + "...");

    // Return the response
    return new Response(
      JSON.stringify({ message: response }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error in AI chat function:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    const errorStack = error instanceof Error ? error.stack : "";
    
    // Check if this is an OpenAI API error
    let detailedError = errorMessage;
    let errorCode = "unknown_error";
    
    if (error instanceof Error && 'status' in error) {
      // @ts-ignore - accessing status property
      detailedError += ` (Status: ${error.status})`;
      // @ts-ignore - accessing status property
      errorCode = error.status;
    }
    
    // Handle specific OpenAI errors
    let userFriendlyMessage = "An error occurred while processing your request";
    
    if (errorMessage.includes("insufficient_quota")) {
      userFriendlyMessage = "OpenAI API quota exceeded. Please check your OpenAI plan and billing details.";
    } else if (errorMessage.includes("rate_limit_exceeded")) {
      userFriendlyMessage = "Rate limit exceeded. Please wait a moment and try again.";
    } else if (errorMessage.includes("invalid_api_key")) {
      userFriendlyMessage = "Invalid OpenAI API key. Please check your API key configuration.";
    }
    
    return new Response(
      JSON.stringify({ 
        error: userFriendlyMessage,
        details: detailedError,
        code: errorCode,
        stack: errorStack
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" }, 
        status: 500 
      }
    );
  }
});