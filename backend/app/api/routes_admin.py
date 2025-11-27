from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.admin_schema import AdminResetRequest
from sqlalchemy.orm import Session
import os

from app.services.admin_service import reset_database
from app.db.session import get_db
from app.core.config import get_settings

settings = get_settings()
ADMIN_RESET_PASSWORD = settings.ADMIN_RESET_PASSWORD

router = APIRouter(
    prefix="/admin",
    tags=["admin"]
)

@router.post("/reset-db")
def reset_db_endpoint(
    data: AdminResetRequest,
    db: Session = Depends(get_db)
):

    if data.admin_password != ADMIN_RESET_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid admin password")
    
    reset_database(db)
    return {"detail": "Database cleared"}
