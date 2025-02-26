from sqlalchemy import Column, Integer, String, Boolean, Text, Float, JSON, Enum, ForeignKey
from sqlalchemy.orm import relationship

from backend.database import Base


class Stadium(Base):
    __tablename__ = "stadiums"

    id = Column(Integer, primary_key=True, index=True)
    stadium_name = Column(String, unique=True, nullable=False)

    location = Column(Text, nullable=False)  # Increased for better address support
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

    description = Column(String)
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
