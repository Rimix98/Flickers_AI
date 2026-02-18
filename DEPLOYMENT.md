# 🚀 Инструкция по деплою Flickers AI

## 📦 Что было обновлено

### Backend (Render)
- ✅ Все модели теперь бесплатные (`:free` суффикс)
- ✅ Полностью убрана цензура для всех режимов
- ✅ Исправлен режим программирования (больше не отказывается отвечать)
- ✅ Системные промпты обновлены

### Frontend (Vercel)
- ✅ Полная поддержка русского и английского языков
- ✅ Селектор моделей на приветственном экране
- ✅ Анимация печати в режиме кодинга
- ✅ Обновленные переводы

## 🔧 Настройка деплоя

### 1. Backend на Render

1. Зайди на [Render Dashboard](https://dashboard.render.com/)
2. Найди сервис `flickers-ai-backend`
3. Перейди в Settings → Build & Deploy
4. Убедись что:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Root Directory**: `backend`
5. В Environment добавь:
   - `OPENROUTER_API_KEY` = твой ключ от OpenRouter
6. Нажми "Manual Deploy" → "Deploy latest commit"

### 2. Frontend на Vercel

1. Зайди на [Vercel Dashboard](https://vercel.com/dashboard)
2. Найди проект Flickers AI
3. Перейди в Settings → General
4. Убедись что:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. В Settings → Environment Variables добавь:
   - `VITE_API_URL` = `https://flickers-ai-backend.onrender.com`
6. Нажми "Redeploy" на последнем деплое

### 3. Автоматический деплой

Оба сервиса настроены на автоматический деплой при пуше в `main` ветку:
- **Render**: автоматически деплоит backend при изменениях в `backend/`
- **Vercel**: автоматически деплоит frontend при изменениях в `frontend/`

## 🔍 Проверка деплоя

### Backend
```bash
curl https://flickers-ai-backend.onrender.com/
# Должен вернуть: {"status":"ok","message":"Flickers AI API","version":"1.0.0"}
```

### Frontend
Открой https://flickers-ai.vercel.app/ и проверь:
- ✅ Переключение языка работает
- ✅ Селектор моделей виден на главной
- ✅ Режим кодинга работает без отказов
- ✅ Все модели бесплатные

## 📝 Модели

Все модели теперь используют бесплатные версии:

| Название | Реальная модель |
|----------|----------------|
| Flickers AI 2.0 ULTRA | qwen/qwen-2.5-72b-instruct:free |
| Flickers AI 2.2 ULTRA CODING | qwen/qwen-2.5-72b-instruct:free |
| Flickers AI 2.5 PRO | mistralai/mixtral-8x7b-instruct:free |
| Flickers AI 2.5 FAST | meta-llama/llama-3.1-8b-instruct:free |
| Flickers AI 2.0 FAST | mistralai/mistral-7b-instruct:free |

## 🐛 Если что-то не работает

1. **Backend не отвечает**: Проверь логи на Render Dashboard
2. **Frontend не обновился**: Очисти кеш браузера (Ctrl+Shift+R)
3. **Модели не работают**: Проверь что `OPENROUTER_API_KEY` установлен в Render
4. **Ошибка CORS**: Убедись что в `backend/main.py` разрешены все origins

## 🔄 Как обновить в будущем

1. Внеси изменения в код
2. Закоммить:
   ```bash
   git add .
   git commit -m "Описание изменений"
   git push
   ```
3. Render и Vercel автоматически задеплоят изменения

## 📱 APK для Android

APK уже собран и находится в корне проекта: `Flickers-AI.apk`

Чтобы пересобрать:
```bash
cd frontend
npm run build
npx cap sync android
cd android
.\gradlew.bat assembleDebug
```

APK будет в: `frontend/android/app/build/outputs/apk/debug/app-debug.apk`
