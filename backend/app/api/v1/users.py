from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/", response_model=list[schemas.UserRead], dependencies=[Depends(deps.get_current_active_superuser)])
def read_users(db: Session = Depends(deps.get_db_session)) -> list[schemas.UserRead]:
    return list(crud.user.get_multi(db))


@router.post(
    "/",
    response_model=schemas.UserRead,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(deps.get_current_active_superuser)],
)
def create_user(*, db: Session = Depends(deps.get_db_session), user_in: schemas.UserCreate) -> schemas.UserRead:
    existing_user = crud.user.get_by_email(db, email=user_in.email)
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    return crud.user.create(db, obj_in=user_in)


@router.get("/me", response_model=schemas.UserRead)
def read_user_me(current_user: models.User = Depends(deps.get_current_active_user)) -> models.User:
    return current_user


@router.get(
    "/{user_id}",
    response_model=schemas.UserRead,
    dependencies=[Depends(deps.get_current_active_superuser)],
)
def read_user(*, user_id: int, db: Session = Depends(deps.get_db_session)) -> schemas.UserRead:
    user = crud.user.get(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


@router.put(
    "/{user_id}",
    response_model=schemas.UserRead,
    dependencies=[Depends(deps.get_current_active_superuser)],
)
def update_user(*, user_id: int, user_in: schemas.UserUpdate, db: Session = Depends(deps.get_db_session)) -> schemas.UserRead:
    user = crud.user.get(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return crud.user.update(db, db_obj=user, obj_in=user_in)


@router.delete(
    "/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(deps.get_current_active_superuser)],
)
def delete_user(*, user_id: int, db: Session = Depends(deps.get_db_session)) -> None:
    user = crud.user.get(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    crud.user.remove(db, id=user_id)
