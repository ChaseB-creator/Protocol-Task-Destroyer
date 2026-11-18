#!/usr/bin/env bash
# Protocol: Task Destroyer - Desktop Launcher for Linux & macOS
echo "================================================================"
echo "  Launching Protocol: Task Destroyer - Orbital Mission Control  "
echo "================================================================"

if [ ! -d "dist" ]; then
    echo "Building production bundle..."
    npm run build
fi

echo "Starting desktop application..."
npm run electron:start
