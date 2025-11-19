from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.user_schema import (
    UserCreate, UserOut,
    UserListOut
)
from app.services.user_service import (
    create_user, 
    get_users,
    check_user_exists_by_email
)
from app.schemas.document_schema import DocumentListOut
from app.services.document_service import get_documents

router = APIRouter(
    prefix="/users", 
    tags=["users"]
)

@router.get("/", response_model=UserListOut, status_code=status.HTTP_200_OK)
def list_users(
    skip: int = 0, 
    limit: int | None = None, 
    db: Session = Depends(get_db)
):
    users = get_users(
        db, 
        skip=skip, 
        limit=limit
    )

    return UserListOut(users=users, total=len(users))

@router.get("/{user_id}/documents", response_model=DocumentListOut, status_code=status.HTTP_200_OK)
def list_documents_of_user(
    user_id: UUID,
    status_filter: str | None = None,
    mime_type_filter: str | None = None,   
    skip: int = 0, 
    limit: int | None = None, 
    db: Session = Depends(get_db)
):
    documents = get_documents(
        db, 
        user_id=user_id,
        skip=skip, 
        limit=limit, 
        status=status_filter, 
        mime_type=mime_type_filter
    )

    return DocumentListOut(documents=documents, total=len(documents))


@router.post("/", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_user_endpoint(
    data: UserCreate, 
    db: Session = Depends(get_db)
):

    if check_user_exists_by_email(db, data.email):
        raise HTTPException(status_code=400, detail="Email already exists")
    
    return create_user(db, data)