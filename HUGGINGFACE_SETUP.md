# 🤗 Настройка Hugging Face API

## Почему Hugging Face?

- ✅ **Полностью бесплатно** - нет платных моделей
- ✅ **Без rate limits** - можно использовать сколько угодно
- ✅ **Работает в России** - нет блокировок
- ✅ **Много моделей** - тысячи бесплатных моделей

## 📝 Как получить API ключ

1. Зайди на https://huggingface.co/
2. Нажми "Sign Up" (или "Log In" если уже есть аккаунт)
3. Зарегистрируйся (можно через GitHub)
4. Перейди в Settings → Access Tokens: https://huggingface.co/settings/tokens
5. Нажми "New token"
6. Дай название (например "Flickers AI")
7. Выбери тип: "Read" (достаточно для inference)
8. Нажми "Generate"
9. Скопируй токен (он начинается с `hf_...`)

## 🔧 Настройка в Render

1. Зайди на https://dashboard.render.com/
2. Найди сервис `flickers-ai-backend`
3. Перейди в Environment
4. Удали старую переменную `OPENROUTER_API_KEY` (если есть)
5. Добавь новую переменную:
   - Key: `HUGGINGFACE_API_KEY`
   - Value: твой токен (начинается с `hf_...`)
6. Нажми "Save Changes"
7. Render автоматически перезапустит сервис

## 🚀 Текущие модели

Все модели теперь из Hugging Face:

| Название | Модель | Описание |
|----------|--------|----------|
| Flickers AI 2.0 ULTRA | Llama-3.1-70B-Instruct | Самая мощная (70B параметров) |
| Flickers AI 2.2 ULTRA CODING | Qwen2.5-Coder-32B-Instruct | Специально для кодинга (32B) |
| Flickers AI 2.5 PRO | Llama-3.1-8B-Instruct | Быстрая и качественная (8B) |
| Flickers AI 2.5 FAST | Llama-3.2-3B-Instruct | Быстрая (3B) |
| Flickers AI 2.0 FAST | Llama-3.2-1B-Instruct | Самая быстрая (1B) |

## 💡 Преимущества

### Было (OpenRouter):
- ❌ Rate limits на бесплатных моделях
- ❌ Многие модели недоступны в России
- ❌ Нужно платить за хорошие модели

### Стало (Hugging Face):
- ✅ Нет rate limits
- ✅ Все модели работают в России
- ✅ Полностью бесплатно
- ✅ Тысячи моделей на выбор

## 🔄 Как добавить свою модель

Можешь легко добавить любую модель из Hugging Face:

1. Найди модель на https://huggingface.co/models
2. Убедись что у неё есть "Inference API" (значок ⚡)
3. Скопируй название модели (например `mistralai/Mistral-7B-Instruct-v0.2`)
4. Добавь в `backend/main.py` в `MODEL_MAPPING`:

```python
MODEL_MAPPING = {
    "Твоё название": "organization/model-name",
    # ...
}
```

## 🐛 Troubleshooting

### Ошибка "Model is loading"
- Это нормально! Модель загружается первый раз
- Подожди 30-60 секунд и попробуй снова
- Hugging Face автоматически кеширует модель

### Ошибка "Invalid token"
- Проверь что токен скопирован полностью
- Токен должен начинаться с `hf_`
- Создай новый токен если старый не работает

### Модель не отвечает
- Проверь что модель поддерживает Inference API
- Попробуй другую модель из списка
- Проверь логи на Render Dashboard

## 📚 Полезные ссылки

- Hugging Face Models: https://huggingface.co/models
- Inference API Docs: https://huggingface.co/docs/api-inference/
- Токены: https://huggingface.co/settings/tokens
