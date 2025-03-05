from datetime import timedelta
from sqlalchemy.orm import Session
from typing import Optional

from dotenv import load_dotenv
import os

from backend.auth.utils import verify_password, get_password_hash, create_access_token
from backend.models.models import Applicant, AppUser, Stadium
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
        applicant = db.query(Applicant).filter(
            Applicant.email == user.email, Applicant.status == "approved"
        ).first()

        hashed_password = get_password_hash(user.password)

        new_user = AppUser(
            username=user.username,
            email=user.email,
            hashed_password=hashed_password,
            role="owner" if applicant else "user"
        )
        db.add(new_user)
        db.commit()

        # If there's an approved application, insert into stadiums
        if applicant:
            stadium = Stadium(
                owner_id=new_user.id,
                email=applicant.email,
                stadium_name=applicant.stadium_name,
                location=applicant.location,
                latitude=applicant.latitude,
                longitude=applicant.longitude,
                contact_number=applicant.contact_number,
                website=applicant.website,
                pitch_type=applicant.pitch_type,
                pitch_dimensions=applicant.pitch_dimensions,
                number_of_pitches=applicant.number_of_pitches,
                lighting=applicant.lighting,
                indoor_outdoor=applicant.indoor_outdoor,
                fencing=applicant.fencing,
                changing_rooms=applicant.changing_rooms,
                showers=applicant.showers,
                parking=applicant.parking,
                seating_area=applicant.seating_area,
                equipment_rental=applicant.equipment_rental,
                opening_hours=applicant.opening_hours,
                pricing=applicant.pricing,
                cafe=applicant.cafe,
                pitch_photos=applicant.pitch_photos,
                other_details=applicant.other_details
            )
            db.add(stadium)
            db.delete(applicant)
            db.commit()

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return new_user

    @staticmethod
    def create_token(user: AppUser) -> Token:
        access_token_expires = timedelta(minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30)))
        access_token = create_access_token(
            data={"sub": user.username, "role": user.role},
            expires_delta=access_token_expires
        )
        return Token(access_token=access_token, token_type="bearer")
