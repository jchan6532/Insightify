from fastapi import (
    APIRouter, Depends, 
    HTTPException, 
    status, 
    Form, 
    File, 
    UploadFile
)
from uuid import UUID
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.document_schema import (
    DocumentCreate, 
    DocumentOut,
    DocumentTitleUpdate
)
from app.services.document_service import (
    create_document,
    check_document_belongs_to_user,
    get_document_by_id,
    update_document_title,
    delete_document
)
from app.services.user_service import (
    check_user_exists
)
from app.services.doc_chunk_service import process_document_chunks
from app.enums.document_mime import DocumentMime
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/documents", 
    tags=["documents"]
)

@router.get("/{document_id}", response_model=DocumentOut, status_code=status.HTTP_200_OK)
def get_document(
    document_id: UUID,
    current_user: User = Depends(get_current_user),
    db : Session = Depends(get_db)
):
    if not check_document_belongs_to_user(
        db, 
        document_id, 
        current_user.id
    ):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document does not belong to user"
        )

    document = get_document_by_id(db, document_id)
    if document is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    return document

# METADATA VERSION
# @router.post("/", response_model=DocumentOut, status_code=status.HTTP_201_CREATED)
# def create_document_endpoint(
#     data: DocumentCreate, 
#     db: Session = Depends(get_db)
# ):
#     document = create_document(db, data)
#     return document
@router.post("/", response_model=DocumentOut, status_code=status.HTTP_201_CREATED)
def create_document_endpoint(
    title: str | None = Form(...),
    mime_type: str = Form(...),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    exists = check_user_exists(db=db, user_id=current_user.id)
    if not exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user_id: user does not exist",
        )
    
    data = DocumentCreate(
        user_id=current_user.id,
        title=title,
        mime_type=DocumentMime(mime_type)
    )
    
    document = create_document(
        db=db,
        data=data,
        file=file
    )

    process_document_chunks(db=db, document=document)
    
    return document

@router.put("/{document_id}/title", response_model=DocumentOut, status_code=status.HTTP_200_OK)
def update_document_endpoint(
    document_id: UUID,
    data: DocumentTitleUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not check_document_belongs_to_user(
        db, 
        document_id, 
        current_user.id
    ):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document does not belong to user"
        )
    
    document = update_document_title(db, document_id, data.title)
    if document is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    return document

@router.delete("/{document_id}", status_code=status.HTTP_200_OK)
def delete_document_endpoint(
    document_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not check_document_belongs_to_user(
        db, 
        document_id, 
        current_user.id
    ):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document does not belong to user"
        )
    
    success = delete_document(db, document_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    return {"detail": "Document deleted successfully"}