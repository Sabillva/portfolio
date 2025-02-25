from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship

from backend.database import Base


class AppUser(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(255))
    role = Column(String(50), default="user")
    is_owner = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    stadiums = relationship("Stadium", back_populates="owner", cascade="all, delete")
    posts = relationship("Post", back_populates="user", cascade="all, delete")
    comments = relationship("Comment", back_populates="user", cascade="all, delete")
    likes = relationship("Like", back_populates="user", cascade="all, delete")
