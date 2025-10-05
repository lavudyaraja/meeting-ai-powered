# Optima Assist - AI-Powered Meeting Management Platform

Optima Assist is an intelligent productivity assistant platform designed to streamline meeting management, task tracking, and team collaboration through AI-powered automation.

## Project Overview

This application provides users with a comprehensive dashboard for managing meetings, tasks, and system settings, integrated with AI capabilities for automation and decision support.

### Key Features

- **AI Assistant**: Integrated chat engine for intelligent task automation
- **Meeting Management**: Schedule, view, and manage meetings with intuitive UI
- **Task Manager**: Create, edit, and track tasks within the dashboard
- **Analytics Dashboard**: Real-time insights into meeting patterns and productivity
- **Video Conferencing**: Integrated video call functionality
- **Settings Panel**: Comprehensive configuration options

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: shadcn-ui, Tailwind CSS
- **State Management**: React Query, React Hook Form
- **Authentication**: Supabase Auth
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **AI Integration**: OpenAI API via Supabase Edge Functions

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd optima-assist-main
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit the `.env` file with your actual credentials.

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

### Building for Production

```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_PROJECT_ID=your_supabase_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_OPENAI_API_KEY=your_openai_api_key

# OAuth Providers (optional)
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_MICROSOFT_CLIENT_ID=your_microsoft_client_id
```

## Authentication

The platform supports multiple authentication methods:

1. Email/Password authentication
2. Google OAuth
3. Microsoft OAuth (Azure AD)

For detailed OAuth setup instructions, see [OAUTH_SETUP.md](OAUTH_SETUP.md).

## AI Integration

This project includes AI-powered features:

1. **AI Assistant** - General purpose chat assistant
2. **Auto-Calendar Optimization** - Intelligent focus time blocking
3. **Post-Meeting Task Automation** - Creates tasks from action items
4. **Smart Document Generation** - Generates documents from discussions

For AI setup instructions, see:
- [AI_INTEGRATION.md](AI_INTEGRATION.md) - How to set up AI features
- [DEPLOY_AI.md](DEPLOY_AI.md) - How to deploy AI features

## Project Structure

```
src/
├── components/        # React components
├── hooks/             # Custom React hooks
├── integrations/      # Third-party service integrations
├── lib/               # Utility functions and libraries
├── pages/             # Page components
├── routes/            # Routing configuration
└── types/             # TypeScript types
```

## Deployment

This project is designed to be deployed via Lovable.dev:


## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## Security

- Never commit actual API keys or secrets to version control
- Use environment variables for sensitive data
- Review the [security guidelines](SECURITY.md) for more information

## Support

For support, please contact the project maintainers or open an issue in the repository.