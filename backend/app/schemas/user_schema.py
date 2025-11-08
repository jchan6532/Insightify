from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr

class UserOut(BaseModel):
    id: int
    email: EmailStr

    class Config:
        from_attributes = True
