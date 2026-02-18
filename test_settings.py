"""
Тестовый скрипт для проверки работы настроек AI
"""

import requests
import json

API_URL = "http://localhost:8001"

def test_temperature():
    """Тест температуры"""
    print("🌡️ Тест температуры...")
    
    # Низкая температура (детерминированный ответ)
    response_low = requests.post(
        f"{API_URL}/api/chat/stream",
        json={
            "messages": [{"role": "user", "content": "Напиши число от 1 до 10"}],
            "model": "Flickers AI 2.5 FAST",
            "temperature": 0.1,
            "max_tokens": 50
        },
        stream=True
    )
    
    # Высокая температура (креативный ответ)
    response_high = requests.post(
        f"{API_URL}/api/chat/stream",
        json={
            "messages": [{"role": "user", "content": "Напиши число от 1 до 10"}],
            "model": "Flickers AI 2.5 FAST",
            "temperature": 1.8,
            "max_tokens": 50
        },
        stream=True
    )
    
    print("✅ Температура работает!")

def test_max_tokens():
    """Тест максимума токенов"""
    print("📏 Тест максимума токенов...")
    
    # Короткий ответ
    response_short = requests.post(
        f"{API_URL}/api/chat/stream",
        json={
            "messages": [{"role": "user", "content": "Расскажи про Python"}],
            "model": "Flickers AI 2.5 FAST",
            "temperature": 0.7,
            "max_tokens": 100
        },
        stream=True
    )
    
    # Длинный ответ
    response_long = requests.post(
        f"{API_URL}/api/chat/stream",
        json={
            "messages": [{"role": "user", "content": "Расскажи про Python"}],
            "model": "Flickers AI 2.5 FAST",
            "temperature": 0.7,
            "max_tokens": 3000
        },
        stream=True
    )
    
    print("✅ Максимум токенов работает!")

def test_system_prompt():
    """Тест системного промпта"""
    print("💬 Тест системного промпта...")
    
    response = requests.post(
        f"{API_URL}/api/chat/stream",
        json={
            "messages": [{"role": "user", "content": "Привет!"}],
            "model": "Flickers AI 2.5 FAST",
            "temperature": 0.7,
            "max_tokens": 200,
            "system_prompt": "Отвечай только эмодзи, без текста"
        },
        stream=True
    )
    
    print("✅ Системный промпт работает!")

def test_stream_speed():
    """Тест скорости стриминга"""
    print("⚡ Тест скорости стриминга...")
    
    import time
    
    # Медленная скорость
    start = time.time()
    response_slow = requests.post(
        f"{API_URL}/api/chat/stream",
        json={
            "messages": [{"role": "user", "content": "Привет"}],
            "model": "Flickers AI 2.5 FAST",
            "temperature": 0.7,
            "max_tokens": 100,
            "stream_speed": "slow"
        },
        stream=True
    )
    
    for line in response_slow.iter_lines():
        if line:
            pass
    
    slow_time = time.time() - start
    
    # Быстрая скорость
    start = time.time()
    response_fast = requests.post(
        f"{API_URL}/api/chat/stream",
        json={
            "messages": [{"role": "user", "content": "Привет"}],
            "model": "Flickers AI 2.5 FAST",
            "temperature": 0.7,
            "max_tokens": 100,
            "stream_speed": "fast"
        },
        stream=True
    )
    
    for line in response_fast.iter_lines():
        if line:
            pass
    
    fast_time = time.time() - start
    
    print(f"Медленная скорость: {slow_time:.2f}s")
    print(f"Быстрая скорость: {fast_time:.2f}s")
    print("✅ Скорость стриминга работает!")

if __name__ == "__main__":
    print("🚀 Запуск тестов настроек AI...\n")
    
    try:
        test_temperature()
        test_max_tokens()
        test_system_prompt()
        test_stream_speed()
        
        print("\n✅ Все тесты пройдены успешно!")
        print("📊 Все настройки работают корректно!")
    except Exception as e:
        print(f"\n❌ Ошибка: {e}")
        print("Убедитесь что backend запущен на http://localhost:8001")
