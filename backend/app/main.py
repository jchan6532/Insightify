from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from contextlib import asynccontextmanager

from app.core.firebase import *
from app.api.routes_auth import router as auth_router
from app.api.routes_users import router as users_router
from app.api.routes_documents import router as document_router
from app.api.routes_admin import router as admin_router
from app.api.route_queries import router as query_router
from app.api.routes_websockets import router as websocket_router
from app.websockets.document.updates import redis_updates_listener
from app.core.config import get_settings

settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    asyncio.create_task(redis_updates_listener())
    yield

app = FastAPI(
    title="Insightify API",
    version="1.0.0",
    description="Backend for Insightify API.",
    lifespan=lifespan
)

# Allow Vite dev origins
origins = [
    "http://localhost:5173",
    settings.FE_BASE_URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include routers
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(document_router)
app.include_router(admin_router)
app.include_router(query_router)
app.include_router(websocket_router)


@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/")
def health():
    return "default"