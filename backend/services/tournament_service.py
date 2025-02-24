from datetime import datetime, timedelta

from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload

from backend.models import schemas
from backend.models.models import AppUser
from backend.models.stadium import Stadium
from backend.models.tournament import Tournament


def all_tournaments(db: Session):
    now = datetime.utcnow()
    tournaments = db.query(Tournament).options(joinedload(Tournament.stadium)).filter(
        Tournament.is_approved == True,
        Tournament.approximate_time >= now
    ).all()
    return tournaments


def create_tournament(db: Session, tournament: schemas.TournamentCreate, current_user: AppUser):
    stadium = db.query(Stadium).filter(Stadium.id == tournament.stadium_id).first()
    if not stadium:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Stadium with ID {tournament.stadium_id} does not exist"
        )

    # if tournament.approximate_time is in 2 hour interval with any existing tournament
    new_time = tournament.approximate_time
    start_window = new_time - timedelta(hours=2)
    end_window = new_time + timedelta(hours=2)

    conflict_exists = db.query(Tournament).filter(
        (Tournament.approximate_time >= start_window) &
        (Tournament.approximate_time <= end_window)
    ).first()

    if conflict_exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="There's already a tournament scheduled within 2 hour of this time"
        )

    db_tournament = Tournament(
        user_id=current_user.id,
        stadium_id=tournament.stadium_id,
        description=tournament.description,
        approximate_time=new_time,
        is_approved=False,
    )

    db.add(db_tournament)
    db.commit()
    db.refresh(db_tournament)
    return db_tournament


def change_tournament(tournament_id, tournament_update, db, current_user):
    # Fetch the tournament with stadium details
    db_tournament = db.query(Tournament).options(joinedload(Tournament.stadium)).filter(
        Tournament.id == tournament_id).first()
    if db_tournament is None:
        raise HTTPException(status_code=404, detail="Tournament not found")

    # Check that the current user is the one who created the tournament
    if current_user.id != db_tournament.user_id:
        raise HTTPException(
            status_code=403,
            detail="You are not authorized to modify this tournament."
        )

    # Validate approximate_time (if provided)
    if tournament_update.approximate_time and tournament_update.approximate_time < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="approximate_time must be in the future"
        )

    # Check for time conflicts in the same stadium
    if tournament_update.approximate_time:
        new_time = tournament_update.approximate_time
        start_window = new_time - timedelta(hours=2)
        end_window = new_time + timedelta(hours=2)

        # Use the updated stadium_id if provided, otherwise use the existing one
        stadium_id = tournament_update.stadium_id if tournament_update.stadium_id else db_tournament.stadium_id

        conflict_exists = db.query(Tournament).filter(
            Tournament.stadium_id == stadium_id,  # Check for the same stadium
            Tournament.approximate_time.between(start_window, end_window),
            Tournament.id != tournament_id  # Exclude current tournament
        ).first()

        if conflict_exists:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="There's already a tournament scheduled in this stadium within 2 hours of this time"
            )

    # Update the tournament details
    if tournament_update.description:
        db_tournament.description = tournament_update.description
    if tournament_update.approximate_time:
        db_tournament.approximate_time = tournament_update.approximate_time

    # Update stadium_id if provided
    if tournament_update.stadium_id:
        # Check if the new stadium exists
        stadium = db.query(Stadium).filter(Stadium.id == tournament_update.stadium_id).first()
        if not stadium:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Stadium with ID {tournament_update.stadium_id} does not exist"
            )
        db_tournament.stadium_id = tournament_update.stadium_id

    db.commit()
    db.refresh(db_tournament)

    return db_tournament


def delete_tournament(tournament_id, db, current_user):
    db_tournament = db.query(Tournament).filter(Tournament.id == tournament_id).first()
    if not db_tournament:
        raise HTTPException(status_code=404, detail="Tournament not found")

    # Verify that the current user is the one who created the tournament
    if current_user.id != db_tournament.user_id:
        raise HTTPException(
            status_code=403,
            detail="You are not authorized to delete this tournament."
        )

    db.delete(db_tournament)
    db.commit()

    return db_tournament  # Return the deleted tournament object


#  allow only stadium owners to be able to change is_approve
def approve_tournament(tournament_id, db, approve, current_user):
    # Fetch the tournament
    db_tournament = db.query(Tournament).filter(Tournament.id == tournament_id).first()

    if not db_tournament:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tournament not found"
        )

    # Fetch the stadium associated with the tournament
    stadium = db.query(Stadium).filter(Stadium.id == db_tournament.stadium_id).first()
    if not stadium:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Stadium not found"
        )

    # Check if the current user is the owner of the stadium
    if stadium.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to approve tournaments for this stadium"
        )

    # Approve or reject the tournament
    db_tournament.is_approved = approve
    db.commit()
    db.refresh(db_tournament)

    return db_tournament
