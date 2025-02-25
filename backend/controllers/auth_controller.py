from fastapi import APIRouter, Depends, HTTPException, status, Security
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session


from backend.auth.dependencies import get_current_user
from backend.database import get_db
from backend.models.models import Applicant, AppUser
from backend.models.schemas import UserCreate, UserResponse, Token, OwnerApplicationCreate, OwnerApplicationResponse
from backend.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])



@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    return AuthService.create_user(db, user)


@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = AuthService.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if user.role == "admin":
        return AuthService.create_token(user, unexpiring=True)

    return AuthService.create_token(user)


@router.post("/apply-owner")
def apply_for_owner(
    application: OwnerApplicationCreate,
    db: Session = Depends(get_db),
):
    existing_application = db.query(Applicant).filter(Applicant.email == application.email).first()
    if existing_application:
        raise HTTPException(status_code=400, detail="Application already submitted")

    new_application = Applicant(
        email=application.email,
        stadium_name=application.stadium_name,
        location=application.location,
        contact_number=application.contact_number,
        other_details=application.other_details,
        status="pending"
    )
    db.add(new_application)
    db.commit()
    return {"message": "Your application is under review"}


@router.get("/pending-owners")
def get_pending_owners(
    current_user: AppUser = Security(get_current_user, scopes=["admin"]),
    db: Session = Depends(get_db)
):
    pending_applications = db.query(Applicant).filter(Applicant.status == "pending").all()
    return pending_applications


@router.post("/approve-owner/{email}")
def approve_owner(
    email: str,
    current_user: AppUser = Security(get_current_user, scopes=["admin"]),
    db: Session = Depends(get_db),
):
    application = db.query(Applicant).filter(Applicant.email == email, Applicant.status == "pending").first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found or already processed")


    user = db.query(AppUser).filter(AppUser.email == email).first()
    if user:
        user.role = "owner"

    application.status = "approved"

    db.commit()
    return {"message": "User approved as stadium owner"}



@router.post("/reject-owner/{email}")
def reject_owner(
    email: str,
    current_user: AppUser = Security(get_current_user, scopes=["admin"]),
    db: Session = Depends(get_db),
):
    application = db.query(Applicant).filter(Applicant.email == email).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    db.delete(application)
    db.commit()
    return {"message": "Application rejected"}
