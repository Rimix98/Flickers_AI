# Инструкции по сборке Flickers AI

## Требования

- Node.js 18+ и npm
- Python 3.8+
- Windows (для сборки Windows приложения)

## Установка зависимостей

```bash
cd frontend
npm install
```

## Сборка портативного EXE

Для сборки только портативной версии:

```bash
npm run electron:build
```

Для сборки всех версий (NSIS установщик + портативная версия):

```bash
npm run electron:build-all
```

## Результаты сборки

Собранные файлы будут находиться в папке `frontend/release/`:

- `Flickers-AI-Portable-1.0.1.exe` - портативная версия (не требует установки)
- `Flickers AI Setup 1.0.1.exe` - установщик NSIS

## Запуск в режиме разработки

```bash
# Терминал 1: Запуск backend
cd backend
python main.py

# Терминал 2: Запуск frontend
cd frontend
npm run dev

# Терминал 3: Запуск Electron
cd frontend
npm run electron:dev
```

## Обновление версии

Измените версию в `frontend/package.json`:

```json
{
  "version": "1.0.1"
}
```

Затем пересоберите приложение.
