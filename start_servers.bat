@echo off
title TeeVerse Full Stack Server Starter
color 0A

echo ========================================================
echo          TEEVERSE STREETWEAR - FULL STACK STARTER
echo ========================================================
echo.
echo [1/2] 🗄️ Starting Node.js Express API Server (http://localhost:5000)...
start "TeeVerse Backend API (Port 5000)" cmd /k "cd /d %~dp0backend && node server.js"

ping -n 3 127.0.0.1 >nul

echo [2/2] 🎨 Starting React Vite Dev Server (http://localhost:5173)...
start "TeeVerse Frontend Dev (Port 5173)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================================
echo ✅ Both TeeVerse servers launched successfully!
echo.
echo 🌐 Storefront Web App : http://localhost:5173/
echo ⚙️ Backend API Server : http://localhost:5000/
echo 👑 Admin Credentials  : teenesttt@gmail.com / TeeVerse@2026
echo ========================================================
echo.
