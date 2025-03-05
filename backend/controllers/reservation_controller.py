from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Optional

from sqlalchemy.orm import Session

from backend.services.reservation_service import ReservationService
from backend.database import get_db

router = APIRouter(prefix="/reservations", tags=["Reservations"])


@router.get("/available-time-slots")
def get_available_time_slots(
        city: str,
        stadium_id: Optional[int] = None,
        date_option: str = "today",
        time_slots: Optional[List[str]] = Query(None)  # User can specify time slots
):
    """
    API endpoint to fetch available time slots for a stadium on a given date.
    If `time_slots` are specified, only those slots will be checked.
    """
    response = ReservationService.get_available_time_slots(city, stadium_id, date_option, time_slots)

    if "message" in response:
        raise HTTPException(status_code=404, detail=response["message"])

    return response


@router.post("/create")
def create_reservation(
        user_id: int,
        stadium_id: int,
        time_slot: str,
        date: str,
        db: Session = Depends(get_db)
):
    """
    API endpoint to create a reservation for a user for a specific stadium and time slot.
    """
    response, status_code = ReservationService.create_reservation(user_id, stadium_id, time_slot, date, db)

    if status_code != 201:
        raise HTTPException(status_code=status_code, detail=response["message"])

    return response

