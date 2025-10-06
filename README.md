# Optima Assist - AI Meeting Management Platform

Optima Assist is an AI-powered meeting management platform designed to enhance productivity through intelligent automation in meetings, task tracking, and team collaboration.

## Features

- **AI Assistant**: Chat-based interface for automating tasks and retrieving information
- **Meeting Management**: Full lifecycle support for scheduling, conducting, and reviewing meetings
- **Task Manager**: Create, assign, and track tasks with AI-generated suggestions
- **Analytics Dashboard**: Visualize productivity metrics and meeting trends
- **Video Conferencing**: Integrated real-time video calls within the app
- **Settings Panel**: Configure user preferences, integrations, notifications, and security settings

## Prerequisites

- Node.js (v16 or higher, recommended v18+)
- npm or yarn
- Git
- Supabase account
- OpenAI API key

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd optima-assist-main
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your actual credentials:
   - Supabase project credentials
   - OpenAI API key (for AI features)
   - OAuth provider credentials (Google, Microsoft)

4. Set up Supabase Edge Functions:
   If you want to use Supabase Edge Functions for AI integration:
   ```bash
   # Install Supabase CLI if you haven't already
   npm install -g supabase
   
   # Set your OpenAI API key as a Supabase secret
   supabase secrets set OPENAI_API_KEY=your_openai_api_key_here
   
   # Deploy the AI chat function
   supabase functions deploy ai-chat
   ```

## Development

Start the development server:
```bash
npm run dev
```
The app will be available at http://localhost:8080

## Build for Production

```bash
npm run build
```
Outputs static files in `/dist`

## Preview Production Build

```bash
npm run preview
```

## Linting

```bash
npm run lint
```

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite 5.4.19, shadcn-ui, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Supabase Auth, Edge Functions)
- **AI Integration**: OpenAI API
- **State Management**: React Query, React Hook Form + Zod
- **Routing**: react-router-dom v6.30.1

## Project Structure

```
src/
├── components/          # Reusable UI components
├── hooks/               # Custom React hooks
├── integrations/        # Supabase client and type definitions
├── lib/                 # Utility functions
├── pages/               # Top-level route components
supabase/
├── functions/           # Serverless Edge Functions
├── migrations/          # Database schema migrations
```

## Deployment

The application can be deployed to any static hosting service (e.g., Vercel, Netlify) with Supabase backend integration. Edge Functions must be deployed to Supabase for AI features.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue on the GitHub repository.