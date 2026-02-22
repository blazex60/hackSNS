@echo off
title ショートカット作成

REM プロジェクトはドキュメントフォルダに格納
set "PROJECT_DIR=%USERPROFILE%\Documents\ktc\hackSNS"

echo ========================================
echo   デスクトップにショートカットを作成します
echo ========================================
echo.
echo プロジェクトフォルダ: %PROJECT_DIR%
echo.

REM プロジェクトフォルダの存在確認
if not exist "%PROJECT_DIR%\server.bat" (
    echo [エラー] プロジェクトが見つかりません:
    echo   %PROJECT_DIR%\server.bat
    echo.
    echo ドキュメントフォルダに hackSNS プロジェクトを配置してください。
    pause
    exit /b 1
)

REM npm install を実行
echo [1/3] npm install を実行しています...
pushd "%PROJECT_DIR%"
call npm install
if %errorlevel% neq 0 (
    echo.
    echo [エラー] npm install に失敗しました。
    popd
    pause
    exit /b 1
)
echo.

REM npm run build を実行
echo [2/3] npm run build を実行しています...
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo [エラー] npm run build に失敗しました。
    popd
    pause
    exit /b 1
)
popd
echo.

REM PowerShell でデスクトップパスを取得してショートカットを作成
echo [3/3] デスクトップにショートカットを作成しています...
powershell -NoProfile -Command ^
  "$desktop = [System.Environment]::GetFolderPath('Desktop');" ^
  "$shortcutPath = Join-Path $desktop 'server.lnk';" ^
  "$projectDir = $env:USERPROFILE + '\Documents\ktc\hackSNS';" ^
  "$wsh = New-Object -ComObject WScript.Shell;" ^
  "$sc = $wsh.CreateShortcut($shortcutPath);" ^
  "$sc.TargetPath = $projectDir + '\server.bat';" ^
  "$sc.WorkingDirectory = $projectDir;" ^
  "$sc.Description = 'hackSNS を起動する';" ^
  "$sc.WindowStyle = 1;" ^
  "$sc.Save();" ^
  "Write-Host 'ショートカットを作成しました:' $shortcutPath"

if %errorlevel% neq 0 (
    echo.
    echo [エラー] ショートカットの作成に失敗しました。
    pause
    exit /b 1
)

echo.
echo デスクトップに「hackSNS」ショートカットを作成しました。
echo 次回からはデスクトップのアイコンをダブルクリックするだけで起動できます。
echo.
pause
