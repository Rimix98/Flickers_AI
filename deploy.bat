@echo off
echo ========================================
echo   Flickers AI - Quick Deploy Script
echo ========================================
echo.

echo [1/3] Checking Git status...
git status
echo.

echo [2/3] Adding all changes...
git add .
echo.

echo [3/3] Committing and pushing...
set /p commit_msg="Enter commit message (or press Enter for default): "
if "%commit_msg%"=="" set commit_msg=Update: Hugging Face API router.huggingface.co

git commit -m "%commit_msg%"
git push origin main

echo.
echo ========================================
echo   Deploy Complete!
echo ========================================
echo.
echo Backend (Render) will auto-deploy in 2-3 minutes
echo Frontend (Vercel) will auto-deploy in 1-2 minutes
echo.
echo Check status:
echo - Render: https://dashboard.render.com/
echo - Vercel: https://vercel.com/dashboard
echo.
pause
