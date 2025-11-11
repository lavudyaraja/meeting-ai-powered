# AI Summary Feature Deployment Guide

## Prerequisites

1. Supabase project with Edge Functions enabled
2. OpenAI API key
3. Supabase CLI installed (`npm install -g supabase`)

## Deployment Steps

### 1. Set Environment Variables

```bash
# Set your OpenAI API key
supabase secrets set OPENAI_API_KEY=your_openai_api_key_here

# Set Supabase credentials (usually already available)
supabase secrets set SUPABASE_URL=your_project_url
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 2. Deploy the Function

```bash
# Deploy the AI summary function
supabase functions deploy ai-summary

# Check deployment status
supabase functions status
```

### 3. Verify Deployment

```bash
# Test the function with a simple GET request
curl -X GET https://your-project-ref.supabase.co/functions/v1/ai-summary

# Expected response:
# {
#   "status": "ok",
#   "message": "AI Summary function is running",
#   "timestamp": "2023-xx-xxTxx:xx:xx.xxxZ"
# }
```

## Troubleshooting

### Common Issues

1. **"Unexpected end of JSON input" Error**
   - Cause: Function not deployed or returning non-JSON response
   - Solution: 
     - Verify function is deployed: `supabase functions status`
     - Check function logs: `supabase functions logs ai-summary`
     - Ensure environment variables are set

2. **"Missing OPENAI_API_KEY" Error**
   - Cause: OpenAI API key not set in Supabase secrets
   - Solution: Set the secret and redeploy
     ```bash
     supabase secrets set OPENAI_API_KEY=your_actual_key
     supabase functions deploy ai-summary
     ```

3. **"Failed to fetch meeting data" Error**
   - Cause: Database access issues or invalid meeting ID
   - Solution:
     - Verify database connection settings
     - Ensure meeting ID is valid
     - Check RLS policies on meetings table

### Testing the Function

Use the provided test script:

```bash
node test-ai-function.js
```

Or test manually with curl:

```bash
# Test with mock data
curl -X POST https://your-project-ref.supabase.co/functions/v1/ai-summary \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "meetingId": "test-meeting-id",
    "participants": [
      {"id": "user1", "name": "John Doe"},
      {"id": "user2", "name": "Jane Smith"}
    ]
  }'
```

## Function Development

### Local Development

1. Start Supabase local development server:
   ```bash
   supabase start
   ```

2. Serve functions locally:
   ```bash
   supabase functions serve
   ```

3. Test locally:
   ```bash
   curl -X POST http://localhost:54321/functions/v1/ai-summary \
     -H "Content-Type: application/json" \
     -d '{"meetingId": "test", "participants": [{"id": "1", "name": "Test User"}]}'
   ```

### Function Structure

```
supabase/functions/ai-summary/
├── index.ts          # Main function code
├── import_map.json   # Dependency imports
└── README.md         # Function documentation
```

### Logs and Monitoring

```bash
# View function logs
supabase functions logs ai-summary

# View recent logs
supabase functions logs ai-summary --since 1h

# Follow logs in real-time
supabase functions logs ai-summary --follow
```

## Required Database Tables

The function requires access to these tables:
- `meetings`: Meeting metadata
- `meeting_messages`: Chat transcript data
- `meeting_participants`: Participant information

Ensure these tables exist and have appropriate RLS policies.

## Security Considerations

1. API keys are stored securely in Supabase secrets
2. Function uses service role key for database access
3. CORS is configured to allow frontend requests
4. Input validation prevents injection attacks

## Performance Optimization

1. The function uses streaming responses where possible
2. Database queries are optimized with indexes
3. Caching can be implemented for frequently accessed summaries
4. Rate limiting is handled by Supabase and OpenAI

## Updating the Function

1. Make changes to `supabase/functions/ai-summary/index.ts`
2. Test locally
3. Deploy updates:
   ```bash
   supabase functions deploy ai-summary
   ```

## Rollback

If issues occur after deployment:
```bash
# View deployment history
supabase functions history ai-summary

# Rollback to previous version (if supported by your Supabase version)
```