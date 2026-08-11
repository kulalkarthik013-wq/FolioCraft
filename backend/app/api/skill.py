from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies import get_current_user
from app.models.user import User

from app.schemas.skill import SkillCreate, SkillUpdate, SkillRead
from app.services.skill_service import (
    create_skill,
    get_skills,
    get_skill,
    update_skill,
    delete_skill,
)

router = APIRouter(
    prefix="/skills",
    tags=["Skills"],
)


@router.post("/", response_model=SkillRead)
def create(
    skill: SkillCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return create_skill(db, current_user.id, skill)


@router.get("/", response_model=list[SkillRead])
def read_all(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_skills(db, current_user.id)


@router.get("/{skill_id}", response_model=SkillRead)
def read_one(
    skill_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_skill(db, current_user.id, skill_id)


@router.put("/{skill_id}", response_model=SkillRead)
def update(
    skill_id: int,
    skill: SkillUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return update_skill(db, current_user.id, skill_id, skill)


@router.delete("/{skill_id}")
def delete(
    skill_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return delete_skill(db, current_user.id, skill_id)