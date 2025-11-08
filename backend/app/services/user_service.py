from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user_schema import UserCreate

def create_user(db: Session, data: UserCreate) -> User:
    u = User(email=data.email)
    db.add(u)
    db.commit()
    db.refresh(u)
    return u

def get_users(db: Session) -> list[User]:
    return db.query(User).order_by(User.id.desc()).all()
