#Requires -Version 5.1

$host.UI.RawUI.WindowTitle = 'ショートカット削除'

$desktop      = [System.Environment]::GetFolderPath('Desktop')
$shortcutPath = Join-Path $desktop 'hackSNS.lnk'

Write-Host '========================================'
Write-Host '  デスクトップのショートカットを削除します'
Write-Host '========================================'
Write-Host ''

if (-not (Test-Path $shortcutPath)) {
    Write-Host '[情報] ショートカットは存在しません:'
    Write-Host "  $shortcutPath"
    Write-Host ''
    Read-Host '続行するには Enter を押してください'
    exit 0
}

Remove-Item $shortcutPath -Force
Write-Host "ショートカットを削除しました: $shortcutPath"
Write-Host ''
Read-Host '続行するには Enter を押してください'
