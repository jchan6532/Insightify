from __future__ import annotations
from uuid import uuid4, UUID
from datetime import datetime

from sqlalchemy import (
    BigInteger,
    DateTime,
    ForeignKey,
    String,
    func,
    Enum
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.enums.document_status import DocumentStatus
from app.enums.document_mime import DocumentMime
from app.enums.document_source import DocumentSource

class Document(Base):
    __tablename__ = "documents"

    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
        nullable=False
    )
    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True,
        nullable=False        
    )

    title: Mapped[str | None] = mapped_column(
        String(512),
        nullable=True
    )
    mime_type: Mapped[DocumentMime] = mapped_column(
        String(255),
        nullable=False,
    )
    byte_size: Mapped[int | None] = mapped_column(
        BigInteger,
        nullable=True
    )
    storage_uri: Mapped[str] = mapped_column(
        String(1024),
        nullable=False
    )
    source : Mapped[DocumentSource] = mapped_column(
        Enum(
            DocumentSource, 
            name="documentsource", 
            values_callable=lambda e: [item.value for item in e], 
            create_type=False
        ),
        default=DocumentSource.UPLOAD,
        nullable=False
    )
    status: Mapped[DocumentStatus] = mapped_column(
        Enum(
            DocumentStatus,
            name="documentstatus",
            values_callable=lambda e: [item.value for item in e],
            create_type=False
        ),
        default=DocumentStatus.PENDING,
        nullable=False
    )
    checksum: Mapped[str | None] = mapped_column(
        String(64),
        index=True,
        nullable=True
    )

    # Timestamps
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
    user: Mapped["User"] = relationship(back_populates="documents")

    chunks: Mapped[list["DocChunk"]] = relationship(
        back_populates="document",
        cascade="all, delete-orphan",
    )