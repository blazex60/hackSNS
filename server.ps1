#Requires -Version 5.1

$host.UI.RawUI.WindowTitle = 'hackSNS Launcher'

Write-Host '========================================'
Write-Host '  hackSNS サーバーを起動しています...'
Write-Host '========================================'
Write-Host ''

# Docker コンテナをバックグラウンドの新しいウィンドウで起動
Start-Process powershell.exe -ArgumentList @(
    '-NoProfile',
    '-ExecutionPolicy', 'Bypass',
    '-Command', "Set-Location '$PSScriptRoot'; docker compose up --build"
) -WindowStyle Normal

# サーバーの起動を待機
Write-Host 'ブラウザを開くまで少々お待ちください...'
Start-Sleep -Seconds 12

# ブラウザで開く
Start-Process 'http://localhost:3000'

Write-Host 'ブラウザが起動しました。'
Write-Host 'このウィンドウは自動で閉じます。'
Start-Sleep -Seconds 2
