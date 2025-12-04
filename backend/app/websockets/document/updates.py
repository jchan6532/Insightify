import asyncio
import json
from redis import Redis

from app.core.config import get_settings
from app.websockets.document.manager import manager

settings = get_settings()
redis = Redis.from_url(settings.REDIS_URL)

async def redis_updates_listener():
    pubsub = redis.pubsub()
    pubsub.subscribe("document_updates")

    loop = asyncio.get_running_loop()

    while True:
        message = await loop.run_in_executor(
            None, 
            pubsub.get_message, 
            True, 
            1.0
        )
        if not message:
            await asyncio.sleep(0.01)
            continue

        if message["type"] == "message":
            data = json.loads(message["data"])
            doc_id = data["doc_id"]
            
            await manager.notify(message=data)