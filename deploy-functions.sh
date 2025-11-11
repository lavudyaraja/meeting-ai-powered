#!/bin/bash

# Deploy Supabase Edge Functions
# Make sure you have Supabase CLI installed and are logged in

echo "🚀 Deploying Supabase Edge Functions..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

# Check if logged in
if ! supabase projects list &> /dev/null; then
    echo "❌ Not logged in to Supabase. Please run:"
    echo "   supabase login"
    exit 1
fi

# Deploy each function
echo ""
echo "📦 Deploying ai-qa-suggestions..."
supabase functions deploy ai-qa-suggestions

echo ""
echo "📦 Deploying ai-notes..."
supabase functions deploy ai-notes

echo ""
echo "📦 Deploying ai-translation..."
supabase functions deploy ai-translation

echo ""
echo "📦 Deploying ai-summary..."
supabase functions deploy ai-summary

echo ""
echo "📦 Deploying send-email..."
supabase functions deploy send-email

echo ""
echo "✅ All functions deployed successfully!"
echo ""
echo "⚠️  Don't forget to set the OPENAI_API_KEY secret:"
echo "   supabase secrets set OPENAI_API_KEY=your_key_here"
echo ""
echo "   And for send-email function, set RESEND_API_KEY:"
echo "   supabase secrets set RESEND_API_KEY=your_key_here"

