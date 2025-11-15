from functools import lru_cache
from pydantic import BaseModel
import os

class Settings(BaseModel):
    DATABASE_URL: str = "sqlite:///./app.db"

@lru_cache
def get_settings() -> Settings:
    return Settings(DATABASE_URL=os.getenv("DATABASE_URL", "sqlite:///./app.db"))
