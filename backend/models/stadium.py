from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from backend.database import Base


class Stadium(Base):
    __tablename__ = "stadiums"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    location = Column(String)
    description = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # Stadium owner

    # Reverse relationship: One stadium can have many tournaments
    tournaments = relationship("Tournament", back_populates="stadium", cascade="all, delete")
    posts = relationship("Post", back_populates="stadium", cascade="all, delete")
    owner = relationship("AppUser", back_populates="stadiums")
