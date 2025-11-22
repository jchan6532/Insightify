# app/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from firebase_admin import auth as fb_auth

from app.db.session import get_db
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["auth"])
security = HTTPBearer()

@router.post("/sync")
def sync_user(
    creds: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    token = creds.credentials

    try:
        decoded = fb_auth.verify_id_token(token)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Firebase ID token",
        )

    uid = decoded["uid"]
    email = decoded.get("email")
    name = decoded.get("name")

    user = (
        db.query(User)
        .filter(
            User.provider_id == uid,
            User.auth_provider == "firebase",
        )
        .first()
    )

    if not user:
        user = User(
            provider_id=uid,
            auth_provider="firebase",
            email=email,
            name=name,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return {
        "id": str(user.id),
        "email": user.email,
        "name": user.name,
        "role": user.role,
    }
