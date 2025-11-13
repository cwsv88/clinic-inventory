from typing import List

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.inventory_item import InventoryItem
from app.schemas.inventory_item import InventoryItemCreate, InventoryItemUpdate


class CRUDInventoryItem(CRUDBase[InventoryItem, InventoryItemCreate, InventoryItemUpdate]):
    def get_by_clinic(self, db: Session, clinic_id: int) -> List[InventoryItem]:
        return db.query(self.model).filter(self.model.clinic_id == clinic_id).all()


inventory_item = CRUDInventoryItem(InventoryItem)
