@echo off
set GIT_TERMINAL_PROMPT=1
echo 🚀 Preparing to push v1.1.9 fixes to GitHub...
echo.
echo ⚠️  If no pop-up appears, you will be asked for your
echo GitHub Username and Password (Token) RIGHT HERE in this window.
echo.
"C:\Program Files\Git\cmd\git.exe" push -u origin main --force
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Push failed. 
    echo TIP: Use a "Personal Access Token" instead of your password if it fails.
) else (
    echo.
    echo ✅ Push successful! Render will now rebuild.
)
pause
