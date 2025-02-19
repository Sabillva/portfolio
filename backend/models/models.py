from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime, Boolean, Enum
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

class Applicant(Base):
    __tablename__ = "applicants"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, index=True)
    stadium_name = Column(String(100), nullable=False)
    location = Column(String(100), nullable=False)
    contact_number = Column(String(100), nullable=False)
    other_details = Column(String(100), nullable=True)
    status = Column(Enum("pending", "approved", name="application_status"), default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

