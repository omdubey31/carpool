# Car Pooling Website Startup Script
Write-Host "Starting Car Pooling Website..." -ForegroundColor Green

# Start Server
Write-Host "Starting backend server on port 5000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\server'; npm run dev" -WindowStyle Minimized

# Wait a bit for server to start
Start-Sleep -Seconds 3

# Start Client
Write-Host "Starting frontend client on port 3000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\client'; npm start" -WindowStyle Minimized

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Server is running on http://localhost:5000" -ForegroundColor Green
Write-Host "Client is running on http://localhost:3000" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to stop servers..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

