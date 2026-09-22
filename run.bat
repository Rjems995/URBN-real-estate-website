@echo off
title URBN Real Estate Server
cd /d "%~dp0"

echo ===================================================
echo   Starting URBN Luxury Real Estate Web Server...
echo ===================================================
echo.
echo Opening browser at http://127.0.0.1:5000 ...
start http://127.0.0.1:5000

echo.
echo Starting Python Flask server (Press Ctrl+C to stop)...
python app.py

pause

