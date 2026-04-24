@echo off
cd /d "%~dp0"
title hackSNS Launcher

echo ========================================
echo   hackSNS サーバーを起動しています...
echo ========================================
echo.

REM Docker コンテナをバックグラウンドで起動
start "hackSNS Docker" cmd /k "cd /d "%~dp0" && docker compose up --build"

REM サーバーの起動を待機
echo ブラウザを開くまで少々お待ちください...
timeout /t 12 /nobreak > nul

REM ブラウザで開く
start "" "http://localhost:3000"

echo ブラウザが起動しました。
echo このウィンドウは自動で閉じます。
timeout /t 2 /nobreak > nul
exit
