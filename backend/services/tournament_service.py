from datetime import datetime, timedelta

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from backend.models.tournament import Tournament


def all_tournaments(db: Session):
    # if approximate_time is before from now do not show them
    now = datetime.utcnow()
    return db.query(Tournament).filter(
        Tournament.is_approved == True,
        Tournament.approximate_time >= now
    ).all()


def create_tournament(db, tournament, current_user):
    # if tournament.approximate_time is in 1 hour interval with any existing tournament
    new_time = tournament.approximate_time
    start_window = new_time - timedelta(hours=1)
    end_window = new_time + timedelta(hours=1)

    conflict_exists = db.query(Tournament).filter(
        Tournament.approximate_time.between(start_window, end_window)
    ).first()

    if conflict_exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="There's already a tournament scheduled within 1 hour of this time"
        )

    db_tournament = Tournament(
        username=current_user,
        description=tournament.description,
        places=tournament.places,
        approximate_time=new_time,
        is_approved=False
    )

    db.add(db_tournament)
    db.commit()
    db.refresh(db_tournament)
    return db_tournament


def change_tournament(tournament_id, tournament_update, db, current_user):
    db_tournament = db.query(Tournament).filter(Tournament.id == tournament_id).first()
    if db_tournament is None:
        raise HTTPException(status_code=404, detail="Tournament not found")

    # Check that the current user is the one who created the tournament
    if current_user.username != db_tournament.username:
        raise HTTPException(
            status_code=403,
            detail="You are not authorized to modify this tournament."
        )

    # Check if tournament_update.approximate_time is in 1 hour interval with any existing tournament
    new_time = tournament_update.approximate_time
    start_window = new_time - timedelta(hours=1)
    end_window = new_time + timedelta(hours=1)

    conflict_exists = db.query(Tournament).filter(
        Tournament.approximate_time.between(start_window, end_window),
        Tournament.id != tournament_id  # Exclude current tournament
    ).first()

    if conflict_exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="There's already a tournament scheduled within 1 hour of this time"
        )

    # Update the tournament details
    db_tournament.description = tournament_update.description
    db_tournament.places = tournament_update.places
    db_tournament.approximate_time = tournament_update.approximate_time

    db.commit()
    db.refresh(db_tournament)

    return db_tournament


def delete_tournament(tournament_id, db, current_user):
    db_tournament = db.query(Tournament).filter(Tournament.id == tournament_id).first()
    if not db_tournament:
        raise HTTPException(status_code=404, detail="Tournament not found")

    # Verify that the current user is the one who created the tournament
    if current_user.username != db_tournament.username:
        raise HTTPException(
            status_code=403,
            detail="You are not authorized to delete this tournament."
        )

    db.delete(db_tournament)
    db.commit()

    return {"detail": "Tournament successfully deleted"}

# make only admins be able to change is_approve
def approve_tournament(tournament_id, db, approve):
    db_tournament = db.query(Tournament).filter(Tournament.id == tournament_id).first()

    if not db_tournament:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tournament not found"
        )

    db_tournament.is_approved = approve
    db.commit()
    db.refresh(db_tournament)
    return db_tournament
