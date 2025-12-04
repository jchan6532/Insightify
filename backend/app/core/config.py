from functools import lru_cache
from pydantic import BaseModel
import os

class Settings(BaseModel):
    ENVIRONMENT: str
    DB_TYPE: str
    DATABASE_URL: str

    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str

    PGADMIN_EMAIL: str
    PGADMIN_PASSWORD: str

    ADMIN_RESET_PASSWORD: str
    DOC_CHUNK_SIZE: int

    OPEN_AI_API_KEY: str

    AWS_REGION: str
    AWS_ACCESS_KEY_ID: str
    AWS_SECRET_ACCESS_KEY: str
    AWS_S3_BUCKET_NAME: str

    REDIS_URL: str

    def validate(self):
        """Validate required environment variables."""
        required = [
            "ENVIRONMENT",
            "DATABASE_URL",
            "POSTGRES_USER",
            "POSTGRES_PASSWORD",
            "POSTGRES_DB",
            "AWS_REGION",
            "AWS_ACCESS_KEY_ID",
            "AWS_SECRET_ACCESS_KEY",
            "AWS_S3_BUCKET_NAME",
            "REDIS_URL"
        ]

        for field in required:
            value = getattr(self, field)
            if not value:
                raise RuntimeError(f"Missing required environment variable: {field}")


@lru_cache
def get_settings() -> Settings:
    settings = Settings(
        ENVIRONMENT=os.getenv("ENVIRONMENT", "development"),
        DB_TYPE=os.getenv("DB_TYPE", "postgresql"),
        DATABASE_URL=os.getenv("DATABASE_URL", "sqlite:///./app.db"),

        POSTGRES_USER=os.getenv("POSTGRES_USER", ""),
        POSTGRES_PASSWORD=os.getenv("POSTGRES_PASSWORD", ""),
        POSTGRES_DB=os.getenv("POSTGRES_DB", ""),

        PGADMIN_EMAIL=os.getenv("PGADMIN_EMAIL", ""),
        PGADMIN_PASSWORD=os.getenv("PGADMIN_PASSWORD", ""),

        ADMIN_RESET_PASSWORD=os.getenv("ADMIN_RESET_PASSWORD", ""),
        DOC_CHUNK_SIZE=int(os.getenv("DOC_CHUNK_SIZE", 800)),

        OPEN_AI_API_KEY=os.getenv("OPEN_AI_API_KEY", ""),

        AWS_REGION=os.getenv("AWS_REGION", ""),
        AWS_ACCESS_KEY_ID=os.getenv("AWS_ACCESS_KEY_ID", ""),
        AWS_SECRET_ACCESS_KEY=os.getenv("AWS_SECRET_ACCESS_KEY", ""),
        AWS_S3_BUCKET_NAME=os.getenv("AWS_S3_BUCKET_NAME", ""),

        REDIS_URL=os.getenv("REDIS_URL", "redis://localhost:6379/0")
    )

    settings.validate()

    return settings
