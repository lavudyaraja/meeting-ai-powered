# AI Integration Setup Guide

This document explains how to properly set up and use the AI integration in the Optima Assist project.

## Prerequisites

1. OpenAI API key (provided: `sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`)
2. Supabase project with Edge Functions enabled

## Setup Instructions

### 1. Set up Supabase Edge Functions

1. Install the Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Log in to your Supabase account:
   ```bash
   npx supabase login
   ```

3. Link your project:
   ```bash
   npx supabase link --project-ref YOUR_PROJECT_ID
   ```

### 2. Set the OpenAI API Key as a Supabase Secret

```bash
npx supabase secrets set OPENAI_API_KEY=sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### 3. Deploy the AI Chat Function

```bash
npx supabase functions deploy ai-chat
```

## Testing the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the dashboard and open the AI Assistant

3. Try sending a message like "Hello, how can you help me?"

## Security Notes

- Never commit actual API keys to version control
- Always use placeholders like `sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` in documentation
- Production API keys should only be stored as Supabase secrets
- Local development API keys should be in `.env.local` which is gitignored