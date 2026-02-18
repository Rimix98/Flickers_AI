@echo off
chcp 65001 >nul
title Сборка Flickers AI Portable
color 0B

echo.
echo ╔════════════════════════════════════════╗
echo ║   Сборка Flickers AI Portable v1.0.1   ║
echo ╚════════════════════════════════════════╝
echo.

echo [1/4] Проверка Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js не найден! Установите Node.js 18+
    pause
    exit /b 1
)
echo ✓ Node.js найден

echo.
echo [2/4] Установка зависимостей...
call npm install
if errorlevel 1 (
    echo ❌ Ошибка установки зависимостей
    pause
    exit /b 1
)
echo ✓ Зависимости установлены

echo.
echo [3/4] Сборка frontend...
call npm run build
if errorlevel 1 (
    echo ❌ Ошибка сборки frontend
    pause
    exit /b 1
)
echo ✓ Frontend собран

echo.
echo [4/4] Создание портативного EXE...
call npx electron-builder --win portable
if errorlevel 1 (
    echo ❌ Ошибка создания EXE
    pause
    exit /b 1
)
echo ✓ Портативный EXE создан

echo.
echo ╔════════════════════════════════════════╗
echo ║        Сборка завершена успешно!       ║
echo ║   Файлы находятся в папке release/     ║
echo ╚════════════════════════════════════════╝
echo.

echo Открыть папку с результатами? (Y/N)
set /p choice=
if /i "%choice%"=="Y" start explorer release

pause
