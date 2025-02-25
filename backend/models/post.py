from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from backend.database import Base


class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    photo_path = Column(String, nullable=False)  # Path to the uploaded photo
    stadium_id = Column(Integer, ForeignKey("stadiums.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Relationships
    stadium = relationship("Stadium", back_populates="posts")
    user = relationship("AppUser", back_populates="posts")
    comments = relationship("Comment", back_populates="post", cascade="all, delete")
    likes = relationship("Like", back_populates="post", cascade="all, delete")
