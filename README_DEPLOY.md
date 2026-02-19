# 🚀 Как задеплоить Flickers AI на Render и Vercel

## 📋 Что нужно

1. Аккаунт на [Render](https://render.com) (бесплатный)
2. Аккаунт на [Vercel](https://vercel.com) (бесплатный)
3. Ключ API от [Hugging Face](https://huggingface.co/settings/tokens) (бесплатный)
4. Репозиторий на GitHub (у тебя уже есть)

## 🔧 Часть 1: Backend на Render (10 минут)

### 1.1 Создай новый Web Service

1. Зайди на https://dashboard.render.com/
2. Нажми **"New +"** → **"Web Service"**
3. Подключи свой GitHub репозиторий `Rimix98/Flickers_AI`
4. Настрой параметры:

```
Name: flickers-ai-backend
Region: Frankfurt (EU Central) или ближайший к тебе
Branch: main
Root Directory: backend
Runtime: Python 3
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### 1.2 Добавь Environment Variables

В разделе **Environment**:

```
HUGGINGFACE_API_KEY = твой_ключ_от_huggingface
```

Получить ключ: https://huggingface.co/settings/tokens

### 1.3 Выбери план

- **Free** (бесплатный) - достаточно для тестирования
- Минус: засыпает после 15 минут неактивности
- Плюс: полностью бесплатный

### 1.4 Деплой

1. Нажми **"Create Web Service"**
2. Дождись завершения деплоя (3-5 минут)
3. Скопируй URL (например: `https://flickers-ai-backend.onrender.com`)

### 1.5 Проверь

Открой в браузере:
```
https://твой-backend.onrender.com/
```

Должен вернуть:
```json
{"status":"ok","message":"Flickers AI API","version":"1.0.0"}
```

## 🎨 Часть 2: Frontend на Vercel (5 минут)

### 2.1 Создай новый проект

1. Зайди на https://vercel.com/dashboard
2. Нажми **"Add New..."** → **"Project"**
3. Импортируй репозиторий `Rimix98/Flickers_AI`

### 2.2 Настрой проект

```
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 2.3 Добавь Environment Variable

В разделе **Environment Variables**:

```
VITE_API_URL = https://твой-backend.onrender.com
```

Вставь URL своего backend с Render (из шага 1.4)

### 2.4 Деплой

1. Нажми **"Deploy"**
2. Дождись завершения (2-3 минуты)
3. Скопируй URL (например: `https://flickers-ai.vercel.app`)

### 2.5 Проверь

1. Открой свой Vercel URL
2. Отправь тестовое сообщение
3. Должен прийти ответ от AI

## ✅ Готово!

Теперь у тебя:
- ✅ Backend работает на Render
- ✅ Frontend работает на Vercel
- ✅ Автодеплой при push в GitHub

## 🔄 Автоматические обновления

При каждом `git push origin main`:
- Render автоматически обновит backend
- Vercel автоматически обновит frontend

## 🐛 Troubleshooting

### Backend не отвечает
```bash
# Проверь логи на Render Dashboard
# Убедись что HUGGINGFACE_API_KEY установлен
# Перезапусти сервис
```

### Frontend показывает ошибки
```bash
# Проверь что VITE_API_URL правильный
# Очисти кеш браузера (Ctrl+Shift+R)
# Проверь DevTools → Console
```

### Ошибка "api-inference.huggingface.co"
```bash
# Код уже обновлен!
# Просто передеплой на Render:
# Dashboard → Manual Deploy → Deploy latest commit
```

## 📱 Бонус: Android APK

Если хочешь собрать APK для Android:

```bash
cd frontend
npm run build
npx cap sync android
cd android
.\gradlew.bat assembleDebug
```

APK будет в: `frontend/android/app/build/outputs/apk/debug/`

## 🎉 Поздравляю!

Твой AI чат-бот теперь доступен онлайн 24/7!

---

**Автор**: Flickers AI Team
**Дата**: 19 февраля 2026
**Версия**: 1.0.1
