import os
import shutil
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, Header
from sqlalchemy.orm import Session
from pypdf import PdfReader
from jose import jwt, JWTError

from app.database.database import get_db
from app.models import User, Resume, Project, Skill, Experience, Education, Certification
from app.services.ai_service import analyze_resume

router = APIRouter(prefix="/api/resume", tags=["Resume"])

SECRET_KEY = "84627574b7a1af72194a0d2fbc3d52be24a0eba4313053196e9c43a44d28ba20"
ALGORITHM = "HS256"

def get_current_user_id(authorization: str = Header(None), db: Session = Depends(get_db)) -> int:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authentication token")
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if not username:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        
        # Look up user by username (matching what auth.py encodes into 'sub')
        user = db.query(User).filter(User.username == username).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user.id
    except (JWTError, TypeError, ValueError):
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    user_id = get_current_user_id(authorization, db)

    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        reader = PdfReader(temp_path)
        raw_text = ""
        for page in reader.pages:
            text = page.extract_text()
            if text:
                raw_text += text + "\n"
    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        raise HTTPException(status_code=400, detail=f"Failed to read PDF: {str(e)}")
    
    if os.path.exists(temp_path):
        os.remove(temp_path)

    if not raw_text.strip():
        raise HTTPException(status_code=400, detail="The PDF file is empty or unreadable.")

    # 1. Call Gemini AI Service to parse resume into structured JSON
    try:
        structured_data = analyze_resume(raw_text)
    except Exception as e:
        print("❌ UPLOAD ERROR TRACEBACK:")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

    # 2. Save/Update parsed data into the SQLite Database
    try:
        db_resume = db.query(Resume).filter(Resume.user_id == user_id).first()
        if not db_resume:
            db_resume = Resume(
                user_id=user_id,
                name=structured_data.get("name", ""),
                title=structured_data.get("title", ""),
                email=structured_data.get("email", ""),
                phone=structured_data.get("phone", ""),
                linkedin=structured_data.get("linkedin", ""),
                github=structured_data.get("github", ""),
                portfolio=structured_data.get("portfolio", ""),
                summary=structured_data.get("summary", "")
            )
            db.add(db_resume)
        else:
            db_resume.name = structured_data.get("name", "")
            db_resume.title = structured_data.get("title", "")
            db_resume.email = structured_data.get("email", "")
            db_resume.phone = structured_data.get("phone", "")
            db_resume.linkedin = structured_data.get("linkedin", "")
            db_resume.github = structured_data.get("github", "")
            db_resume.portfolio = structured_data.get("portfolio", "")
            db_resume.summary = structured_data.get("summary", "")

        # Clear old relational items for this user to replace with fresh parsed data
        db.query(Skill).filter(Skill.user_id == user_id).delete()
        db.query(Project).filter(Project.user_id == user_id).delete()
        db.query(Experience).filter(Experience.user_id == user_id).delete()
        db.query(Education).filter(Education.user_id == user_id).delete()
        db.query(Certification).filter(Certification.user_id == user_id).delete()

        # Add Skills
        for skill_name in structured_data.get("skills", []):
            db.add(Skill(user_id=user_id, name=skill_name))

        # Add Projects
        for proj in structured_data.get("projects", []):
            db.add(Project(user_id=user_id, title=proj.get("title", ""), description=proj.get("description", "")))

        # Add Experiences
        for exp in structured_data.get("experiences", []):
            db.add(Experience(user_id=user_id, company=exp.get("company", ""), role=exp.get("role", ""), duration=exp.get("duration", "")))

        # Add Education
        for edu in structured_data.get("education", []):
            db.add(Education(user_id=user_id, institution=edu.get("institution", ""), degree=edu.get("degree", ""), year=edu.get("year", "")))

        # Add Certifications
        for cert in structured_data.get("certifications", []):
            db.add(Certification(user_id=user_id, name=cert.get("title", "")))

        db.commit()
    except Exception as db_err:
        db.rollback()
        print("❌ DATABASE SAVE ERROR:", db_err)
        raise HTTPException(status_code=500, detail="Failed to save parsed resume to database.")

    return structured_data