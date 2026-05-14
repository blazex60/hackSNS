@echo off
chcp 65001 > nul
echo [DEBUG] script dir: %~dp0
if not exist "%~dp0デスクトップから削除.ps1" (
    echo [ERROR] ps1 not found!
    pause
    exit /b 1
)
echo [DEBUG] launching PowerShell...
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0デスクトップから削除.ps1"
echo [DEBUG] PowerShell exit code: %errorlevel%
pause
