@echo off
cd /d "%~dp0"
title SNS Launcher

echo ========================================
echo   SNS サーバーを起動しています...
echo ========================================
echo.

REM 開発サーバーを別ウィンドウで起動
start "hackSNS Dev Server" cmd /k "cd /d "%~dp0" && npm run dev"

REM サーバーの起動を待機（5秒）
echo ブラウザを開くまで少々お待ちください...
timeout /t 5 /nobreak > nul

REM ブラウザで開く
start "" "http://localhost:3000"

echo ブラウザを起動しました。
echo このウィンドウは自動で閉じます。
timeout /t 2 /nobreak > nul
exit
