from pydantic import BaseModel, EmailStr
from datetime import datetime
from uuid import UUID

from app.enums.document_status import DocumentStatus
from backend.app.enums.document_mime import DocumentMime

class DocumentBase(BaseModel):
    user_id: UUID
    title: str | None
    mime_type: DocumentMime
    byte_size: int | None = None
    storage_uri: str
    source: str
    checksum: str | None = None

class DocumentCreate(DocumentBase):
    pass

class DocumentOut(DocumentBase):
    id: str
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class DocumentListOut(BaseModel):
    documents: list[DocumentOut]
    total: int

class DocumentTitleUpdate(BaseModel):
    user_id: UUID
    title: str

