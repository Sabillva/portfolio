# model

from datetime import datetime
from sqlalchemy import Column, Integer, String, JSON, DateTime, Boolean

from backend.database import Base


class Tournament(Base):
    __tablename__ = "tournaments"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True)
    description = Column(String)
    places = Column(JSON)  # List of places as JSON
    approximate_time = Column(DateTime)
    is_approved = Column(Boolean, default=True) # Change it to default false and allow only admin to make it true
    created_at = Column(DateTime, default=datetime.utcnow)
