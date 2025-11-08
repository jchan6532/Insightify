from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass


# Import models so Alembic sees them
from app.models.user import User  # noqa
# from app.models.post import Post  # noqa