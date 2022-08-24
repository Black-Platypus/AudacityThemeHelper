@echo off
CD /D %~dp0

if "%~1" == "" (
	echo No file supplied: Please drop a file on this script or supply a filename as its first argument!
	pause
	exit /b
)

set targetName=ImageCache
set targetExt=.png

del /F /S /Q "%targetName%_bak%targetExt%"
ren "%targetName%%targetExt%" "%targetName%_bak%targetExt%"

copy "%~1" "%targetName%%targetExt%" /Y >NUL
move "%~1" ".\Color Tests\"
REM pause
REM pwsh setComment.ps1 "%targetName%%targetExt%" "%~nx1"
REM pause