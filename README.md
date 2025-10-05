# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/9c905e43-d3da-449c-9e27-318680beaebc

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/9c905e43-d3da-449c-9e27-318680beaebc) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Environment Variables

Before running the project, you need to set up your environment variables. Copy the [.env.example](.env.example) file to [.env](.env) and fill in your values:

```bash
cp .env.example .env
```

Then update the .env file with your actual credentials.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Authentication

This project supports multiple authentication methods:

1. Email/Password authentication
2. Google OAuth
3. Microsoft OAuth (Azure AD)

For OAuth setup instructions, see [OAUTH_SETUP.md](OAUTH_SETUP.md).

## AI Integration

This project includes AI capabilities powered by OpenAI. For setup instructions, see:

1. [AI_INTEGRATION.md](AI_INTEGRATION.md) - How to set up AI features
2. [DEPLOY_AI.md](DEPLOY_AI.md) - How to deploy AI features

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/9c905e43-d3da-449c-9e27-318680beaebc) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)