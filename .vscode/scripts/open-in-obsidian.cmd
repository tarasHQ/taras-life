@echo off
setlocal enabledelayedexpansion

:: 1. Get raw file path argument
set "FILE=%~1"

:: 2. Replace all backslashes with forward slashes
set "FILE=!FILE:\=/!"

:: 3. Strip everything up to and including "__obsidian__/"
set "FILE=!FILE:*__obsidian__/=!"

:: 4. Launch Obsidian directly (instant)
start "" "obsidian://open?vault=Obsidian-Vault&file=ThePlan/Job-Career-Finances/0vibes/vsc-link/!FILE!"
