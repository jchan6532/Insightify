from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.user_schema import UserCreate, UserOut
from app.services.user_service import create_user, get_users, check_user_exists

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/", response_model=list[UserOut], status_code=status.HTTP_200_OK)
def list_users(db: Session = Depends(get_db)):
    return get_users(db)

@router.post("/", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_user_endpoint(data: UserCreate, db: Session = Depends(get_db)):

    if check_user_exists(db, data.email):
        raise HTTPException(status_code=400, detail="Email already exists")
    
    return create_user(db, data)