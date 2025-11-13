from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, schemas
from app.api import deps

router = APIRouter(prefix="/clinics", tags=["clinics"])


@router.get("/", response_model=list[schemas.ClinicRead])
def read_clinics(
    db: Session = Depends(deps.get_db_session),
    _: schemas.UserRead = Depends(deps.get_current_active_user),
) -> list[schemas.ClinicRead]:
    return list(crud.clinic.get_multi(db))


@router.post(
    "/",
    response_model=schemas.ClinicRead,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(deps.get_current_active_superuser)],
)
def create_clinic(*, db: Session = Depends(deps.get_db_session), clinic_in: schemas.ClinicCreate) -> schemas.ClinicRead:
    return crud.clinic.create(db, obj_in=clinic_in)


@router.get("/{clinic_id}", response_model=schemas.ClinicRead)
def read_clinic(
    clinic_id: int,
    db: Session = Depends(deps.get_db_session),
    _: schemas.UserRead = Depends(deps.get_current_active_user),
) -> schemas.ClinicRead:
    clinic = crud.clinic.get(db, clinic_id)
    if not clinic:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Clinic not found")
    return clinic


@router.put(
    "/{clinic_id}",
    response_model=schemas.ClinicRead,
    dependencies=[Depends(deps.get_current_active_superuser)],
)
def update_clinic(*, clinic_id: int, clinic_in: schemas.ClinicUpdate, db: Session = Depends(deps.get_db_session)) -> schemas.ClinicRead:
    clinic = crud.clinic.get(db, clinic_id)
    if not clinic:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Clinic not found")
    return crud.clinic.update(db, db_obj=clinic, obj_in=clinic_in)


@router.delete(
    "/{clinic_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(deps.get_current_active_superuser)],
)
def delete_clinic(*, clinic_id: int, db: Session = Depends(deps.get_db_session)) -> None:
    clinic = crud.clinic.get(db, clinic_id)
    if not clinic:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Clinic not found")
    crud.clinic.remove(db, id=clinic_id)
