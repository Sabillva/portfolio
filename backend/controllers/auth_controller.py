from fastapi import APIRouter, Depends, HTTPException, status, Security, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session


from backend.auth.dependencies import get_current_user
from backend.database import get_db
from backend.models.models import AppUser
from backend.models.schemas import UserCreate, UserResponse, Token, StadiumApplication
from backend.services.auth_service import AuthService
from typing import Dict

router = APIRouter(prefix="/auth", tags=["Authentication"])

#It's memory that I store applications from users who want to be authenticated as owner.
pending_applications: Dict[str, StadiumApplication] = {}


@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    return AuthService.create_user(db, user)


@router.post("/login")
def login(response: Response, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = AuthService.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = AuthService.create_token(user)

    response.set_cookie(
        key="access_token",
        value=f"Bearer {token.access_token}",
        httponly=True,  # Prevent client-side script access to the cookie
        max_age=1800,  # Cookie expiration time in seconds (30 minutes)
        samesite="lax",  # Helps prevent CSRF attacks
        secure=False,  # after implementing https make it true
    )

    return {"message": "Login successful"}

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(key="access_token")
    return {"message": "Logged out successfully"}

@router.post("/apply-owner")
def apply_for_owner(application: StadiumApplication):
    pending_applications[application.email] = application
    return {"message": "Your application is under review"}



@router.get("/pending-owners", dependencies=[Depends(get_current_user)])
def get_pending_owners(current_user: AppUser = Security(get_current_user, scopes=["admin"])):
    return list(pending_applications.values())  # Return a list of applications


@router.post("/approve-owner/{email}")
def approve_owner(email: str, db: Session = Depends(get_db),
                  current_user: AppUser = Security(get_current_user, scopes=["admin"])):
    try:
        with db.begin():
            application = pending_applications.get(email)
            if not application:
                raise HTTPException(status_code=404, detail="Application not found")

            user = db.query(AppUser).filter(AppUser.email == email).first()
            if not user:
                raise HTTPException(status_code=404, detail="User not found")

            user.role = "owner"

            del pending_applications[email]

            return {"message": "User approved as stadium owner", "application": application}

    except Exception as e:
        print(f"Error approving owner: {e}")
        raise HTTPException(status_code=500, detail="Error approving owner")



@router.post("/reject-owner/{email}")
def reject_owner(email: str, current_user: AppUser = Security(get_current_user, scopes=["admin"])):
    if email in pending_applications:
        del pending_applications[email]
    return {"message": "Application rejected"}
