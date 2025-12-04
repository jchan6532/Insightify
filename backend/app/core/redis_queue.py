from redis import Redis
from rq import Queue
from app.core.config import get_settings

settings = get_settings()

redis_conn = Redis.from_url(settings.REDIS_URL)
doc_queue = Queue("documents", connection=redis_conn)