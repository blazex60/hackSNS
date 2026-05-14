#Requires -Version 5.1

$host.UI.RawUI.WindowTitle = 'hackSNS Stop'

Write-Host '========================================'
Write-Host '  hackSNS サーバーを停止しています...'
Write-Host '========================================'
Write-Host ''

Set-Location $PSScriptRoot
docker compose down

Write-Host ''
Write-Host 'サーバーを停止しました。'
Start-Sleep -Seconds 2
