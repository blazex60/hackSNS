#Requires -Version 5.1

$host.UI.RawUI.WindowTitle = 'hackSNS Launcher'

Write-Host '========================================'
Write-Host '  hackSNS サーバーを起動しています...'
Write-Host '========================================'
Write-Host ''

# Docker 起動確認
docker info 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host '[エラー] Docker が起動していません。Docker Desktop を起動してから再実行してください。'
    Start-Sleep -Seconds 3
    exit 1
}

# Docker コンテナをバックグラウンドの新しいウィンドウで起動
Start-Process powershell.exe -ArgumentList @(
    '-NoProfile',
    '-ExecutionPolicy', 'Bypass',
    '-NoExit',
    '-Command', 'docker compose up --build'
) -WorkingDirectory $PSScriptRoot -WindowStyle Normal

# サーバーが起動するまでポーリング（最大120秒）
Write-Host 'ブラウザを開くまで少々お待ちください...'
$timeout = 120
$elapsed = 0
$ready = $false
while ($elapsed -lt $timeout) {
    try {
        Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop | Out-Null
        $ready = $true
        break
    } catch {
        Start-Sleep -Seconds 2
        $elapsed += 2
    }
}

if (-not $ready) {
    Write-Host '[警告] サーバーの起動確認がタイムアウトしました。ブラウザを開きます。'
}

# ブラウザで開く
Start-Process 'http://localhost:3000'

Write-Host 'ブラウザが起動しました。'
Write-Host 'このウィンドウは自動で閉じます。'
Start-Sleep -Seconds 2
