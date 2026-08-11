from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from app.database.database import get_db
from app.models.user import User
from app.models.portfolio import Skill, Project, Experience, Education, Certification
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/portfolio", tags=["Portfolio"])

# --- Pydantic Schemas ---
class SkillSchema(BaseModel):
    id: Optional[int] = None
    name: str

    class Config:
        from_attributes = True

class ProjectSchema(BaseModel):
    id: Optional[int] = None
    title: str
    description: str
    image_url: Optional[str] = None
    link: Optional[str] = None

    class Config:
        from_attributes = True

class ExperienceSchema(BaseModel):
    id: Optional[int] = None
    company: str
    role: str
    duration: str

    class Config:
        from_attributes = True

class EducationSchema(BaseModel):
    id: Optional[int] = None
    institution: str
    degree: str
    year: str

    class Config:
        from_attributes = True

class CertificationSchema(BaseModel):
    id: Optional[int] = None
    name: str

    class Config:
        from_attributes = True

class PortfolioData(BaseModel):
    name: str
    username: str
    is_published: bool
    template_theme: str
    skills: List[SkillSchema]
    projects: List[ProjectSchema]
    experiences: List[ExperienceSchema]
    education: List[EducationSchema]
    certifications: List[CertificationSchema]

    class Config:
        from_attributes = True

class SettingsUpdateSchema(BaseModel):
    is_published: Optional[bool] = None
    template_theme: Optional[str] = None

# --- Endpoints ---

@router.get("/public/{username}", response_model=PortfolioData)
def get_public_portfolio(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user or not user.is_published:
        raise HTTPException(status_code=404, detail="Portfolio not found or private")
    
    return {
        "name": user.name,
        "username": user.username,
        "is_published": user.is_published,
        "template_theme": user.template_theme or "cyberpunk",
        "skills": user.skills,
        "projects": user.projects,
        "experiences": user.experiences,
        "education": user.education,
        "certifications": user.certifications
    }

@router.get("/", response_model=PortfolioData)
def get_user_portfolio(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return {
        "name": current_user.name,
        "username": current_user.username,
        "is_published": current_user.is_published,
        "template_theme": current_user.template_theme or "cyberpunk",
        "skills": current_user.skills,
        "projects": current_user.projects,
        "experiences": current_user.experiences,
        "education": current_user.education,
        "certifications": current_user.certifications
    }

@router.patch("/settings")
def update_portfolio_settings(
    settings: SettingsUpdateSchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if settings.is_published is not None:
        current_user.is_published = settings.is_published
    if settings.template_theme is not None:
        current_user.template_theme = settings.template_theme
    
    db.commit()
    db.refresh(current_user)
    return {
        "message": "Settings updated successfully", 
        "is_published": current_user.is_published, 
        "template_theme": current_user.template_theme
    }

@router.post("/projects", response_model=ProjectSchema)
def create_project(
    project: ProjectSchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_proj = Project(
        user_id=current_user.id,
        title=project.title,
        description=project.description,
        image_url=project.image_url,
        link=project.link
    )
    db.add(new_proj)
    db.commit()
    db.refresh(new_proj)
    return new_proj

@router.delete("/projects/{project_id}")
def delete_project(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    proj = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(proj)
    db.commit()
    return {"message": "Project deleted successfully"}