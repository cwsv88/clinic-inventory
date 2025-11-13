from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app import crud, schemas
from app.api import deps

router = APIRouter(prefix="/inventory", tags=["inventory"])


@router.get("/", response_model=list[schemas.InventoryItemRead])
def read_inventory_items(
    clinic_id: int | None = Query(default=None),
    db: Session = Depends(deps.get_db_session),
    _: schemas.UserRead = Depends(deps.get_current_active_user),
) -> list[schemas.InventoryItemRead]:
    if clinic_id is not None:
        return list(crud.inventory_item.get_by_clinic(db, clinic_id=clinic_id))
    return list(crud.inventory_item.get_multi(db))


@router.post(
    "/",
    response_model=schemas.InventoryItemRead,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(deps.get_current_active_superuser)],
)
def create_inventory_item(
    *, db: Session = Depends(deps.get_db_session), item_in: schemas.InventoryItemCreate
) -> schemas.InventoryItemRead:
    clinic = crud.clinic.get(db, item_in.clinic_id)
    if not clinic:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Clinic does not exist")
    if item_in.supplier_id:
        supplier = crud.supplier.get(db, item_in.supplier_id)
        if not supplier:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Supplier does not exist")
    return crud.inventory_item.create(db, obj_in=item_in)


@router.put(
    "/{item_id}",
    response_model=schemas.InventoryItemRead,
    dependencies=[Depends(deps.get_current_active_superuser)],
)
def update_inventory_item(
    *,
    item_id: int,
    item_in: schemas.InventoryItemUpdate,
    db: Session = Depends(deps.get_db_session),
) -> schemas.InventoryItemRead:
    item = crud.inventory_item.get(db, item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inventory item not found")
    if item_in.supplier_id:
        supplier = crud.supplier.get(db, item_in.supplier_id)
        if not supplier:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Supplier does not exist")
    return crud.inventory_item.update(db, db_obj=item, obj_in=item_in)


@router.delete(
    "/{item_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(deps.get_current_active_superuser)],
)
def delete_inventory_item(*, item_id: int, db: Session = Depends(deps.get_db_session)) -> None:
    item = crud.inventory_item.get(db, item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inventory item not found")
    crud.inventory_item.remove(db, id=item_id)
