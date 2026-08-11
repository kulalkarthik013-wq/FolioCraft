from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies import get_current_user
from app.models.user import User

from app.schemas.certification import (
    CertificationCreate,
    CertificationUpdate,
    CertificationRead,
)

from app.services.certification_service import (
    create_certification,
    get_certifications,
    get_certification,
    update_certification,
    delete_certification,
)

router = APIRouter(
    prefix="/certifications",
    tags=["Certifications"],
)


@router.post("/", response_model=CertificationRead)
def create(
    certification: CertificationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return create_certification(
        db,
        current_user.id,
        certification,
    )


@router.get("/", response_model=list[CertificationRead])
def read_all(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_certifications(db, current_user.id)


@router.get("/{certification_id}", response_model=CertificationRead)
def read_one(
    certification_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_certification(
        db,
        current_user.id,
        certification_id,
    )


@router.put("/{certification_id}", response_model=CertificationRead)
def update(
    certification_id: int,
    certification: CertificationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return update_certification(
        db,
        current_user.id,
        certification_id,
        certification,
    )


@router.delete("/{certification_id}")
def delete(
    certification_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return delete_certification(
        db,
        current_user.id,
        certification_id,
    )