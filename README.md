# Optima Assist - AI Meeting Management Platform

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/react-18-blue.svg)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/supabase-backend-green.svg)](https://supabase.io/)
[![OpenAI](https://img.shields.io/badge/openai-ai-orange.svg)](https://openai.com/)

Optima Assist is an AI-powered meeting management platform designed to enhance productivity through intelligent automation in meetings, task tracking, and team collaboration. Built with modern web technologies, it offers a comprehensive solution for teams seeking to streamline their meeting workflows with the power of artificial intelligence.

## 🌟 Key Features

### AI-Powered Capabilities
- **AI Assistant**: Natural language interface for automating tasks and retrieving information
- **Smart Meeting Summaries**: AI-generated executive summaries with key points and action items
- **Real-time Translation**: Instant translation during meetings for global teams
- **Automated Note-taking**: AI-powered transcription and note creation
- **QA Suggestions**: Intelligent question generation based on meeting content
- **Action Item Extraction**: Automatic identification and assignment of tasks

### Meeting Management
- **Full Lifecycle Support**: Schedule, conduct, and review meetings from one platform
- **Video Conferencing**: Integrated real-time WebRTC-based video calls with screen sharing
- **Meeting Analytics**: Visualize productivity metrics and engagement trends
- **Recordings Library**: Store and organize meeting recordings with searchable transcripts

### Task & Project Management
- **AI-Suggested Tasks**: Intelligent task creation based on meeting discussions
- **Assignment & Tracking**: Assign tasks to team members with due dates and progress tracking
- **Integration**: Seamless task management within the meeting workflow

### User Experience
- **Modern Dashboard**: Beautiful, responsive interface with real-time insights
- **Customizable Settings**: Personalize your experience with flexible configuration options
- **Cross-Platform**: Works on desktop and mobile devices

## 🛠 Technology Stack

### Frontend
- **Framework**: [React 18](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 5.4.19](https://vitejs.dev/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) with [Radix UI](https://www.radix-ui.com/) primitives
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [tailwindcss-animate](https://github.com/jamiebuilds/tailwindcss-animate)
- **State Management**: [@tanstack/react-query](https://tanstack.com/query/latest) for server state
- **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- **Routing**: [react-router-dom v6.30.1](https://reactrouter.com/)

### Backend & Services
- **Database & Authentication**: [Supabase](https://supabase.io/) (PostgreSQL with Supabase Auth)
- **Serverless Functions**: Supabase Edge Functions (Deno runtime)
- **AI Integration**: [OpenAI API](https://openai.com/) (GPT models)
- **Real-time Communication**: WebRTC for video conferencing
- **Deployment**: Static hosting compatible (Vercel, Netlify) with Supabase backend

### Development Tools
- **Language**: TypeScript 5.8.3
- **Linting**: ESLint with TypeScript parser
- **Package Management**: npm
- **CLI Tools**: Supabase CLI for function deployment and management

## 📁 Project Structure

```
src/
├── components/                 # Reusable UI components
│   ├── auth/                   # Authentication components (login, register, etc.)
│   ├── dashboard/              # Dashboard components
│   │   ├── overview/           # Dashboard overview page
│   │   ├── recordings/         # Meeting recordings library
│   │   ├── taskmode/           # Task management components
│   │   ├── video-conference/   # Video conferencing components
│   │   │   ├── ai-features/    # AI features for video conferences
│   │   │   ├── controls/       # Video conference controls
│   │   │   └── ...             # Other video conference components
│   │   └── ...                 # Other dashboard components
│   ├── landingPage/            # Landing page components
│   ├── meetings/               # Meeting-specific components
│   ├── settings/               # Settings panel components
│   ├── ui/                     # Reusable UI components (shadcn-ui)
│   └── ...                     # Other shared components
├── hooks/                      # Custom React hooks
├── integrations/               # Third-party service integrations
│   └── supabase/               # Supabase client and type definitions
├── lib/                        # Utility functions and libraries
├── nlp/                        # Natural language processing services
├── pages/                      # Top-level route components
├── types/                      # TypeScript type definitions
├── utils/                      # Utility functions
supabase/
├── functions/                  # Serverless Edge Functions
│   ├── ai-chat/                # AI chat function
│   ├── ai-summary/             # AI meeting summary function
│   ├── ai-translation/         # AI translation function
│   ├── ai-notes/               # AI notes function
│   ├── ai-qa-suggestions/      # AI QA suggestions function
│   └── _shared/                # Shared utilities for functions
├── migrations/                 # Database schema migrations
└── config.toml                 # Supabase configuration
```

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)
- [Supabase](https://supabase.io/) account
- [OpenAI](https://openai.com/) API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/lavudyaraja/meetings-ai-application.git
   cd meetings-ai-application
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

### AI Integration Setup

1. Install the Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Log in to your Supabase account:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref YOUR_PROJECT_ID
   ```

4. Set your OpenAI API key as a Supabase secret:
   ```bash
   supabase secrets set OPENAI_API_KEY=your_actual_openai_api_key_here
   ```

5. Deploy all AI functions:
   ```bash
   supabase functions deploy ai-chat ai-summary ai-translation ai-notes ai-qa-suggestions
   ```

### Database Setup

Run database migrations:
```bash
supabase migration up
```

## ▶️ Development

Start the development server:
```bash
npm run dev
```
The app will be available at http://localhost:8080

## 🏗 Build for Production

```bash
npm run build
```
Outputs static files in `/dist`

## 🔍 Linting

```bash
npm run lint
```

## 🧪 Testing

(Add testing instructions when available)

## ☁️ Deployment

### Frontend Deployment
The application can be deployed to any static hosting service:
- [Vercel](https://vercel.com/)
- [Netlify](https://netlify.com/)
- [GitHub Pages](https://pages.github.com/)

### Backend Deployment
1. Ensure your Supabase project is set up with all required tables
2. Deploy Edge Functions as described in the AI Integration Setup
3. Configure environment variables in your hosting platform

### CI/CD (Example with GitHub Actions)
(Add CI/CD configuration examples)

## 🔐 Security

- API keys are stored securely in Supabase secrets, never exposed to client-side code
- Row Level Security (RLS) policies ensure users only access their own data
- Authentication handled by Supabase with OAuth providers (Google, Microsoft)
- Environment variables must not be committed to version control

## 📊 Monitoring & Analytics

(Add monitoring and analytics setup instructions)

## 🤝 Contributing

We welcome contributions to Optima Assist! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

Please ensure your code follows our coding standards and includes appropriate tests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, please open an issue on the GitHub repository or contact the maintainers.

## 🙏 Acknowledgments

- [Supabase](https://supabase.io/) for the amazing backend-as-a-service platform
- [OpenAI](https://openai.com/) for the powerful AI models
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- All the open-source projects that made this possible

## 📞 Contact

For questions or feedback, please reach out to the project maintainers or open an issue on GitHub.