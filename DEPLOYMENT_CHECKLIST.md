# ✅ Чеклист деплоя Flickers AI

## 🎯 Перед деплоем

- [ ] Код обновлен в Git
- [ ] Backend использует `router.huggingface.co`
- [ ] Все тесты пройдены локально
- [ ] `.env` файлы настроены

## 🔧 Backend (Render)

### Настройка окружения
- [ ] Зашел на https://dashboard.render.com/
- [ ] Нашел сервис `flickers-ai-backend`
- [ ] Перешел в **Environment**
- [ ] Удалил `OPENROUTER_API_KEY` (если был)
- [ ] Добавил `HUGGINGFACE_API_KEY` с ключом от https://huggingface.co/settings/tokens

### Настройка билда
- [ ] **Build Command**: `pip install -r requirements.txt`
- [ ] **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- [ ] **Root Directory**: `backend`
- [ ] **Python Version**: 3.11 или выше

### Деплой
- [ ] Нажал "Manual Deploy" → "Deploy latest commit"
- [ ] Дождался завершения (2-3 минуты)
- [ ] Проверил логи на ошибки
- [ ] Проверил статус: `curl https://твой-backend.onrender.com/`

## 🎨 Frontend (Vercel)

### Настройка проекта
- [ ] Зашел на https://vercel.com/dashboard
- [ ] Нашел проект Flickers AI
- [ ] Перешел в **Settings** → **General**
- [ ] **Framework Preset**: Vite
- [ ] **Root Directory**: `frontend`
- [ ] **Build Command**: `npm run build`
- [ ] **Output Directory**: `dist`

### Environment Variables
- [ ] Перешел в **Settings** → **Environment Variables**
- [ ] Проверил `VITE_API_URL` = URL твоего Render backend
- [ ] Пример: `https://flickers-ai-backend.onrender.com`

### Деплой
- [ ] Нажал "Redeploy" на последнем деплое
- [ ] Дождался завершения (1-2 минуты)
- [ ] Проверил логи на ошибки
- [ ] Открыл сайт и проверил работу

## 🧪 Тестирование

### Backend API
```bash
# Проверка статуса
curl https://твой-backend.onrender.com/

# Ожидаемый ответ:
# {"status":"ok","message":"Flickers AI API","version":"1.0.0"}
```

- [ ] API отвечает
- [ ] Статус "ok"
- [ ] Нет ошибок в логах

### Frontend
- [ ] Открыл https://твой-frontend.vercel.app/
- [ ] Интерфейс загрузился
- [ ] Переключение языка работает
- [ ] Селектор моделей виден
- [ ] Отправил тестовое сообщение
- [ ] Получил ответ от AI
- [ ] Нет ошибки "api-inference.huggingface.co"
- [ ] Режим кодинга работает
- [ ] Режим свободы мыслей работает

## 🔄 Автоматический деплой

### Git Push
- [ ] Настроен автодеплой на Render (при push в `main`)
- [ ] Настроен автодеплой на Vercel (при push в `main`)

### Проверка
```bash
git add .
git commit -m "Test auto-deploy"
git push origin main
```

- [ ] Render начал деплой автоматически
- [ ] Vercel начал деплой автоматически
- [ ] Оба деплоя завершились успешно

## 📱 Android APK (опционально)

Если нужно обновить APK:

```bash
cd frontend
npm run build
npx cap sync android
cd android
.\gradlew.bat assembleDebug
```

- [ ] APK собран
- [ ] APK находится в `frontend/android/app/build/outputs/apk/debug/`
- [ ] APK протестирован на устройстве

## 🐛 Troubleshooting

### Backend не отвечает
- [ ] Проверил логи на Render
- [ ] Проверил что сервис запущен
- [ ] Проверил переменные окружения
- [ ] Перезапустил сервис

### Frontend показывает ошибки
- [ ] Очистил кеш браузера (Ctrl+Shift+R)
- [ ] Проверил DevTools → Network
- [ ] Проверил что `VITE_API_URL` правильный
- [ ] Передеплоил на Vercel

### Модели не работают
- [ ] Проверил `HUGGINGFACE_API_KEY` в Render
- [ ] Проверил что используется `router.huggingface.co`
- [ ] Проверил логи backend на ошибки API
- [ ] Проверил квоту на Hugging Face

## ✅ Финальная проверка

- [ ] Backend работает
- [ ] Frontend работает
- [ ] AI отвечает на сообщения
- [ ] Все режимы работают (обычный, кодинг, свобода)
- [ ] Нет ошибок в консоли
- [ ] Автодеплой настроен
- [ ] Документация обновлена

## 🎉 Готово!

Если все пункты отмечены - деплой успешен! 🚀

---

**Последнее обновление**: 19 февраля 2026
**Версия**: 1.0.1
