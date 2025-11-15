from pydantic import BaseModel

class AdminResetRequest(BaseModel):
    admin_password: str