from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

from backend.database import Base


class Like(Base):
    __tablename__ = "likes"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Relationships
    user = relationship("AppUser", back_populates="likes")
    post = relationship("Post", back_populates="likes")
