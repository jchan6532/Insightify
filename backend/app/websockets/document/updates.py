import asyncio
import json
from redis.asyncio import Redis

from app.core.config import get_settings
from app.websockets.document.manager import manager

settings = get_settings()
redis = Redis.from_url(settings.REDIS_URL, decode_responses=True)

async def redis_updates_listener():
    pubsub = redis.pubsub()
    await pubsub.subscribe("document_updates")

    while True:
        message = await pubsub.get_message(
            ignore_subscribe_messages=True, 
            timeout=1.0
        )

        if not message:
            await asyncio.sleep(0.01)
            continue

        if message["type"] == "message":
            data = json.loads(message["data"])            
            await manager.notify(message=data)