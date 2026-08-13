@echo off
title AmiBroker Gold Fast Link V498
setlocal
set "PSFILE=%TEMP%\amibroker_gold_bridge_v498_fast.ps1"
set "WHEEL=https://htmlpreview.github.io/?https://github.com/saloqbi/TASI/blob/main/public/kawkabat-al-arqam-al-sihria-v496-gold-wheel-live-cell-verified.html"

echo.
echo ==========================================
echo   XAUUSD AMIBROKER FAST LINK V498
echo ==========================================
echo.

powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; Invoke-WebRequest -UseBasicParsing 'https://raw.githubusercontent.com/saloqbi/TASI/main/tools/amibroker_gold_bridge_v498_fast.ps1' -OutFile '%PSFILE%'"
if errorlevel 1 (
  echo Failed to download the bridge.
  pause
  exit /b 1
)

start "AmiBroker Gold Bridge V498" powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -NoExit -File "%PSFILE%" -Port 8768 -Symbol XAUUSD

echo Waiting for AmiBroker and port 8768...
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -Command "$ok=$false; 1..40 | ForEach-Object { try { $h=Invoke-RestMethod -Uri 'http://127.0.0.1:8768/health' -TimeoutSec 1; if($h.ok){$ok=$true; break} } catch {}; Start-Sleep -Milliseconds 250 }; if(-not $ok){exit 1}"
if errorlevel 1 (
  echo.
  echo Bridge did not become ready. Keep the PowerShell window open and send its error.
  pause
  exit /b 1
)

echo Bridge is ready. Opening the wheel...
start "" "%WHEEL%"
endlocal
