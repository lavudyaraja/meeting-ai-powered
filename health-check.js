// Simple health check script to verify the AI summary function is working
// Run this after deploying the function to Supabase

async function healthCheck() {
  console.log('🔍 Starting AI Summary Function Health Check...\n');
  
  try {
    // 1. Check if the function endpoint exists
    console.log('1. Checking function endpoint...');
    const response = await fetch('http://localhost:54321/functions/v1/ai-summary', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 404) {
      console.log('❌ Function not found. Please deploy the ai-summary function.');
      console.log('   Run: supabase functions deploy ai-summary\n');
      return;
    }
    
    const data = await response.json();
    console.log('✅ Function endpoint is accessible');
    console.log(`   Status: ${data.status}`);
    console.log(`   Message: ${data.message}\n`);
    
    // 2. Test with mock data
    console.log('2. Testing with mock data...');
    const mockData = {
      meetingId: 'test-meeting-id',
      participants: [
        { id: 'user1', name: 'John Doe' },
        { id: 'user2', name: 'Jane Smith' }
      ]
    };
    
    const postResponse = await fetch('http://localhost:54321/functions/v1/ai-summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mockData)
    });
    
    console.log(`   POST Response Status: ${postResponse.status}`);
    
    if (postResponse.status === 200) {
      const result = await postResponse.json();
      console.log('✅ Function is working correctly');
      console.log('   Summary generated successfully\n');
      console.log('📋 Generated Summary Preview:');
      console.log(result.summary ? result.summary.substring(0, 200) + '...' : 'No summary generated');
    } else if (postResponse.status === 500) {
      const error = await postResponse.json();
      console.log('⚠️  Function returned an error:');
      console.log(`   ${error.error}\n`);
      
      if (error.error && error.error.includes('OPENAI_API_KEY')) {
        console.log('💡 Fix: Set your OpenAI API key in Supabase secrets');
        console.log('   Run: supabase secrets set OPENAI_API_KEY=your_key_here\n');
      }
    } else {
      const errorText = await postResponse.text();
      console.log('⚠️  Unexpected response:');
      console.log(`   ${errorText}\n`);
    }
    
  } catch (error) {
    console.log('❌ Health check failed:');
    console.log(`   ${error.message}\n`);
    
    if (error.message.includes('fetch')) {
      console.log('💡 Troubleshooting steps:');
      console.log('   1. Ensure Supabase local development is running');
      console.log('      Run: supabase start');
      console.log('   2. Ensure functions are being served');
      console.log('      Run: supabase functions serve\n');
    }
  }
  
  console.log('📋 For detailed deployment instructions, see DEPLOYMENT_GUIDE.md');
}

// Run the health check
healthCheck();