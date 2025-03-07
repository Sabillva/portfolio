import os

import stripe
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from flask.cli import load_dotenv

from controllers.auth_controller import router as auth_router
from controllers.reservation_controller import router as reservation_router
from backend.database import Base_Model, engine

Base_Model.metadata.create_all(bind=engine)

load_dotenv()

stripe.api_key = os.getenv("stripe.api_key")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(reservation_router)

@app.get("/")
async def root():
    return {"message": "Hello, world!"}


uvicorn.run(app)
