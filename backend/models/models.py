from datetime import datetime

from sqlalchemy import Text, Float, JSON, ForeignKey, Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship

from backend.database import Base, Base_Model


class AppUser(Base_Model):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(255))
    role = Column(String(50), default="user")
    # created_at = Column(DateTime, default=datetime.utcnow)
    # updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    stadiums = relationship("Stadium", back_populates="owner", cascade="all, delete")
    posts = relationship("Post", back_populates="user", cascade="all, delete")
    comments = relationship("Comment", back_populates="user", cascade="all, delete")
    likes = relationship("Like", back_populates="user", cascade="all, delete")


class Stadium(Base_Model):
    __tablename__ = "stadiums"

    id = Column(Integer, primary_key=True, index=True)
    stadium_name = Column(String(100), unique=True, nullable=False)

    location = Column(Text, nullable=False)  # Increased for better address support
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

    description = Column(Text, nullable=True)
    contact_number = Column(String(20), nullable=False)
    website = Column(String(255), nullable=True)

    pitch_type = Column(String(50), nullable=False)
    pitch_dimensions = Column(String(50), nullable=True)
    number_of_pitches = Column(Integer, nullable=True)
    lighting = Column(Boolean, nullable=False)
    indoor_outdoor = Column(String(20), nullable=False)
    fencing = Column(Boolean, nullable=False)
    changing_rooms = Column(Boolean, nullable=False)
    showers = Column(Boolean, nullable=False)
    parking = Column(Boolean, nullable=False)
    seating_area = Column(Boolean, nullable=False)
    equipment_rental = Column(String(255), nullable=True)
    opening_hours = Column(Text, nullable=False)
    pricing = Column(Text, nullable=False)
    cafe = Column(Boolean, nullable=False)
    pitch_photos = Column(JSON, nullable=True)  # List of image URLs
    other_details = Column(Text, nullable=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # Stadium owner

    # Reverse relationship: One stadium can have many tournaments
    tournaments = relationship("Tournament", back_populates="stadium", cascade="all, delete")
    posts = relationship("Post", back_populates="stadium", cascade="all, delete")
    owner = relationship("AppUser", back_populates="stadiums")

class Tournament(Base_Model):
    __tablename__ = "tournaments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # Linked to Users
    stadium_id = Column(Integer, ForeignKey("stadiums.id"), nullable=False)  # Each tournament happens in ONE stadium
    description = Column(Text, nullable=True)
    approximate_time = Column(DateTime)
    is_approved = Column(Boolean, default=False)
    # created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship to Stadium (One tournament belongs to one stadium)
    stadium = relationship("Stadium", back_populates="tournaments")

class Post(Base_Model):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    photo_path = Column(String(255), nullable=False)    # Path to the uploaded photo
    stadium_id = Column(Integer, ForeignKey("stadiums.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Relationships
    stadium = relationship("Stadium", back_populates="posts")
    user = relationship("AppUser", back_populates="posts")
    comments = relationship("Comment", back_populates="post", cascade="all, delete")
    likes = relationship("Like", back_populates="post", cascade="all, delete")

class Comment(Base_Model):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    message = Column(Text, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False)

    # Relationships
    user = relationship("AppUser", back_populates="comments")
    post = relationship("Post", back_populates="comments")

class Like(Base_Model):
    __tablename__ = "likes"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Relationships
    user = relationship("AppUser", back_populates="likes")
    post = relationship("Post", back_populates="likes")





