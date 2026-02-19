# 🚀 СРОЧНО: Деплой на Render СЕЙЧАС!

## ⚠️ Проблема
Backend на Render все еще использует старый URL Hugging Face API.
Код уже обновлен в GitHub, но Render нужно передеплоить вручную.

## ✅ Что сделать ПРЯМО СЕЙЧАС (3 минуты)

### Шаг 1: Зайди на Render Dashboard
🔗 https://dashboard.render.com/

### Шаг 2: Найди свой backend сервис
Название: `flickers-ai-backend` (или как ты его назвал)

### Шаг 3: Проверь Environment Variables
1. Нажми на сервис
2. Перейди в **Environment** (левое меню)
3. Проверь что есть переменная:
   - `HUGGINGFACE_API_KEY` = твой ключ от Hugging Face
   
   Если нет - добавь её:
   - Нажми "Add Environment Variable"
   - Key: `HUGGINGFACE_API_KEY`
   - Value: твой ключ с https://huggingface.co/settings/tokens
   - Нажми "Save Changes"

### Шаг 4: Передеплой
1. Перейди в **Manual Deploy** (левое меню)
2. Нажми большую синюю кнопку **"Deploy latest commit"**
3. Дождись завершения (2-3 минуты)

### Шаг 5: Проверь логи
1. Перейди в **Logs** (левое меню)
2. Убедись что нет ошибок
3. Должна быть строка: `Application startup complete`

### Шаг 6: Проверь что работает
Открой в браузере (замени на свой URL):
```
https://твой-backend.onrender.com/
```

Должен вернуть:
```json
{"status":"ok","message":"Flickers AI API","version":"1.0.0"}
```

## 🎯 После деплоя

1. Открой свой frontend на Vercel
2. Отправь тестовое сообщение
3. Должен прийти ответ от AI (без ошибки про api-inference)

## 🆘 Если не работает

### Ошибка в логах: "HUGGINGFACE_API_KEY not found"
✅ Решение: Добавь переменную окружения (Шаг 3)

### Ошибка: "Unauthorized" или 401
✅ Решение: Проверь что ключ Hugging Face правильный и активный

### Деплой не запускается
✅ Решение: 
1. Проверь что репозиторий подключен к Render
2. Попробуй "Clear build cache & deploy"

## 📝 Что изменилось в коде

```python
# Старый URL (НЕ РАБОТАЕТ)
API_BASE_URL = "https://api-inference.huggingface.co/v1/chat/completions"

# Новый URL (РАБОТАЕТ)
API_BASE_URL = "https://router.huggingface.co/v1/chat/completions"
```

Код уже обновлен в GitHub, просто нужно передеплоить!

---

**Дата**: 19 февраля 2026
**Статус**: КРИТИЧНО - без этого приложение не работает!
**Время на исправление**: 3 минуты
