from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.database import engine, Base
from core.config import settings
from routers import cv_manager, generation

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.project_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "project": settings.project_name}

# Include routers
app.include_router(cv_manager.router)
app.include_router(generation.router)
