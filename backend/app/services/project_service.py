from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models import Project
from app.schemas.project import ProjectCreate, ProjectUpdate


def create_project(db: Session, user_id: int, project: ProjectCreate):
    db_project = Project(
        **project.model_dump(),
        user_id=user_id,
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


def get_projects(db: Session, user_id: int):
    return db.query(Project).filter(Project.user_id == user_id).all()


def get_project(db: Session, user_id: int, project_id: int):
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == user_id,
    ).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    return project


def update_project(
    db: Session,
    user_id: int,
    project_id: int,
    data: ProjectUpdate,
):
    project = get_project(db, user_id, project_id)

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(project, key, value)

    db.commit()
    db.refresh(project)

    return project


def delete_project(
    db: Session,
    user_id: int,
    project_id: int,
):
    project = get_project(db, user_id, project_id)

    db.delete(project)
    db.commit()

    return {"message": "Project deleted"}