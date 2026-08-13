@echo off
title AmiBroker Wheel Recovery V502
setlocal
set "PSFILE=%TEMP%\amibroker_wheel_recovery_v502.ps1"
set "WHEEL=https://htmlpreview.github.io/?https://github.com/saloqbi/TASI/blob/main/public/kawkabat-al-arqam-al-sihria-v502-v496-design-amibroker-recovery.html"

echo Closing any old listener on port 8768...
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -Command "$p=Get-NetTCPConnection -LocalPort 8768 -State Listen -ErrorAction SilentlyContinue ^| Select-Object -ExpandProperty OwningProcess -Unique; foreach($id in $p){if($id -and $id -ne $PID){Stop-Process -Id $id -Force -ErrorAction SilentlyContinue}}"
timeout /t 1 /nobreak >nul

echo Downloading the corrected V502 bridge...
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop';Invoke-WebRequest -UseBasicParsing 'https://raw.githubusercontent.com/saloqbi/TASI/main/tools/amibroker_wheel_recovery_v502.ps1' -OutFile '%PSFILE%'"
if errorlevel 1 (echo Failed to download V502 bridge.&pause&exit /b 1)

start "AmiBroker Wheel Recovery V502" powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -NoExit -File "%PSFILE%" -Port 8768 -Symbol XAUUSD

echo Waiting for the corrected bridge...
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -Command "$ok=$false;1..60|%%{try{$q=Invoke-RestMethod 'http://127.0.0.1:8768/quote' -TimeoutSec 2;if($q.ok -and $q.price -gt 0){$ok=$true;break}}catch{};Start-Sleep -Milliseconds 250};if(-not $ok){exit 1}"
if errorlevel 1 (
 echo.
 echo V502 could not read XAUUSD. Keep the PowerShell window open and send its red error.
 pause
 exit /b 1
)

echo Connection verified. Opening the wheel...
start "" "%WHEEL%"
endlocal
