from __future__ import annotations

from datetime import datetime
from uuid import uuid4, UUID
from sqlalchemy import String, DateTime, func, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List

from app.db.base import Base
from app.enums.roles import Roles

class User(Base):
    __tablename__ = "users"

    id: Mapped[UUID] = mapped_column(
        primary_key=True, 
        default=uuid4,
        nullable=False
    )
    email: Mapped[str] = mapped_column(
        String(255), 
        unique=True, 
        index=True,
        nullable=False
    )
    hashed_password: Mapped[str] = mapped_column(
        String(255),
        nullable=True
    )
    name : Mapped[str | None] = mapped_column(
        String(120),
        nullable=True
    )
    
    auth_provider: Mapped[str] = mapped_column(
        String(32), 
        default="password",
        nullable=False
    )
    role: Mapped[Roles] = mapped_column(
        Enum(Roles),
        default=Roles.FREE,
        nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=func.now(),
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=func.now(), 
        onupdate=func.now(),
        nullable=False
    )
    
    # Relationships
    documents: Mapped[List["Document"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan"
    )
    