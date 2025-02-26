import os

from dotenv import load_dotenv
from sqlalchemy import create_engine, Column, DateTime
from datetime import datetime
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

# Database connection
database_url = os.getenv("DATABASE_URL")
engine = create_engine(database_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Define Base
Base = declarative_base()

# Base model with timestamps
class Base_Model(Base):
    __abstract__ = True  # This ensures it's not treated as a table
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Create tables in the database
Base.metadata.create_all(bind=engine)

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
