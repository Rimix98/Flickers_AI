@echo off
echo ========================================
echo   Flickers AI - Deploy Status Checker
echo ========================================
echo.

echo Checking Git status...
git log --oneline -3
echo.

echo ========================================
echo   Quick Links:
echo ========================================
echo.
echo Render Dashboard:
echo https://dashboard.render.com/
echo.
echo Vercel Dashboard:
echo https://vercel.com/dashboard
echo.
echo Hugging Face Tokens:
echo https://huggingface.co/settings/tokens
echo.

echo ========================================
echo   Next Steps:
echo ========================================
echo.
echo 1. Open Render Dashboard
echo 2. Find your backend service
echo 3. Go to "Manual Deploy"
echo 4. Click "Deploy latest commit"
echo 5. Wait 2-3 minutes
echo 6. Test your app!
echo.

set /p backend_url="Enter your Render backend URL (or press Enter to skip): "
if not "%backend_url%"=="" (
    echo.
    echo Testing backend...
    curl -s %backend_url% || echo Failed to connect
    echo.
)

echo.
echo See RENDER_DEPLOY_NOW.md for detailed instructions!
echo.
pause
