# Quick Start Script - ShopifyGenie Accounting Suite
# Simply starts the application (run setup.ps1 first if this is your first time)

Write-Host "`n🚀 Starting ShopifyGenie Accounting Suite...`n" -ForegroundColor Cyan

# Stop any existing Node processes
Write-Host "🛑 Stopping existing processes..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

Write-Host "✅ Ready to start`n" -ForegroundColor Green

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "🌐 APPLICATION URLs:" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Gray
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host "Backend:  http://localhost:3001`n" -ForegroundColor Green

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "🔐 LOGIN CREDENTIALS:" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Gray
Write-Host "Email:    admin@shopifygenie.com" -ForegroundColor White
Write-Host "Password: admin123`n" -ForegroundColor White

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "Press Ctrl+C to stop the servers" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Gray

# Start the application
npm run dev

