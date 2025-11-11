# Deploy Supabase Edge Functions (PowerShell)
# Make sure you have Supabase CLI installed and are logged in

Write-Host "🚀 Deploying Supabase Edge Functions..." -ForegroundColor Cyan

# Check if Supabase CLI is available via npx
try {
    $null = npx supabase --version
} catch {
    Write-Host "❌ Supabase CLI is not available. Please install it first:" -ForegroundColor Red
    Write-Host "   npm install -g supabase" -ForegroundColor Yellow
    exit 1
}

# Deploy each function
Write-Host ""
Write-Host "📦 Deploying ai-chat..." -ForegroundColor Green
npx supabase functions deploy ai-chat

Write-Host ""
Write-Host "📦 Deploying ai-qa-suggestions..." -ForegroundColor Green
npx supabase functions deploy ai-qa-suggestions

Write-Host ""
Write-Host "📦 Deploying ai-notes..." -ForegroundColor Green
npx supabase functions deploy ai-notes

Write-Host ""
Write-Host "📦 Deploying ai-translation..." -ForegroundColor Green
npx supabase functions deploy ai-translation

Write-Host ""
Write-Host "📦 Deploying ai-summary..." -ForegroundColor Green
npx supabase functions deploy ai-summary

Write-Host ""
Write-Host "📦 Deploying send-email..." -ForegroundColor Green
npx supabase functions deploy send-email

Write-Host ""
Write-Host "✅ All functions deployed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  Don't forget to set the OPENAI_API_KEY secret:" -ForegroundColor Yellow
Write-Host "   npx supabase secrets set OPENAI_API_KEY=your_key_here" -ForegroundColor White
Write-Host ""
Write-Host "   And for send-email function, set RESEND_API_KEY:" -ForegroundColor Yellow
Write-Host "   npx supabase secrets set RESEND_API_KEY=your_key_here" -ForegroundColor White