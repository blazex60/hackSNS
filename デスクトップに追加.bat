@echo off
chcp 65001 > nul
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0デスクトップに追加.ps1"
pause
