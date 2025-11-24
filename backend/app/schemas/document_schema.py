from pydantic import BaseModel, EmailStr
from datetime import datetime
from uuid import UUID

from app.enums.document_status import DocumentStatus
from app.enums.document_mime import DocumentMime

class DocumentBase(BaseModel):
    user_id: UUID
    title: str | None
    mime_type: str
    byte_size: int | None = None
    storage_uri: str
    source: str
    checksum: str | None = None

class DocumentCreate(BaseModel):
    title: str | None = None
    mime_type: str
    storage_uri: str
    byte_size: int | None = None

class DocumentOut(DocumentBase):
    id: UUID
    status: DocumentStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class DocumentListOut(BaseModel):
    documents: list[DocumentOut]
    total: int

class DocumentTitleUpdate(BaseModel):
    title: str




class PresignUploadRequest(BaseModel):
    filename: str
    mime_type: str

class PresignUploadResponse(BaseModel):
    url: str
    key: str