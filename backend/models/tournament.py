from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from backend.database import Base


class Tournament(Base):
    __tablename__ = "tournaments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # Linked to Users
    stadium_id = Column(Integer, ForeignKey("stadiums.id"), nullable=False)  # Each tournament happens in ONE stadium
    description = Column(String)
    approximate_time = Column(DateTime)
    is_approved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship to Stadium (One tournament belongs to one stadium)
    stadium = relationship("Stadium", back_populates="tournaments")
