@echo off
CD /D %~dp0

setlocal enabledelayedexpansion
for %%F in (".\Affected Areas\*.png") do (
	set "filename=%%~nxF"
	echo magick composite -geometry +0+0 "./areas unaffected.png" "./Affected Areas/!filename!" "./Affected Areas B/!filename!"
	magick composite -geometry +0+0 "./areas unaffected.png" "./Affected Areas/!filename!" "./Affected Areas B/!filename!"
)
endlocal
pause