from sqlalchemy.orm import Session
from app.models.document import Document
from uuid import UUID

from app.schemas.document_schema import DocumentCreate



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

def create_document(db: Session, data: DocumentCreate) -> Document:
    pass

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