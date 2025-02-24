from fastapi import APIRouter, Depends, Security
from sqlalchemy.orm import Session

from backend.auth.dependencies import get_current_user
from backend.database import get_db
from backend.models import schemas
from backend.models.models import AppUser
from backend.services import tournament_service

router = APIRouter(prefix="/tournaments", tags=["Tournament"])


@router.get("/get", dependencies=[Depends(get_current_user)])
def get_all_tournaments(db: Session = Depends(get_db)):
    return tournament_service.all_tournaments(db)


@router.post("/create", response_model=schemas.TournamentResponse)
def create_tournament(tournament: schemas.TournamentCreate, db: Session = Depends(get_db),
                      current_user: AppUser = Depends(get_current_user)):
    return tournament_service.create_tournament(db=db, tournament=tournament, current_user=current_user)


@router.put("/change/{tournament_id}", response_model=schemas.TournamentResponse)
def update_tournament(tournament_id: int, tournament_update: schemas.TournamentUpdate, db: Session = Depends(get_db),
                      current_user: AppUser = Depends(get_current_user)):
    return tournament_service.change_tournament(tournament_id=tournament_id, tournament_update=tournament_update, db=db,
                                                current_user=current_user)


@router.delete("/delete/{tournament_id}", response_model=schemas.TournamentResponse)
def delete_tournament(tournament_id: int, db: Session = Depends(get_db),
                      current_user: AppUser = Depends(get_current_user)):
    return tournament_service.delete_tournament(tournament_id=tournament_id, db=db, current_user=current_user)


@router.post("/owner/approve/{tournament_id}", response_model=schemas.TournamentResponse)
def approve_tournament(
        tournament_id: int,
        approve: bool,
        db: Session = Depends(get_db),
        current_user: AppUser = Security(get_current_user, scopes=["owner"])
):
    return tournament_service.approve_tournament(
        tournament_id=tournament_id,
        db=db,
        approve=approve,
        current_user=current_user  # Pass the current user
    )
