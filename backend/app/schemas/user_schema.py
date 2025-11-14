from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    name: str | None = None

class UserOut(BaseModel):
    id: int
    email: EmailStr
    name: str | None
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True
