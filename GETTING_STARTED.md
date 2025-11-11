# Getting Started with Supabase AI Summary Function

## Prerequisites

1. Ensure you have the Supabase CLI installed:
   ```bash
   npm install -g supabase
   ```

2. Make sure you have Docker Desktop installed and running (for local development)

## Getting Your Supabase Credentials

### 1. Find Your Project URL and Anon Key

1. Go to the [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. In the left sidebar, click on "Project Settings"
4. Click on "API"
5. Copy the following values:
   - **Project URL**: This is your Supabase project URL
   - **anon key**: This is your public API key (safe to use in frontend)

### 2. Set Your OpenAI API Key

In your Supabase project dashboard:

1. Go to "Settings" → "API"
2. Scroll down to "Vault" section
3. Click "Add new secret"
4. Add your OpenAI API key with the name `OPENAI_API_KEY`

Alternatively, you can set it via CLI:
```bash
npx supabase secrets set OPENAI_API_KEY=your_openai_api_key_here
```

Then redeploy the function:
```bash
npx supabase functions deploy ai-summary
```

## Testing the Function

### Method 1: Using cURL

Replace `YOUR_ANON_KEY` with your actual anon key:

```bash
curl -X POST 'https://ewsiwbxjjhjqhbgemkxo.supabase.co/functions/v1/ai-summary' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "meetingId": "test-meeting-id",
    "participants": [
      {"id": "user1", "name": "John Doe"},
      {"id": "user2", "name": "Jane Smith"}
    ]
  }'
```

### Method 2: Using the HTML Test File

1. Open `test-function-browser.html` in your browser
2. Replace `YOUR_ACTUAL_ANON_KEY_HERE` with your actual anon key
3. Open the file and click the "Test AI Summary Function" button

### Method 3: Using Node.js

Run the test script:
```bash
node test-deployed-function.js
```

## Troubleshooting

### Common Issues

1. **"Missing authorization header"**
   - Make sure you're including the Authorization header with your anon key

2. **"Invalid API key"**
   - Verify your OpenAI API key is correctly set in Supabase secrets

3. **"Function not found"**
   - Make sure the function is deployed:
     ```bash
     npx supabase functions deploy ai-summary
     ```

4. **Docker not running**
   - Start Docker Desktop if you want to test locally

### Checking Function Logs

To view logs for your function:
```bash
npx supabase functions logs ai-summary
```

## Using the Feature in Your Application

The AI Summary feature is now ready to use in your video conference application. When users click on "Meeting Summary" in the AI features menu, the AutoSummary panel will open and allow them to generate AI-powered meeting summaries.

The feature works by:
1. Collecting meeting data (ID and participants)
2. Sending this data to the deployed Supabase function
3. The function analyzes chat transcripts and generates a summary using OpenAI
4. The summary is returned to the frontend for display

Users can then:
- Copy the summary to clipboard
- Download the summary as a Markdown file