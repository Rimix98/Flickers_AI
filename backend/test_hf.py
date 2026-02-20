import httpx
import asyncio
import os
from dotenv import load_dotenv

load_dotenv()

async def test_hf():
    API_KEY = os.getenv("HUGGINGFACE_API_KEY")
    print(f"API Key: {API_KEY[:20]}...")
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            response = await client.post(
                "https://router.huggingface.co/v1/chat/completions",
                json={
                    "model": "meta-llama/Llama-3.2-1B-Instruct",
                    "messages": [
                        {"role": "user", "content": "Привет! Как дела?"}
                    ],
                    "max_tokens": 50,
                    "stream": False
                },
                headers={
                    "Authorization": f"Bearer {API_KEY}",
                    "Content-Type": "application/json"
                }
            )
            print(f"Status: {response.status_code}")
            print(f"Response: {response.text[:500]}")
        except Exception as e:
            print(f"Error: {e}")

asyncio.run(test_hf())
