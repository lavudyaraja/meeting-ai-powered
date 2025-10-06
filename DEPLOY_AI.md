# Deploying AI Integration

This document explains how to deploy and test the AI integration in your Optima Assist project.

## Prerequisites

1. Supabase CLI installed (`npx supabase --version`)
2. Logged into your Supabase account (`npx supabase login`)
3. OpenAI API key (already in your `.env` file)

## Deployment Steps

### 1. Set the OpenAI API Key as a Supabase Secret

```bash
npx supabase secrets set OPENAI_API_KEY=sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### 2. Deploy the AI Chat Function

```bash
npx supabase functions deploy ai-chat
```

### 3. Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the dashboard and open the AI Assistant

3. Try sending a message like "Hello, how can you help me?"

## Troubleshooting

### If you get authentication errors:

1. Make sure you're logged into Supabase:
   ```bash
   npx supabase login
   ```

2. Verify your project is linked:
   ```bash
   npx supabase link --project-ref YOUR_PROJECT_ID
   ```

### If you get "OpenAI API key is not configured" errors:

1. Verify the secret is set:
   ```bash
   npx supabase secrets list
   ```

2. If not listed, re-run the secrets set command

### If you get function invocation errors:

1. Check the function logs:
   ```bash
   npx supabase functions logs ai-chat
   ```

2. Redeploy the function:
   ```bash
   npx supabase functions deploy ai-chat
   ```

## Local Testing

To test locally without deploying:

1. Start the local Supabase functions server:
   ```bash
   npx supabase functions serve
   ```

2. This will run your functions locally for testing

## Security Notes

- The API key in `.env` is for local development only
- Production API keys should only be stored as Supabase secrets
- Never commit actual API keys to version control
- Always use placeholders like `sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` in documentation