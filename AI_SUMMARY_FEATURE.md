# AI Meeting Summary Feature

## Overview

The AI Meeting Summary feature automatically generates concise, structured summaries of meetings using OpenAI's GPT models. This feature analyzes meeting chat transcripts and other metadata to create actionable summaries that highlight key discussion points, decisions, and next steps.

## How It Works

1. **Data Collection**: The feature gathers meeting data including:
   - Meeting title and date
   - Participant list
   - Chat transcript from the meeting_messages table

2. **AI Processing**: The collected data is sent to an OpenAI GPT model via a Supabase Edge Function that:
   - Formats the data into a structured prompt
   - Sends the prompt to OpenAI's API
   - Processes the AI-generated response

3. **Summary Generation**: The AI generates a structured summary that includes:
   - Meeting title and date
   - List of participants
   - Key discussion points
   - Action items with owners
   - Decisions made
   - Next steps

## Technical Implementation

### Frontend Components

- **AutoSummary.tsx**: React component that provides the UI for generating and displaying meeting summaries
- **VideoConferenceControls.tsx**: Integration point where users can access the summary feature

### Backend (Supabase Edge Function)

- **Location**: `supabase/functions/ai-summary/`
- **Entry Point**: `index.ts`
- **Dependencies**: OpenAI SDK, Supabase JS client
- **Environment Variables**:
  - `OPENAI_API_KEY`: OpenAI API key for accessing GPT models
  - `SUPABASE_URL`: Supabase project URL
  - `SUPABASE_SERVICE_ROLE_KEY`: Service role key for database access

### Database Schema

The feature uses existing tables:
- `meetings`: Meeting metadata
- `meeting_messages`: Chat transcript data
- `meeting_participants`: Participant information

## Deployment

To deploy the AI Summary feature:

1. **Set Environment Variables**:
   ```bash
   supabase secrets set OPENAI_API_KEY=your_openai_api_key
   supabase secrets set SUPABASE_URL=your_supabase_url
   supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. **Deploy the Function**:
   ```bash
   supabase functions deploy ai-summary
   ```

3. **Configure CORS** (if needed):
   Update the `corsHeaders` in the function if your frontend is hosted on a different domain.

## Usage

1. During or after a meeting, open the AI features menu in the video conference controls
2. Click on "Meeting Summary" to open the summary panel
3. Click "Generate Summary" to create an AI-powered summary of the meeting
4. Once generated, you can:
   - Copy the summary to clipboard
   - Download the summary as a Markdown file

## Error Handling

The feature includes comprehensive error handling for:
- Network issues
- OpenAI API errors (rate limits, invalid keys, etc.)
- Database access errors
- Invalid request data

Users will see descriptive error messages when issues occur.

## Future Enhancements

Planned improvements:
- Integration with actual meeting transcripts (when available)
- Support for multiple summary formats
- Customizable summary templates
- Integration with task management features
- Multi-language support