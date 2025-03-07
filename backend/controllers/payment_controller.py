import stripe
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from backend.auth.dependencies import get_current_user
from backend.database import get_db
from backend.models.models import Stadium, AppUser
from backend.models.schemas import PaymentIntentRequest

router = APIRouter(prefix="/payment", tags=["Payments"])

@router.post("/create-payment-intent")
def create_payment_intent(payment_data: PaymentIntentRequest, db: Session = Depends(get_db), current_user: AppUser = Depends(get_current_user)):
    try:
        stadium = db.query(Stadium).filter(Stadium.id == payment_data.stadium_id).first()
        if not stadium:
            raise HTTPException(status_code=404, detail="Stadium not found.")

        # Convert the price to cents (Stripe expects amounts in cents)
        amount = int(stadium.price * 100)

        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency=payment_data.currency,
            payment_method_types=["card"],
            metadata={
                "user_id": current_user.id,
                "stadium_id": payment_data.stadium_id
            }
        )
        return {"client_secret": intent.client_secret}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
