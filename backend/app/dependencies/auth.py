from fastapi import Depends, HTTPException, Header, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth as firebase_auth
from sqlalchemy.orm import Session
from app.models.user import User
from app.db.session import get_db

security = HTTPBearer()

def get_current_user(
    creds: HTTPAuthorizationCredentials = Depends(security), 
    db: Session = Depends(get_db)
):
    token = creds.credentials

    try:
        decoded = firebase_auth.verify_id_token(token)
    except Exception:
        raise HTTPException(
            status_code=401, 
            detail="Invalid or expired token"
        )

    firebase_uid = decoded["uid"]

    user = db.query(User).filter(
        User.provider_id == firebase_uid, 
        User.auth_provider == "firebase"
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="User not synced in database"
        )

    return user
