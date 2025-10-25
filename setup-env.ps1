# Setup Environment Variables Script
# ShopifyGenie Accounting Suite Pro

Write-Host "`n╔════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   ShopifyGenie Accounting Suite Pro - Environment Setup          ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

Write-Host "Creating .env file with default configuration...`n" -ForegroundColor Yellow

$envContent = @"
# ===== DATABASE =====
# SQLite for development (already configured in Prisma)
DATABASE_URL="file:./dev.db"

# ===== JWT AUTHENTICATION =====
JWT_SECRET="shopifygenie-pro-2024-super-secret-jwt-key-change-in-production-abc123xyz789"
JWT_EXPIRES_IN="7d"

# ===== SHOPIFY APP CONFIGURATION =====
# Get these from your Shopify Partner Dashboard: https://partners.shopify.com
# For development, you can leave these empty - the app will work without Shopify integration
SHOPIFY_API_KEY=""
SHOPIFY_API_SECRET=""
SHOPIFY_SCOPES="read_orders,read_products,read_customers,read_inventory,read_refunds,read_shopify_payments_payouts"
SHOPIFY_WEBHOOK_SECRET=""

# ===== APP CONFIGURATION =====
NODE_ENV="development"
PORT=3001
CLIENT_URL="http://localhost:5173"

# ===== ENCRYPTION =====
# 32-character key for encrypting sensitive data
ENCRYPTION_KEY="shopifygenie2024encryptionkey32"

# ===== EMAIL CONFIGURATION (Optional) =====
# For sending reports and notifications
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER=""
SMTP_PASS=""

# ===== FILE UPLOAD =====
MAX_FILE_SIZE="10485760"
UPLOAD_PATH="./uploads"

# ===== RATE LIMITING =====
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# ===== CORS =====
CORS_ORIGIN="http://localhost:5173"

# ===== LOGGING =====
LOG_LEVEL="info"
LOG_FILE="logs/app.log"

# ===== NOTES =====
# 1. This configuration is ready for immediate use
# 2. Shopify credentials are optional for development
# 3. Change JWT_SECRET and ENCRYPTION_KEY in production
# 4. Database is SQLite (dev.db) - no PostgreSQL needed for development
"@

# Write .env file
$envContent | Out-File -FilePath ".env" -Encoding UTF8 -NoNewline

Write-Host "✅ .env file created successfully!`n" -ForegroundColor Green

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "`n📋 CONFIGURATION SUMMARY:`n" -ForegroundColor Yellow

Write-Host "Database:      " -ForegroundColor Cyan -NoNewline
Write-Host "SQLite (dev.db) - No setup needed ✅" -ForegroundColor White

Write-Host "JWT Secret:    " -ForegroundColor Cyan -NoNewline
Write-Host "Configured ✅" -ForegroundColor White

Write-Host "Shopify API:   " -ForegroundColor Cyan -NoNewline
Write-Host "Optional (app works without it) ⚠️" -ForegroundColor Yellow

Write-Host "Port:          " -ForegroundColor Cyan -NoNewline
Write-Host "3001 (Backend) & 5173 (Frontend) ✅" -ForegroundColor White

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

Write-Host "`n🔐 OPTIONAL: Add Shopify Credentials`n" -ForegroundColor Yellow

Write-Host "If you want to connect to Shopify, follow these steps:" -ForegroundColor White
Write-Host "1. Go to: https://partners.shopify.com" -ForegroundColor Cyan
Write-Host "2. Create a new app or use existing one" -ForegroundColor Cyan
Write-Host "3. Copy your API Key and API Secret" -ForegroundColor Cyan
Write-Host "4. Edit .env file and add your credentials`n" -ForegroundColor Cyan

Write-Host "For now, the app will run perfectly without Shopify credentials!`n" -ForegroundColor Green

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

Write-Host "`n✨ Next Steps:`n" -ForegroundColor Yellow

Write-Host "1. Run: " -ForegroundColor White -NoNewline
Write-Host ".\start.ps1" -ForegroundColor Cyan -NoNewline
Write-Host " (to start the application)" -ForegroundColor White

Write-Host "2. Open: " -ForegroundColor White -NoNewline
Write-Host "http://localhost:5173" -ForegroundColor Cyan

Write-Host "3. Login: " -ForegroundColor White -NoNewline
Write-Host "admin@shopifygenie.com / admin123`n" -ForegroundColor Green

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Gray

Write-Host "🎉 Environment setup complete! Ready to run the application!`n" -ForegroundColor Green

