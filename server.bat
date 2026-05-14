@echo off
echo [DEBUG] script dir: %~dp0
if not exist "%~dp0server.ps1" (
    echo [ERROR] server.ps1 not found!
    pause
    exit /b 1
)
echo [DEBUG] launching PowerShell...
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"
echo [DEBUG] PowerShell exit code: %errorlevel%
pause
