import os
from pathlib import Path
from uuid import uuid4, UUID

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.models.document import Document
from app.schemas.document_schema import DocumentCreate
from app.enums.document_status import DocumentStatus
from app.enums.document_source import DocumentSource


BACKEND_DIR = Path(__file__).resolve().parents[2]
STORAGE_DIR = BACKEND_DIR / "storage"
STORAGE_DIR.mkdir(parents=True, exist_ok=True)



def get_documents(
    db: Session, 
    user_id: UUID, 
    skip: int = 0, 
    limit: int | None = None,
    mime_type: str | None = None,
    status: str | None = None
) -> list[Document]:
    
    query = (
        db.query(Document)
            .filter(Document.user_id == user_id)
    )

    if mime_type is not None:
        query = query.filter(Document.mime_type == mime_type)

    if status is not None:
        query = query.filter(Document.status == status)

    query = (
        query
            .order_by(Document.created_at.desc())
            .offset(skip)
    )

    if limit is not None:
        query = query.limit(limit)

    return query.all()

def check_document_belongs_to_user(
    db: Session,
    document_id: UUID,
    user_id: UUID
) -> bool:
    document = (
        db.query(Document)
            .filter(
                Document.id == document_id,
                Document.user_id == user_id
            )
            .first()
    )

    return document is not None

def get_document_by_id(
    db: Session,
    document_id: UUID,
) -> Document | None:
    document = (
        db.query(Document)
            .filter(Document.id == document_id)
            .first()
    )

    return document

def save_uploaded_file(file: UploadFile, target_path: Path) -> int:
    """Save the uploaded file to disk and return its size in bytes."""
    contents = file.file.read()
    target_path.write_bytes(contents)
    return len(contents)
def create_document(
    db: Session, 
    data: DocumentCreate,
    file: UploadFile
) -> Document:
    
    document = Document(
        user_id=data.user_id,
        title=data.title,
        mime_type=data.mime_type,
        byte_size=None,
        storage_uri="",
        source=DocumentSource.UPLOAD,
        status=DocumentStatus.PENDING,
    )
    db.add(document)
    db.commit()
    db.refresh(document)

    _, ext = os.path.splitext(file.filename)
    ext = ext.lower() or ""

    filename = f"{document.id}{ext}"
    path = STORAGE_DIR / filename

    size_bytes = save_uploaded_file(file, path)

    document.storage_uri = f"storage/{filename}"
    document.byte_size = size_bytes
    db.commit()
    db.refresh(document)

    return document

def update_document_title(
    db: Session,
    document_id: UUID,
    new_title: str
) -> Document | None:
    document = get_document_by_id(db, document_id)
    if document is None:
        return None

    document.title = new_title
    db.commit()
    db.refresh(document)
    return document

def delete_document(
    db: Session,
    document_id: UUID
) -> bool:
    document = get_document_by_id(db, document_id)
    if document is None:
        return False

    db.delete(document)
    db.commit()
    return True