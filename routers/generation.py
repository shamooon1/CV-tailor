from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from models.domain import BaseResume, JobApplication, TailoredAsset, ApplicationStatus
from schemas.api_models import GenerationRequest, JobApplicationResponse
from services.ai_service import generate_tailored_resume_data, generate_cover_letter

router = APIRouter(prefix="/api/generation", tags=["Generation"])

@router.post("/generate-application", response_model=JobApplicationResponse)
def generate_application(request: GenerationRequest, db: Session = Depends(get_db)):
    # 1. Fetch Base Resume
    base_resume = db.query(BaseResume).filter(BaseResume.id == request.base_resume_id).first()
    if not base_resume:
        raise HTTPException(status_code=404, detail="Base resume not found")

    # 2. Database creation (Draft status)
    job_app = JobApplication(
        company_name=request.company_name,
        role=request.role,
        jd_text=request.jd_text,
        status=ApplicationStatus.DRAFT,
        base_resume_id=base_resume.id
    )
    db.add(job_app)
    db.commit()
    db.refresh(job_app)

    # 3. AI Generation
    try:
        # Generate Tailored Resume Data
        rewritten_data = generate_tailored_resume_data(
            base_resume_text=base_resume.experience_text,
            jd_text=request.jd_text
        )
        
        # Generate Cover Letter
        cover_letter = generate_cover_letter(
            base_resume_text=base_resume.experience_text,
            jd_text=request.jd_text,
            company_name=request.company_name,
            role=request.role
        )
        
        # 4. Save Tailored Asset
        tailored_asset = TailoredAsset(
            tailored_resume_json=rewritten_data.model_dump_json(),
            cover_letter_text=cover_letter,
            job_application_id=job_app.id
        )
        db.add(tailored_asset)
        db.commit()
        db.refresh(tailored_asset)

    except Exception as e:
        print(f"Generation failed: {e}")
        raise HTTPException(status_code=500, detail="AI Generation failed")

    # Refresh job app to include the tailored asset relationship
    db.refresh(job_app)
    return job_app
