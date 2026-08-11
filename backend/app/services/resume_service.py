import os
import shutil

from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.models.resume import Resume
from app.models.project import Project
from app.models.skill import Skill
from app.models.education import Education
from app.models.experience import Experience
from app.models.certification import Certification

from app.utils.resume_parser import extract_resume_text
from app.services.ai_service import analyze_resume


UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


def to_string(value):
    """
    Convert Gemini output into a SQLite-safe string.
    """
    if value is None:
        return ""

    if isinstance(value, list):
        return ", ".join(str(item) for item in value)

    if isinstance(value, dict):
        return str(value)

    return str(value)


def save_resume(
    db: Session,
    user_id: int,
    file: UploadFile,
):
    try:
        # ==========================================
        # 1. SAVE RESUME FILE
        # ==========================================
        file_path = os.path.join(
            UPLOAD_DIR,
            file.filename,
        )

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        print("FILE SAVED:", file_path)

        # ==========================================
        # 2. EXTRACT RESUME TEXT
        # ==========================================
        extracted_text = extract_resume_text(file_path)

        print("\n========== RESUME TEXT ==========\n")
        print(extracted_text)
        print("\n=================================\n")

        if not extracted_text:
            raise Exception(
                "Could not extract text from resume"
            )

        # ==========================================
        # 3. ANALYZE RESUME
        # ==========================================
        portfolio = analyze_resume(extracted_text)

        print("\n========== AI OUTPUT ==========\n")
        print(portfolio)
        print("\n=================================\n")

        if not isinstance(portfolio, dict):
            raise Exception(
                "Gemini response is not a JSON object"
            )

        # ==========================================
        # 4. SAVE RESUME
        # ==========================================
        resume = Resume(
            filename=file.filename,
            filepath=file_path,
            user_id=user_id,
        )

        db.add(resume)

        # ==========================================
        # 5. SAVE PROJECTS
        # ==========================================
        for item in portfolio.get("projects", []):
            if not isinstance(item, dict):
                continue

            technologies = item.get(
                "technologies",
                item.get("tools", [])
            )

            project = Project(
                name=to_string(
                    item.get(
                        "name",
                        item.get("title", "")
                    )
                ),
                description=to_string(
                    item.get("description", "")
                ),
                technologies=to_string(
                    technologies
                ),
                github=to_string(
                    item.get("github", "")
                ),
                demo=to_string(
                    item.get("demo", "")
                ),
                user_id=user_id,
            )

            db.add(project)

        # ==========================================
        # 6. SAVE SKILLS
        # ==========================================
        for skill in portfolio.get(
            "skills",
            []
        ):
            if isinstance(skill, dict):
                db.add(
                    Skill(
                        name=to_string(
                            skill.get("name", "")
                        ),
                        category=to_string(
                            skill.get(
                                "category",
                                "General"
                            )
                        ),
                        user_id=user_id,
                    )
                )
            else:
                db.add(
                    Skill(
                        name=to_string(skill),
                        category="General",
                        user_id=user_id,
                    )
                )

        # ==========================================
        # 7. SAVE EDUCATION
        # ==========================================
        for edu in portfolio.get(
            "education",
            []
        ):
            if not isinstance(edu, dict):
                continue

            score = edu.get(
                "cgpa",
                edu.get("score", "")
            )

            db.add(
                Education(
                    degree=to_string(
                        edu.get("degree", "")
                    ),
                    institution=to_string(
                        edu.get("institution", "")
                    ),
                    year=to_string(
                        edu.get("year", "")
                    ),
                    cgpa=to_string(
                        score
                    ),
                    user_id=user_id,
                )
            )

        # ==========================================
        # 8. SAVE EXPERIENCE
        # ==========================================
        for exp in portfolio.get(
            "experience",
            []
        ):
            if not isinstance(exp, dict):
                continue

            start_date = to_string(
                exp.get("start_date", "")
            )
            end_date = to_string(
                exp.get("end_date", "")
            )

            if start_date and end_date:
                duration = f"{start_date} - {end_date}"
            else:
                duration = to_string(
                    exp.get("duration", "")
                )

            db.add(
                Experience(
                    company=to_string(
                        exp.get("company", "")
                    ),
                    role=to_string(
                        exp.get("role", "")
                    ),
                    duration=duration,
                    description=to_string(
                        exp.get("description", "")
                    ),
                    user_id=user_id,
                )
            )

        # ==========================================
        # 9. SAVE CERTIFICATIONS
        # ==========================================
        for cert in portfolio.get(
            "certifications",
            []
        ):
            if isinstance(cert, dict):
                db.add(
                    Certification(
                        name=to_string(
                            cert.get("name", "")
                        ),
                        issuer=to_string(
                            cert.get("issuer", "")
                        ),
                        user_id=user_id,
                    )
                )
            elif isinstance(cert, str):
                db.add(
                    Certification(
                        name=cert,
                        issuer="",
                        user_id=user_id,
                    )
                )

        # ==========================================
        # 10. COMMIT EVERYTHING
        # ==========================================
        db.commit()
        db.refresh(resume)

        print("\n========== DATABASE SAVE SUCCESS ==========\n")
        print("Resume ID:", resume.id)
        print("User ID:", user_id)
        print("\n===========================================\n")

        # ==========================================
        # 11. RETURN RESPONSE
        # ==========================================
        return {
            "resume": {
                "id": resume.id,
                "filename": resume.filename,
                "filepath": resume.filepath,
            },
            "portfolio": portfolio,
        }

    except HTTPException:
        db.rollback()
        raise

    except Exception as e:
        db.rollback()
        print("\n========== RESUME ERROR ==========\n")
        print(repr(e))
        print("\n==================================\n")
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )