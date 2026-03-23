from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from models.domain import ApplicationStatus

# --- Base Resume Schemas ---

class BaseResumeBase(BaseModel):
    name: str
    skills: str
    experience_text: str

class BaseResumeCreate(BaseResumeBase):
    pass

class BaseResumeResponse(BaseResumeBase):
    id: int

    class Config:
        from_attributes = True

# --- Tailored Asset Schemas ---

class TailoredAssetBase(BaseModel):
    tailored_resume_json: str
    cover_letter_text: str

class TailoredAssetCreate(TailoredAssetBase):
    pass

class TailoredAssetResponse(TailoredAssetBase):
    id: int
    job_application_id: int

    class Config:
        from_attributes = True

# --- Job Application Schemas ---

class JobApplicationBase(BaseModel):
    company_name: str
    role: str
    jd_text: str
    status: ApplicationStatus = ApplicationStatus.DRAFT

class JobApplicationCreate(JobApplicationBase):
    base_resume_id: int

class JobApplicationResponse(JobApplicationBase):
    id: int
    base_resume_id: int
    date_applied: datetime
    tailored_asset: Optional[TailoredAssetResponse] = None

    class Config:
        from_attributes = True

# --- Generation API Schemas ---

class GenerationRequest(BaseModel):
    base_resume_id: int
    company_name: str
    role: str
    jd_text: str

class AIResumeRewrite(BaseModel):
    missing_keywords: List[str]
    rewritten_summary: str
    rewritten_top_bullets: List[str]
