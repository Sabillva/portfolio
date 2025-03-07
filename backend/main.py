import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database import Base, engine
from controllers.auth_controller import router as auth_router
from controllers.tournament_controller import router as tournament_router
from controllers.post_controller import router as post_router
from controllers.comment_controller import router as comment_router
from controllers.like_controller import router as like_controller

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(tournament_router)
app.include_router(post_router)
app.include_router(comment_router)
app.include_router(like_controller)
@app.get("/")
async def root():
    return {"message": "Hello, world!"}


uvicorn.run(app)
