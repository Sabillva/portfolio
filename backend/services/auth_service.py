from datetime import timedelta
from sqlalchemy.orm import Session
from typing import Optional

from dotenv import load_dotenv
import os

from backend.auth.utils import verify_password, get_password_hash, create_access_token
from backend.models.models import Applicant, AppUser
from backend.models.schemas import UserCreate, Token

load_dotenv()


class AuthService:
    @staticmethod
    def authenticate_user(db: Session, username: str, password: str) -> Optional[AppUser]:
        user = db.query(AppUser).filter(AppUser.username == username).first()
        if not user or not verify_password(password, user.hashed_password):
            return None
        return user

    @staticmethod
    def create_user(db: Session, user: UserCreate) -> AppUser:
        approved_application = db.query(Applicant).filter(
            Applicant.email == user.email, Applicant.status == "approved"
        ).first()

        # Hash password
        hashed_password = get_password_hash(user.password)

        if approved_application:
            role = "owner"  # Auto-assign as owner
            db.delete(approved_application)  # Remove from applicants table
        else:
            role = "user"

        new_user = AppUser(
            username=user.username,
            email=user.email,
            hashed_password=hashed_password,
            role=role
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return new_user

        hashed_password = get_password_hash(user.password)
        db_user = AppUser(
            username=user.username,
            email=str(user.email),
            hashed_password=hashed_password
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    def create_token(user: AppUser) -> Token:
        access_token_expires = timedelta(minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30)))
        access_token = create_access_token(
            data={"sub": user.username, "role": user.role},
            expires_delta=access_token_expires
        )
        return Token(access_token=access_token, token_type="bearer")
