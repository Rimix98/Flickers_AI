# 📦 Руководство по сборке портативной версии Flickers AI

## Обзор

Это руководство поможет вам создать полностью портативную версию Flickers AI, которая включает:
- Портативный EXE файл (не требует установки)
- Backend сервер
- Автоматический скрипт запуска
- Всю необходимую документацию

## 🎯 Быстрый старт

### Полная сборка (рекомендуется)

```batch
# 1. Соберите frontend приложение
cd frontend
build-all.bat

# 2. Создайте портативный пакет
cd ..
create-portable-package.bat
```

Готово! Вы получите:
- Папку `Flickers-AI-Portable-Package-1.0.1/` с полным пакетом
- ZIP архив `Flickers-AI-Portable-Package-1.0.1.zip` для распространения

### Только портативный EXE

Если нужен только EXE файл без полного пакета:

```batch
cd frontend
build-portable.bat
```

Результат: `frontend/release/Flickers-AI-Portable-1.0.1.exe`

## 📋 Требования для сборки

- Windows 10/11 (64-bit)
- Node.js 18+ и npm
- Python 3.8+
- ~2 GB свободного места

## 🔨 Детальные инструкции

### Шаг 1: Подготовка

```batch
# Установите зависимости frontend
cd frontend
npm install

# Установите зависимости backend
cd ../backend
pip install -r requirements.txt
```

### Шаг 2: Сборка frontend

```batch
cd frontend

# Вариант A: Только портативный EXE
build-portable.bat

# Вариант B: Все версии (NSIS + Portable)
build-all.bat
```

### Шаг 3: Создание полного пакета

```batch
cd ..
create-portable-package.bat
```

Этот скрипт:
1. Создает структуру папок
2. Копирует backend с зависимостями
3. Копирует собранный frontend
4. Добавляет документацию и лицензию
5. Создает скрипт автозапуска
6. Упаковывает все в ZIP архив

## 📂 Структура результата

```
Flickers-AI-Portable-Package-1.0.1/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── .env.example
│   └── chats/
├── frontend/
│   └── release/
│       ├── win-unpacked/
│       │   └── Flickers AI.exe
│       └── Запустить Flickers AI.bat
├── Запустить Flickers AI.bat  # Главный ярлык
├── README.md                   # Инструкции для пользователя
└── LICENSE.txt
```

## 🎨 Настройка сборки

### Изменение версии

Отредактируйте `frontend/package.json`:

```json
{
  "version": "1.0.2"
}
```

Также обновите версию в:
- `create-portable-package.bat` (переменная PACKAGE_NAME)
- `frontend/build-portable.bat` (в заголовке)
- `frontend/build-all.bat` (в заголовке)

### Изменение иконки

Замените файл `frontend/public/icon.png` на свою иконку (рекомендуется 512x512 px)

### Настройка electron-builder

Отредактируйте секцию `"build"` в `frontend/package.json`:

```json
{
  "build": {
    "appId": "com.yourcompany.app",
    "productName": "Your App Name",
    "win": {
      "icon": "public/icon.png"
    }
  }
}
```

## 🚀 Распространение

### Вариант 1: ZIP архив (рекомендуется)

Отправьте пользователям файл `Flickers-AI-Portable-Package-1.0.1.zip`

Инструкции для пользователя:
1. Распакуйте архив
2. Запустите `Запустить Flickers AI.bat`
3. Готово!

### Вариант 2: Только EXE

Отправьте файл `Flickers-AI-Portable-1.0.1.exe`

⚠️ Пользователю нужно будет:
1. Отдельно настроить backend
2. Запустить backend вручную
3. Затем запустить EXE

### Вариант 3: NSIS установщик

Используйте `Flickers AI Setup 1.0.1.exe` для традиционной установки

## 🔍 Проверка сборки

После сборки проверьте:

1. ✅ EXE файл запускается
2. ✅ Backend подключается
3. ✅ Все функции работают
4. ✅ Нет ошибок в консоли
5. ✅ Размер пакета разумный (~100-200 MB)

## 🐛 Устранение проблем

### Ошибка "electron-builder not found"

```batch
cd frontend
npm install electron-builder --save-dev
```

### Ошибка сборки Vite

```batch
cd frontend
npm run build
# Проверьте ошибки в выводе
```

### Большой размер пакета

Проверьте, что не включены лишние файлы:
- `node_modules` не должны попадать в пакет
- `__pycache__` должны быть удалены
- Старые чаты не нужны в дистрибутиве

## 📊 Размеры файлов

Примерные размеры:
- Портативный EXE: ~80-100 MB
- NSIS установщик: ~80-100 MB
- Полный ZIP пакет: ~100-150 MB
- Распакованный пакет: ~200-250 MB

## 🔄 Автоматизация

Для CI/CD создайте скрипт `build-release.bat`:

```batch
@echo off
cd frontend
call npm install
call npm run build
call npx electron-builder --win
cd ..
call create-portable-package.bat
```

## 📝 Чеклист релиза

- [ ] Обновлена версия в package.json
- [ ] Обновлены все скрипты сборки
- [ ] Протестирован backend
- [ ] Протестирован frontend
- [ ] Собран портативный EXE
- [ ] Создан полный пакет
- [ ] Проверена работа на чистой системе
- [ ] Обновлена документация
- [ ] Создан changelog

## 🎓 Дополнительные ресурсы

- [Electron Builder документация](https://www.electron.build/)
- [Vite документация](https://vitejs.dev/)
- [Python packaging](https://packaging.python.org/)

---

**Версия руководства:** 1.0.1  
**Последнее обновление:** Февраль 2026
