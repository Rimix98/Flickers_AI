@echo off
chcp 65001 >nul
title Создание портативного пакета Flickers AI
color 0E

echo.
echo ╔════════════════════════════════════════╗
echo ║  Создание портативного пакета v1.0.1   ║
echo ╚════════════════════════════════════════╝
echo.

set PACKAGE_NAME=Flickers-AI-Portable-Package-1.0.1
set PACKAGE_DIR=%PACKAGE_NAME%

echo [1/6] Создание структуры папок...
if exist "%PACKAGE_DIR%" rmdir /s /q "%PACKAGE_DIR%"
mkdir "%PACKAGE_DIR%"
mkdir "%PACKAGE_DIR%\backend"
mkdir "%PACKAGE_DIR%\frontend"
mkdir "%PACKAGE_DIR%\frontend\release"
echo ✓ Структура создана

echo.
echo [2/6] Копирование backend...
xcopy /E /I /Y backend "%PACKAGE_DIR%\backend" >nul
if exist "%PACKAGE_DIR%\backend\__pycache__" rmdir /s /q "%PACKAGE_DIR%\backend\__pycache__"
if exist "%PACKAGE_DIR%\backend\chats" rmdir /s /q "%PACKAGE_DIR%\backend\chats"
mkdir "%PACKAGE_DIR%\backend\chats"
echo ✓ Backend скопирован

echo.
echo [3/6] Копирование frontend...
if not exist "frontend\release\win-unpacked" (
    echo ❌ Сначала соберите приложение: cd frontend ^&^& build-all.bat
    pause
    exit /b 1
)
xcopy /E /I /Y "frontend\release\win-unpacked" "%PACKAGE_DIR%\frontend\release\win-unpacked" >nul
copy /Y "frontend\release\Запустить Flickers AI.bat" "%PACKAGE_DIR%\frontend\release\" >nul
echo ✓ Frontend скопирован

echo.
echo [4/6] Копирование документации...
copy /Y "frontend\PORTABLE_README.md" "%PACKAGE_DIR%\README.md" >nul
copy /Y "frontend\LICENSE.txt" "%PACKAGE_DIR%\LICENSE.txt" >nul
echo ✓ Документация скопирована

echo.
echo [5/6] Создание ярлыка запуска...
(
echo @echo off
echo cd /d "%%~dp0frontend\release"
echo call "Запустить Flickers AI.bat"
) > "%PACKAGE_DIR%\Запустить Flickers AI.bat"
echo ✓ Ярлык создан

echo.
echo [6/6] Создание архива...
if exist "%PACKAGE_NAME%.zip" del "%PACKAGE_NAME%.zip"
powershell -command "Compress-Archive -Path '%PACKAGE_DIR%' -DestinationPath '%PACKAGE_NAME%.zip' -Force"
if errorlevel 1 (
    echo ⚠ Не удалось создать ZIP архив
    echo Используйте папку %PACKAGE_DIR% вручную
) else (
    echo ✓ Архив создан: %PACKAGE_NAME%.zip
)

echo.
echo ╔════════════════════════════════════════╗
echo ║     Портативный пакет готов!           ║
echo ║                                        ║
echo ║  Папка: %PACKAGE_DIR%
echo ║  Архив: %PACKAGE_NAME%.zip
echo ║                                        ║
echo ║  Содержимое:                           ║
echo ║  • Backend сервер                      ║
echo ║  • Frontend приложение                 ║
echo ║  • Скрипт запуска                      ║
echo ║  • Документация                        ║
echo ╚════════════════════════════════════════╝
echo.

echo Открыть папку с пакетом? (Y/N)
set /p choice=
if /i "%choice%"=="Y" start explorer .

pause
