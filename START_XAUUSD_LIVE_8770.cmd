@echo off
title XAUUSD LIVE 8770
setlocal EnableExtensions
set "BRIDGE=%TEMP%\amibroker_live_8770.ps1"
set "PS64=%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe"
set "PS32=%SystemRoot%\SysWOW64\WindowsPowerShell\v1.0\powershell.exe"
set "PSRUN="
set "WHEEL=https://htmlpreview.github.io/?https://github.com/saloqbi/TASI/blob/main/public/kawkabat-al-arqam-al-sihria-v496-gold-wheel-live-cell-verified.html"

echo Testing AmiBroker connection...
"%PS64%" -NoLogo -NoProfile -ExecutionPolicy Bypass -Command "try{$a=New-Object -ComObject Broker.Application;[void][Runtime.InteropServices.Marshal]::FinalReleaseComObject($a);exit 0}catch{exit 1}" >nul 2>&1
if not errorlevel 1 set "PSRUN=%PS64%"
if not defined PSRUN if exist "%PS32%" (
 "%PS32%" -NoLogo -NoProfile -ExecutionPolicy Bypass -Command "try{$a=New-Object -ComObject Broker.Application;[void][Runtime.InteropServices.Marshal]::FinalReleaseComObject($a);exit 0}catch{exit 1}" >nul 2>&1
 if not errorlevel 1 set "PSRUN=%PS32%"
)
if not defined PSRUN (
 echo ERROR: AmiBroker OLE is not registered for 32-bit or 64-bit PowerShell.
 echo Open AmiBroker as Administrator once, then run this file again.
 pause
 exit /b 1
)

echo Clearing old process on port 8770...
"%PSRUN%" -NoLogo -NoProfile -ExecutionPolicy Bypass -Command "$ops=Get-NetTCPConnection -LocalPort 8770 -State Listen -ErrorAction SilentlyContinue|Select-Object -ExpandProperty OwningProcess -Unique;foreach($op in $ops){Stop-Process -Id $op -Force -ErrorAction SilentlyContinue}" >nul 2>&1

echo Downloading LIVE bridge...
"%PSRUN%" -NoLogo -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop';Invoke-WebRequest -UseBasicParsing 'https://raw.githubusercontent.com/saloqbi/TASI/main/tools/amibroker_wheel_recovery_v502.ps1' -OutFile '%BRIDGE%'"
if errorlevel 1 (echo ERROR: Download failed.&pause&exit /b 1)

start "XAUUSD LIVE 8770 - KEEP OPEN" "%PSRUN%" -NoLogo -NoProfile -ExecutionPolicy Bypass -NoExit -File "%BRIDGE%" -Port 8770 -Symbol XAUUSD

echo Verifying actual price from port 8770...
"%PSRUN%" -NoLogo -NoProfile -ExecutionPolicy Bypass -Command "$ok=$false;1..80|ForEach-Object{try{$q=Invoke-RestMethod 'http://127.0.0.1:8770/quote' -TimeoutSec 2;if($q.ok -and [double]$q.price -gt 0){Write-Host ('CONNECTED XAUUSD '+$q.price) -ForegroundColor Green;$ok=$true;break}}catch{};Start-Sleep -Milliseconds 250};if(-not $ok){exit 1}"
if errorlevel 1 (
 echo ERROR: Port 8770 started but AmiBroker did not return XAUUSD.
 echo Read the red message in the other PowerShell window.
 pause
 exit /b 1
)

echo SUCCESS. Opening the verified wheel...
start "" "%WHEEL%"
pause
endlocal
