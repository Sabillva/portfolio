from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# --- User Schemas ---
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

class UserResponse(UserBase):
    id: int
    role: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# --- Auth Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None

# --- Stadium Owner Application Schemas ---
class OwnerApplicationCreate(BaseModel):
    email: EmailStr
    stadium_name: str
    location: str
    contact_number: str
    other_details: Optional[str] = None

class OwnerApplicationResponse(BaseModel):
    id: int
    email: EmailStr
    stadium_name: str
    location: str
    contact_number: str
    other_details: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
