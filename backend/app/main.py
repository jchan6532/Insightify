from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes_users import router as users_router
from app.api.routes_documents import router as document_router
from app.api.routes_admin import router as admin_router
from app.api.route_queries import router as query_router

app = FastAPI(
    title="Insightify API",
    version="1.0.0",
    description="Backend for Insightify API."
)


# Allow your Vite dev origins
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include routers
app.include_router(users_router)
app.include_router(document_router)
app.include_router(admin_router)
app.include_router(query_router)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/")
def health():
    return "default"