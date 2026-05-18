Get-ChildItem *.bat | foreach {
    $c = Get-Content $_.FullName -Raw -Encoding UTF8
    $c = $c -replace "(?<!\r)\n", "`r`n"
    $c = $c -replace "Get-Content '%~f0' -Raw\)", "Get-Content '%~f0' -Raw -Encoding UTF8)"
    $utf8NoBom = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText($_.FullName, $c, $utf8NoBom)
}
Write-Host "Done!"
