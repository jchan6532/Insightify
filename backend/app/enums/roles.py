from enum import Enum

class Roles(str, Enum):
    ADMIN = "admin"
    MEMBER = "member"
    OWNER = "owner"
    FREE = "free"