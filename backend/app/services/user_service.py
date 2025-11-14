from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user_schema import UserCreate

def create_user(db: Session, data: UserCreate) -> User:
    user = User(email=data.email, name=data.name)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_users(db: Session) -> list[User]:
    return db.query(User).order_by(User.id.desc()).all()

def check_user_exists(db: Session, email: str) -> bool:
    return db.query(User).filter(User.email == email).first() is not None
