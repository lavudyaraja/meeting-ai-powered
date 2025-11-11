# Advanced AI-Powered Meeting Features

This directory contains a comprehensive suite of AI-powered tools designed to enhance meeting productivity, analysis, and follow-up. All components are built with a consistent design language using shadcn/ui components and Tailwind CSS.

## Features Implemented

### 1. Speaker Diarization (`SpeakerDiarization.tsx`)
- Identifies and tracks who is speaking throughout the meeting
- Provides participation statistics and talk time analysis
- Visualizes speaker engagement with progress bars and sentiment indicators
- Includes detailed transcript segmentation

### 2. Sentiment Analysis (`SentimentAnalysis.tsx`)
- Real-time emotion detection for all participants
- Tracks sentiment trends throughout the meeting
- Provides individual participant sentiment profiles
- Offers insights into team dynamics and emotional climate

### 3. Topic Clustering (`TopicClustering.tsx`)
- Automatically identifies and groups discussion themes
- Creates visual topic maps showing conversation flow
- Highlights key discussion points and transitions
- Provides keyword extraction for each topic cluster

### 4. Smart Scheduling (`SmartScheduling.tsx`)
- AI-powered meeting time optimization
- Conflict detection and resolution suggestions
- Participant availability analysis
- Optimal meeting duration recommendations

### 5. Intelligent Recording (`IntelligentRecording.tsx`)
- Smart recording with automatic highlight detection
- Key moment bookmarking and annotation
- Multi-format export options
- Privacy-focused recording controls

### 6. Decision Matrix Analysis (`DecisionMatrixAnalysis.tsx`)
- Weighted criteria evaluation for complex decisions
- Team voting integration with consensus tracking
- Visual comparison of options
- AI-recommended optimal choices based on analysis

### 7. Action Items Tracker (`ActionItemsTracker.tsx`)
- Automated action item extraction from meeting discussions
- Assignee management with due dates and priorities
- Progress tracking and completion status
- Tag-based organization and filtering

### 8. Key Moments Detector (`KeyMomentsDetector.tsx`)
- Automatic identification of important meeting moments
- Classification of moments (decisions, questions, conflicts, etc.)
- Timeline visualization with confidence scoring
- Participant engagement analytics

## Integration Guide

All components follow a consistent API pattern:

```tsx
<FeatureComponent 
  meetingId="meeting-123"
  participants={participantArray}
  duration={meetingDurationInSeconds}
  className="optional-custom-classes"
/>
```

## Data Flow

1. **Real-time Analysis**: Components process live meeting data through AI services
2. **Storage**: Key insights are stored in the Supabase backend
3. **Visualization**: Data is presented through interactive UI components
4. **Actionable Insights**: Users can take actions directly from the interface

## Technology Stack

- **Frontend**: React with TypeScript
- **UI Components**: shadcn/ui with Tailwind CSS
- **State Management**: React hooks and context
- **AI Services**: Integration with OpenAI APIs through Supabase Edge Functions
- **Data Storage**: Supabase PostgreSQL database
- **Real-time**: Supabase real-time subscriptions

## Future Enhancements

- Integration with calendar systems for automated scheduling
- Advanced natural language processing for deeper insights
- Mobile-responsive designs for on-the-go access
- Customizable AI models for industry-specific analysis