import os
from pathlib import Path
from uuid import uuid4, UUID
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.document import Document
from app.models.user import User
from app.schemas.document_schema import DocumentCreate
from app.enums.document_status import DocumentStatus
from app.enums.document_source import DocumentSource
from app.services.doc_chunk_service import process_document_chunks
from app.services.storage_service import delete_object


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

def create_document(
    db: Session,
    data: DocumentCreate,
    user: User,
) -> Document:
    document = Document(
        user_id=user.id,
        title=data.title,
        mime_type=data.mime_type,
        byte_size=data.byte_size,
        storage_uri=data.storage_uri,
        source=DocumentSource.UPLOAD,
        status=DocumentStatus.PROCESSING,
    )
    db.add(document)
    db.commit()
    db.refresh(document)
    return document

def process_document(db: Session, document: Document) -> Document:
    try:
        process_document_chunks(db=db, document=document)

        document.status = DocumentStatus.READY
        db.commit()
        db.refresh(document)
        return document

    except HTTPException as exc:
        db.rollback()
        document.status = DocumentStatus.FAILED
        db.commit()
        raise exc

    except Exception:
        db.rollback()
        document.status = DocumentStatus.FAILED
        db.commit()
        raise HTTPException(
            status_code=500,
            detail="Failed to process document. Please try again later.",
        )


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