@echo off
echo Starting Car Pooling Website...
echo.

echo Starting backend server...
start "Server" cmd /k "cd server && npm run dev"

timeout /t 3 /nobreak >nul

echo Starting frontend client...
start "Client" cmd /k "cd client && npm start"

echo.
echo ========================================
echo Server: http://localhost:5000
echo Client: http://localhost:3000
echo ========================================
echo.
echo Both servers are running in separate windows.
echo Close those windows to stop the servers.
pause

