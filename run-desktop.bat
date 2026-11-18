@echo off
title Protocol: Task Destroyer - Desktop Launcher
echo ================================================================
echo   Launching Protocol: Task Destroyer - Orbital Mission Control
echo ================================================================
echo.

if not exist "dist" (
    echo Building production bundle...
    call npm run build
)

echo Starting desktop application...
call npm run electron:start
