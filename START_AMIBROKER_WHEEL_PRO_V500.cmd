@echo off
title AmiBroker Wheel Launcher V500
setlocal
set "PSFILE=%TEMP%\amibroker_wheel_professional_v500.ps1"
set "WHEEL=https://htmlpreview.github.io/?https://github.com/saloqbi/TASI/blob/main/public/kawkabat-al-arqam-al-sihria-v500-v496-design-amibroker-professional.html"
taskkill /FI "WINDOWTITLE eq AmiBroker Gold Bridge*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq AmiBroker Wheel Professional Link V500*" /T /F >nul 2>&1
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop';Invoke-WebRequest -UseBasicParsing 'https://raw.githubusercontent.com/saloqbi/TASI/main/tools/amibroker_wheel_professional_v499.ps1' -OutFile '%PSFILE%'"
if errorlevel 1 (echo Failed to download V500 bridge.&pause&exit /b 1)
start "AmiBroker Wheel Professional Link V500" powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -NoExit -File "%PSFILE%" -Port 8768 -Symbol XAUUSD
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -Command "$ok=$false;1..40|%%{try{$h=Invoke-RestMethod 'http://127.0.0.1:8768/health' -TimeoutSec 1;if($h.ok){$ok=$true;break}}catch{};Start-Sleep -Milliseconds 250};if(-not$ok){exit 1}"
if errorlevel 1 (echo Bridge did not become ready.&pause&exit /b 1)
start "" "%WHEEL%"
endlocal
