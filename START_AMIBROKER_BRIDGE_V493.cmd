@echo off
title AmiBroker V493 Live Bridge
setlocal
set "PSFILE=%TEMP%\amibroker_live_bridge_v493.ps1"
echo.
echo ==========================================
echo   AMIBROKER V493 LIVE BRIDGE - STARTING
echo ==========================================
echo.
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; Invoke-WebRequest -UseBasicParsing 'https://raw.githubusercontent.com/saloqbi/TASI/main/tools/amibroker_live_bridge_v493.ps1' -OutFile '%PSFILE%'; & '%PSFILE%' -Port 8768 -DefaultSymbol 'XAUUSD'"
if errorlevel 1 (
  echo.
  echo Bridge failed to start. Keep this window open and send the error shown above.
  pause
)
endlocal
