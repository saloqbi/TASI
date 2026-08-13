@echo off
title AmiBroker Auto Repair V503
setlocal EnableExtensions
set "PSRUN="
set "PS64=%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe"
set "PS32=%SystemRoot%\SysWOW64\WindowsPowerShell\v1.0\powershell.exe"
set "PSFILE=%TEMP%\amibroker_auto_repair_v503.ps1"
set "WHEEL=https://htmlpreview.github.io/?https://github.com/saloqbi/TASI/blob/main/public/kawkabat-al-arqam-al-sihria-v502-v496-design-amibroker-recovery.html"

echo.
echo ==========================================
echo   AMIBROKER AUTO REPAIR V503
echo ==========================================
echo.
echo Detecting the PowerShell architecture registered for AmiBroker...

"%PS64%" -NoLogo -NoProfile -ExecutionPolicy Bypass -Command "try{$a=New-Object -ComObject 'Broker.Application';[void][Runtime.InteropServices.Marshal]::FinalReleaseComObject($a);exit 0}catch{exit 1}" >nul 2>&1
if not errorlevel 1 set "PSRUN=%PS64%"

if not defined PSRUN if exist "%PS32%" (
  "%PS32%" -NoLogo -NoProfile -ExecutionPolicy Bypass -Command "try{$a=New-Object -ComObject 'Broker.Application';[void][Runtime.InteropServices.Marshal]::FinalReleaseComObject($a);exit 0}catch{exit 1}" >nul 2>&1
  if not errorlevel 1 set "PSRUN=%PS32%"
)

if not defined PSRUN (
  echo ERROR: Windows cannot create AmiBroker Broker.Application in 64-bit or 32-bit PowerShell.
  echo Open AmiBroker once as Administrator, close it, then run this file again as Administrator.
  pause
  exit /b 1
)

echo Compatible PowerShell found:
echo %PSRUN%
echo.
echo Cleaning port 8768...
"%PSRUN%" -NoLogo -NoProfile -ExecutionPolicy Bypass -Command "$owners=Get-NetTCPConnection -LocalPort 8768 -State Listen -ErrorAction SilentlyContinue|Select-Object -ExpandProperty OwningProcess -Unique;foreach($owner in $owners){if($owner -and $owner -ne $PID){Stop-Process -Id $owner -Force -ErrorAction SilentlyContinue}}" >nul 2>&1
timeout /t 1 /nobreak >nul

echo Downloading corrected bridge...
"%PSRUN%" -NoLogo -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop';Invoke-WebRequest -UseBasicParsing 'https://raw.githubusercontent.com/saloqbi/TASI/main/tools/amibroker_wheel_recovery_v502.ps1' -OutFile '%PSFILE%'"
if errorlevel 1 (
  echo ERROR: Bridge download failed.
  pause
  exit /b 1
)

start "AmiBroker Auto Repair V503 - KEEP OPEN" "%PSRUN%" -NoLogo -NoProfile -ExecutionPolicy Bypass -NoExit -File "%PSFILE%" -Port 8768 -Symbol XAUUSD

echo Waiting for a verified XAUUSD price...
"%PSRUN%" -NoLogo -NoProfile -ExecutionPolicy Bypass -Command "$ok=$false;1..80|ForEach-Object{try{$q=Invoke-RestMethod 'http://127.0.0.1:8768/quote' -TimeoutSec 2;if($q.ok -and [double]$q.price -gt 0){Write-Host ('VERIFIED XAUUSD PRICE: '+$q.price) -ForegroundColor Green;$ok=$true;break}}catch{};Start-Sleep -Milliseconds 250};if(-not $ok){exit 1}"
if errorlevel 1 (
  echo.
  echo ERROR: AmiBroker opened, but XAUUSD price could not be read.
  echo Keep the new PowerShell window visible; its message identifies the AmiBroker database problem.
  pause
  exit /b 1
)

echo.
echo SUCCESS: Price verified. Opening the wheel...
start "" "%WHEEL%"
pause
endlocal
