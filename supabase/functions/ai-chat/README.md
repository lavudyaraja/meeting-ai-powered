# AI Chat Function

This Supabase Edge Function provides AI chat capabilities for the Optima Assist application using OpenAI.

## Setup

1. Ensure you have the Supabase CLI installed
2. Set your OpenAI API key as a Supabase secret:
   ```bash
   supabase secrets set OPENAI_API_KEY=sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

## Deployment

To deploy this function to Supabase:

```bash
supabase functions deploy ai-chat
```

## Local Development

To test locally:

```bash
supabase functions serve --env-file .env
```

Make sure your `.env` file contains your OpenAI API key:

```
OPENAI_API_KEY=sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

## Function Details

- Uses OpenAI's GPT-3.5-turbo model
- Accepts messages in the standard OpenAI format
- Returns responses in a format compatible with the frontend