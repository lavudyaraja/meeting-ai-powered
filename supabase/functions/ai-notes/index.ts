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
        message: "AI Notes function is running",
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

    // Create Supabase client
    console.log("Creating Supabase client...");
    // @ts-ignore - Deno runtime will handle this correctly
    const supabaseClient = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY || ''
    );

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
    
    const { meetingId, participants } = requestData;
    
    // Validate required fields
    if (!meetingId) {
      const errorMsg = "Meeting ID is required";
      console.error(errorMsg);
      return new Response(
        JSON.stringify({ error: errorMsg }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Fetch meeting data from the database
    console.log("Fetching meeting data...");
    const { data: meetingData, error: meetingError } = await supabaseClient
      .from('meetings')
      .select('*')
      .eq('id', meetingId)
      .single();
      
    if (meetingError) {
      console.error("Error fetching meeting data:", meetingError);
      return new Response(
        JSON.stringify({ 
          error: "Failed to fetch meeting data",
          details: meetingError.message
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }
    
    if (!meetingData) {
      return new Response(
        JSON.stringify({ 
          error: "Meeting not found",
          details: `No meeting found with ID: ${meetingId}`
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }
    
    // Fetch meeting messages (chat transcript)
    console.log("Fetching meeting messages...");
    const { data: messages, error: messagesError } = await supabaseClient
      .from('meeting_messages')
      .select('*')
      .eq('meeting_id', meetingId)
      .order('timestamp', { ascending: true });
      
    if (messagesError) {
      console.error("Error fetching messages:", messagesError);
      return new Response(
        JSON.stringify({ 
          error: "Failed to fetch meeting messages",
          details: messagesError.message
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    // Check if we have messages to analyze
    if (!messages || messages.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: "No meeting messages found",
          suggestion: "Please ensure there are chat messages in the meeting before generating notes"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // Prepare the prompt for OpenAI
    const prompt = `
      Generate detailed meeting notes based on the following information:
      
      Meeting Title: ${meetingData?.title || 'Untitled Meeting'}
      Meeting Date: ${meetingData?.created_at || new Date().toISOString()}
      Participants: ${participants && participants.length > 0 ? participants.map((p: { name: string }) => p.name).join(', ') : 'No participants specified'}
      
      Chat Transcript:
      ${messages && messages.length > 0 
        ? messages.map((m: { user_name: string; message: string }) => `${m.user_name}: ${m.message}`).join('\n')
        : 'No chat messages available'}
      
      Please provide structured meeting notes that include:
      1. Meeting overview with title and date
      2. List of participants
      3. Detailed discussion points organized by topic
      4. Action items with assigned owners and deadlines (if mentioned)
      5. Decisions made during the meeting
      6. Questions raised and their resolutions
      7. Next steps and follow-up actions
    `;
    
    console.log("Prepared prompt for OpenAI:", prompt.substring(0, 100) + "...");
    
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
            content: 'You are an AI assistant that specializes in creating detailed and organized meeting notes.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
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
    const notes = chatCompletion.choices[0]?.message?.content || "No notes generated";
    console.log("Extracted notes:", notes.substring(0, 100) + "...");

    // Save notes to database
    try {
      const { error: insertError } = await supabaseClient
        .from('meeting_notes')
        .insert({
          meeting_id: meetingId,
          content: notes,
          created_at: new Date().toISOString()
        });
      
      if (insertError) {
        console.error("Error saving notes to database:", insertError);
      } else {
        console.log("Notes saved to database");
      }
    } catch (dbError) {
      console.error("Database error:", dbError);
    }

    // Return the response
    return new Response(
      JSON.stringify({ notes: notes }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error in AI notes function:", error);
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