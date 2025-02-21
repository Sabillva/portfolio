from pydantic import BaseModel, EmailStr
from typing import Optional, List
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
class StadiumApplication(BaseModel):
    email: EmailStr
    stadium_name: str
    location: str
    contact_number: str
    other_details: Optional[str] = None

class StadiumApplicationResponse(BaseModel):
    email: str
    stadium_name: str
    location: str
    contact_number: str
    other_details: Optional[str] = None
    status: str

class OwnerApproval(BaseModel):
    email: EmailStr
    approved: bool
    message: Optional[str] = None

# --- Tournament Schemas ---
class TournamentBase(BaseModel):
    description: str
    places: List[str]
    approximate_time: datetime

class TournamentCreate(TournamentBase):
    username: str

class TournamentResponse(TournamentBase):
    id: int
    username: str
    created_at: datetime
    is_approved: bool

    class Config:
        orm_mode = True
