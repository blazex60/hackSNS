#Requires -Version 5.1

$host.UI.RawUI.WindowTitle = 'hackSNS Stop'

Write-Host '========================================'
Write-Host '  hackSNS サーバーを停止しています...'
Write-Host '========================================'
Write-Host ''

Set-Location $PSScriptRoot
docker compose down

if ($LASTEXITCODE -ne 0) {
    Write-Host ''
    Write-Host '[エラー] docker compose down に失敗しました。'
    Write-Host 'Docker Desktop がインストール・起動されているか確認してください。'
    Start-Sleep -Seconds 3
    exit 1
}

Write-Host ''
Write-Host 'サーバーを停止しました。'
Start-Sleep -Seconds 2
