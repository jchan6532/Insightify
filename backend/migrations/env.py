# migrations/env.py
from logging.config import fileConfig
import os, sys
from alembic import context
from sqlalchemy import pool
from sqlalchemy.engine import create_engine
from dotenv import load_dotenv

# Ensure backend root on sys.path
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

# Project imports
from app.core.config import get_settings
from app.db.base import Base  # Base.metadata must include all models
import app.models

# Alembic config & logging
config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Load env + settings
load_dotenv()
settings = get_settings()

# Use SQLAlchemy URL from settings (overrides alembic.ini)
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

# IMPORTANT: this is what autogenerate inspects
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations without an Engine (emit SQL only)."""
    context.configure(
        url=settings.DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations with a live connection."""
    engine = create_engine(settings.DATABASE_URL, poolclass=pool.NullPool)
    with engine.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
