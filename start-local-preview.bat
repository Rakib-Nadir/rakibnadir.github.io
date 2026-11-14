@echo off
rem Local preview of the site at http://localhost:8000  (close this window to stop it)
cd /d "%~dp0"
set PORT=8000
start "" "http://localhost:%PORT%/"
where python >nul 2>nul && (python serve.py %PORT% & goto :eof)
where py >nul 2>nul && (py serve.py %PORT% & goto :eof)
if exist "%USERPROFILE%\anaconda3\python.exe" ("%USERPROFILE%\anaconda3\python.exe" serve.py %PORT% & goto :eof)
echo Python was not found. Install Python or run this from an Anaconda Prompt.
pause
