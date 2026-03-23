from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from core.database import get_db
from models.domain import BaseResume, JobApplication, TailoredAsset
from schemas.api_models import (
    BaseResumeCreate, BaseResumeResponse,
    JobApplicationCreate, JobApplicationResponse
)

router = APIRouter(prefix="/api/cv", tags=["CV Manager"])

@router.post("/resumes", response_model=BaseResumeResponse)
def create_base_resume(resume: BaseResumeCreate, db: Session = Depends(get_db)):
    db_resume = BaseResume(**resume.model_dump())
    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)
    return db_resume

@router.get("/resumes", response_model=List[BaseResumeResponse])
def get_base_resumes(db: Session = Depends(get_db)):
    return db.query(BaseResume).all()

@router.post("/applications", response_model=JobApplicationResponse)
def create_job_application(application: JobApplicationCreate, db: Session = Depends(get_db)):
    # Check if base resume exists
    db_resume = db.query(BaseResume).filter(BaseResume.id == application.base_resume_id).first()
    if not db_resume:
        raise HTTPException(status_code=404, detail="Base resume not found")
        
    db_app = JobApplication(**application.model_dump())
    db.add(db_app)
    db.commit()
    db.refresh(db_app)
    return db_app

@router.get("/applications", response_model=List[JobApplicationResponse])
def get_job_applications(db: Session = Depends(get_db)):
    return db.query(JobApplication).all()

@router.get("/applications/{app_id}", response_model=JobApplicationResponse)
def get_job_application(app_id: int, db: Session = Depends(get_db)):
    app = db.query(JobApplication).filter(JobApplication.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return app
