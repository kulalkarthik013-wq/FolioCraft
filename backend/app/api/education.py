from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies import get_current_user
from app.models.user import User

from app.schemas.education import (
    EducationCreate,
    EducationUpdate,
    EducationRead,
)

from app.services.education_service import (
    create_education,
    get_educations,
    get_education,
    update_education,
    delete_education,
)

router = APIRouter(
    prefix="/education",
    tags=["Education"],
)


@router.post("/", response_model=EducationRead)
def create(
    education: EducationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return create_education(db, current_user.id, education)


@router.get("/", response_model=list[EducationRead])
def read_all(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_educations(db, current_user.id)


@router.get("/{education_id}", response_model=EducationRead)
def read_one(
    education_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_education(db, current_user.id, education_id)


@router.put("/{education_id}", response_model=EducationRead)
def update(
    education_id: int,
    education: EducationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return update_education(
        db,
        current_user.id,
        education_id,
        education,
    )


@router.delete("/{education_id}")
def delete(
    education_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return delete_education(
        db,
        current_user.id,
        education_id,
    )