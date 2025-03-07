from datetime import datetime
from typing import Optional

from fastapi import UploadFile
from pydantic import BaseModel, EmailStr


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
    created_at: datetime
    updated_at: datetime


class OwnerApproval(BaseModel):
    email: EmailStr
    approved: bool
    message: Optional[str] = None


# --- Stadium Schemas ---
class StadiumResponse(BaseModel):
    id: int
    stadium_name: str
    location: str
    created_at: datetime
    updated_at: datetime


# --- Tournament Schemas ---
class TournamentBase(BaseModel):
    description: str
    approximate_time: datetime
    stadium_id: int  # Single stadium ID (one-to-many relationship)


class TournamentUpdate(BaseModel):
    description: Optional[str] = None
    approximate_time: Optional[datetime] = None
    stadium_id: Optional[int] = None  # Allow updating the stadium ID


class TournamentResponse(TournamentBase):
    id: int
    user_id: int
    stadium: StadiumResponse  # Include full stadium details
    is_approved: bool
    created_at: datetime
    updated_at: datetime


# --- Post Schemas ---
class PostBase(BaseModel):
    caption: str
    description: Optional[str] = None
    stadium_id: int  # Single stadium ID (one-to-many relationship)


class PostCreate(PostBase):
    pass


class PostUpdate(BaseModel):
    caption: Optional[str] = None
    description: Optional[str] = None
    stadium_id: Optional[int] = None  # Allow updating the stadium ID


class PostResponse(PostBase):
    id: int
    user_id: int
    image_url: str  # Path to the uploaded image
    stadium: StadiumResponse  # Include full stadium details
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # Enable ORM mode


# --- Comment Schemas ---
class CommentCreate(BaseModel):
    message: str
    post_id: int


class CommentUpdate(BaseModel):
    message: Optional[str] = None


class CommentResponse(BaseModel):
    id: int
    message: str
    user_id: int
    post_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# --- Comment Schemas ---
class LikeResponse(BaseModel):
    id: int
    post_id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class LikeStatus(BaseModel):
    liked: bool
