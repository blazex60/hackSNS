<# :
@echo off
setlocal
cd /d "%~dp0"
chcp 65001 > nul
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "& ([ScriptBlock]::Create((Get-Content '%~f0' -Raw -Encoding UTF8)))"
pause
exit /b %ERRORLEVEL%
#>
$PSScriptRoot = (Get-Location).Path

$host.UI.RawUI.WindowTitle = 'ショートカット作成'

$projectDir = $PSScriptRoot

Write-Host '========================================'
Write-Host '  デスクトップにショートカットを作成します'
Write-Host '========================================'
Write-Host ''
Write-Host "プロジェクトフォルダ: $projectDir"
Write-Host ''

# プロジェクトフォルダの存在確認
$serverScript = Join-Path $projectDir 'server.bat'
if (-not (Test-Path $serverScript)) {
    Write-Host '[エラー] プロジェクトが見つかりません:'
    Write-Host "  $serverScript"
    Write-Host ''
    Write-Host 'hackSNS プロジェクトを正しく配置してください。'
    Read-Host '続行するには Enter を押してください'
    exit 1
}

# [1/2] Docker イメージをビルド
Write-Host '[1/2] Docker イメージをビルドしています...'
Push-Location $projectDir
docker compose build
$buildResult = $LASTEXITCODE
Pop-Location

if ($buildResult -ne 0) {
    Write-Host ''
    Write-Host '[エラー] docker compose build に失敗しました。'
    Write-Host 'Docker Desktop がインストール・起動されているか確認してください。'
    Read-Host '続行するには Enter を押してください'
    exit 1
}
Write-Host ''

# [2/2] デスクトップにショートカットを作成
Write-Host '[2/2] デスクトップにショートカットを作成しています...'

$desktop      = [System.Environment]::GetFolderPath('Desktop')
$shortcutPath = Join-Path $desktop 'hackSNS.lnk'
$ps1Path      = Join-Path $projectDir 'server.bat'

$wsh = New-Object -ComObject WScript.Shell
$sc  = $wsh.CreateShortcut($shortcutPath)
$sc.TargetPath       = $ps1Path
$sc.WorkingDirectory = $projectDir
$sc.Description      = 'hackSNS を起動する'
$sc.WindowStyle      = 1
$sc.Save()

Write-Host "ショートカットを作成しました: $shortcutPath"
Write-Host ''
Write-Host 'デスクトップに「hackSNS」ショートカットを作成しました。'
Write-Host '次回からはデスクトップのアイコンをダブルクリックするだけで起動できます。'
Write-Host ''
Read-Host '続行するには Enter を押してください'
