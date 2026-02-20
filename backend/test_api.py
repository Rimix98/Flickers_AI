import httpx
import asyncio

async def test():
    async with httpx.AsyncClient() as client:
        response = await client.get('http://localhost:8000/')
        print(response.text)

asyncio.run(test())
