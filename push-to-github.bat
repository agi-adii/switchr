@echo off
setlocal
echo ===================================================
echo   Switchr - Push to GitHub Repository
echo ===================================================
echo.
set /p REPO_URL="Paste your GitHub repository URL (e.g. https://github.com/YourUsername/Switchr.git): "

if "%REPO_URL%"=="" (
    echo [ERROR] No URL provided. Aborting.
    pause
    exit /b 1
)

echo.
echo [1/3] Adding Git to PATH...
set "PATH=%PATH%;C:\Users\Aditiya pal\AppData\Local\GitHubDesktop\app-3.6.4\resources\app\git\cmd"

echo [2/3] Setting remote origin to %REPO_URL%...
git remote remove origin >nul 2>&1
git remote add origin %REPO_URL%

echo [3/3] Pushing to main branch on GitHub...
git branch -M main
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ===================================================
    echo   SUCCESS! Your project is now published on GitHub!
    echo ===================================================
) else (
    echo.
    echo [NOTE] If you saw an authentication prompt, please sign in.
    echo If the repository already had files, try running: git push -u origin main --force
)

echo.
pause
