# ShopifyGenie Accounting Suite - Complete Setup Script
# Run this script to set up and start the application

Write-Host "`n╔══════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   🧞 ShopifyGenie Accounting Suite - Setup     ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Step 1: Check if .env file exists
Write-Host "📋 Step 1: Checking environment configuration..." -ForegroundColor Yellow
if (!(Test-Path ".env")) {
    Write-Host "⚠️  .env file not found. Creating from template..." -ForegroundColor Yellow
    Copy-Item "env.example" ".env"
    Write-Host "✅ .env file created. Please configure it if needed.`n" -ForegroundColor Green
} else {
    Write-Host "✅ .env file exists`n" -ForegroundColor Green
}

# Step 2: Install dependencies
Write-Host "📦 Step 2: Installing dependencies..." -ForegroundColor Yellow
Write-Host "   This may take a few minutes...`n" -ForegroundColor Gray

try {
    npm install --silent
    Write-Host "✅ Dependencies installed`n" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    Write-Host "   Please run: npm install`n" -ForegroundColor Yellow
    exit 1
}

# Step 3: Setup database
Write-Host "🗄️  Step 3: Setting up database..." -ForegroundColor Yellow

Set-Location server

# Generate Prisma Client
Write-Host "   Generating Prisma Client..." -ForegroundColor Gray
try {
    npx prisma generate --silent
    Write-Host "   ✅ Prisma Client generated" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Failed to generate Prisma Client" -ForegroundColor Red
}

# Run migrations
Write-Host "   Running database migrations..." -ForegroundColor Gray
try {
    npx prisma migrate deploy --silent
    Write-Host "   ✅ Migrations applied" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  Migration warning (this is okay if first run)" -ForegroundColor Yellow
}

# Create default users
Write-Host "   Creating default users..." -ForegroundColor Gray
try {
    npx ts-node prisma/create-users.ts
    Write-Host "" # New line after user creation output
} catch {
    Write-Host "   ⚠️  Users may already exist`n" -ForegroundColor Yellow
}

Set-Location ..

Write-Host "✅ Database setup complete`n" -ForegroundColor Green

# Step 4: Display configuration
Write-Host "╔══════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║          ✅ SETUP COMPLETE!                     ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════╝`n" -ForegroundColor Green

Write-Host "🔐 LOGIN CREDENTIALS:" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Gray
Write-Host "👤 Admin Account (Super Admin):" -ForegroundColor Cyan
Write-Host "   Email:    admin@shopifygenie.com" -ForegroundColor White
Write-Host "   Password: admin123`n" -ForegroundColor White
Write-Host "👤 Accounting Account:" -ForegroundColor Cyan
Write-Host "   Email:    accounting@shopifygenie.com" -ForegroundColor White
Write-Host "   Password: accounting123`n" -ForegroundColor White
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Gray

Write-Host "🚀 STARTING APPLICATION..." -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Gray
Write-Host "Frontend will be available at: http://localhost:5173" -ForegroundColor Green
Write-Host "Backend will be available at:  http://localhost:3001`n" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Gray

Write-Host "Press Ctrl+C to stop the servers`n" -ForegroundColor Yellow

# Start the application
npm run dev

