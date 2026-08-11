from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies import get_current_user
from app.models.user import User

from app.schemas.experience import (
    ExperienceCreate,
    ExperienceUpdate,
    ExperienceRead,
)

from app.services.experience_service import (
    create_experience,
    get_experiences,
    get_experience,
    update_experience,
    delete_experience,
)

router = APIRouter(
    prefix="/experience",
    tags=["Experience"],
)


@router.post("/", response_model=ExperienceRead)
def create(
    experience: ExperienceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return create_experience(db, current_user.id, experience)


@router.get("/", response_model=list[ExperienceRead])
def read_all(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_experiences(db, current_user.id)


@router.get("/{experience_id}", response_model=ExperienceRead)
def read_one(
    experience_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_experience(
        db,
        current_user.id,
        experience_id,
    )


@router.put("/{experience_id}", response_model=ExperienceRead)
def update(
    experience_id: int,
    experience: ExperienceUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return update_experience(
        db,
        current_user.id,
        experience_id,
        experience,
    )


@router.delete("/{experience_id}")
def delete(
    experience_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return delete_experience(
        db,
        current_user.id,
        experience_id,
    )