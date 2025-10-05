// Simple test script to verify AI integration
// This script tests the Supabase AI function locally

async function testAI() {
  try {
    console.log('Testing AI integration...');
    
    // Test data
    const testData = {
      messages: [
        { role: "user", content: "Hello, can you help me schedule a meeting?" }
      ]
    };
    
    console.log('Test data:', JSON.stringify(testData, null, 2));
    
    // Note: To actually test the Supabase function, you would need to:
    // 1. Deploy the function to Supabase
    // 2. Set the OPENAI_API_KEY secret in Supabase
    // 3. Call the function via the Supabase client
    
    console.log('To test the AI function:');
    console.log('1. Deploy the function: npx supabase functions deploy ai-chat');
    console.log('2. Set the API key: npx supabase secrets set OPENAI_API_KEY=your_openai_api_key');
    console.log('3. Test the function through the dashboard');
    
  } catch (error) {
    console.error('Error testing AI:', error);
  }
}

testAI();