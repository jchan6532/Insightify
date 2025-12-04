from redis import Redis
from rq import Worker, Queue, Connection
from app.core.config import get_settings

settings = get_settings()

listen = ["documents"]
redis_conn = Redis.from_url(settings.REDIS_URL)

if __name__ == "__main__":
    with Connection(redis_conn):
        worker = Worker([Queue(name) for name in listen])
        worker.work()