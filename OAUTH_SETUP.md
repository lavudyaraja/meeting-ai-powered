# OAuth Setup Guide

This guide explains how to set up Google and Microsoft OAuth for the Meetings AI application.

## Prerequisites

1. Supabase project with Auth enabled
2. Google Cloud Platform account (for Google OAuth)
3. Microsoft Azure account (for Microsoft OAuth)

## Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Select "Web application" as the application type
6. Add the following to "Authorized redirect URIs":
   ```
   https://your-domain.com/auth/callback
   http://localhost:5173/auth/callback (for development)
   ```
7. Save and note the Client ID and Client Secret

## Microsoft OAuth Setup

1. Go to the [Microsoft Azure Portal](https://portal.azure.com/)
2. Navigate to "Azure Active Directory" > "App registrations"
3. Click "New registration"
4. Enter a name for your application
5. Set the redirect URI to:
   ```
   https://your-domain.com/auth/callback
   http://localhost:5173/auth/callback (for development)
   ```
6. Register the application
7. Note the Application (client) ID and Directory (tenant) ID
8. Go to "Certificates & secrets" and create a new client secret

## Supabase Configuration

1. In your Supabase dashboard, go to "Authentication" > "Providers"
2. Enable Google and Azure Active Directory providers
3. For Google:
   - Set Client ID and Secret from Google Cloud Console
   - Set redirect URLs to include your domain and localhost
4. For Azure:
   - Set Client ID from Azure Portal
   - Set Secret from Azure Portal
   - Set Tenant ID from Azure Portal

## Environment Variables

Add the following to your `.env` file:

```env
# Google OAuth (optional, if using custom implementation)
VITE_GOOGLE_CLIENT_ID=your-google-client-id

# Microsoft OAuth (optional, if using custom implementation)
VITE_MICROSOFT_CLIENT_ID=your-microsoft-client-id
```

Note: When using Supabase's built-in OAuth, you don't need these environment variables as the configuration is handled in the Supabase dashboard.

## Testing OAuth

1. Start your development server: `npm run dev`
2. Navigate to the login or registration page
3. Click on "Continue with Google" or "Sign up with Microsoft"
4. You should be redirected to the provider's authentication page
5. After successful authentication, you'll be redirected back to your app