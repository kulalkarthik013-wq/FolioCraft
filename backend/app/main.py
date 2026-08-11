from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Corrected import (removed the duplicate .database)
from app.database import Base, engine
import app.models  # Ensures all ORM models are registered before table creation
from app.api.auth import router as auth_router
from app.api.resume import router as resume_router
from app.api.portfolio import router as portfolio_router
from app.api.project import router as project_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="PortfolioAI API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(resume_router)
app.include_router(portfolio_router)
app.include_router(project_router)

@app.get("/")
def home():
    return {"message": "PortfolioAI API Running 🚀"}