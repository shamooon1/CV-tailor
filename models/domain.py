from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
import enum
from datetime import datetime
from core.database import Base

class ApplicationStatus(str, enum.Enum):
    DRAFT = "Draft"
    APPLIED = "Applied"
    INTERVIEWING = "Interviewing"
    REJECTED = "Rejected"

class BaseResume(Base):
    __tablename__ = "base_resumes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    skills = Column(Text)
    experience_text = Column(Text)

    applications = relationship("JobApplication", back_populates="base_resume")

class JobApplication(Base):
    __tablename__ = "job_applications"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String, index=True)
    role = Column(String, index=True)
    jd_text = Column(Text)
    date_applied = Column(DateTime, default=datetime.utcnow)
    status = Column(Enum(ApplicationStatus), default=ApplicationStatus.DRAFT)
    
    base_resume_id = Column(Integer, ForeignKey("base_resumes.id"))
    base_resume = relationship("BaseResume", back_populates="applications")

    tailored_asset = relationship("TailoredAsset", back_populates="job_application", uselist=False)

class TailoredAsset(Base):
    __tablename__ = "tailored_assets"

    id = Column(Integer, primary_key=True, index=True)
    tailored_resume_json = Column(Text)
    cover_letter_text = Column(Text)

    job_application_id = Column(Integer, ForeignKey("job_applications.id"), unique=True)
    job_application = relationship("JobApplication", back_populates="tailored_asset")
