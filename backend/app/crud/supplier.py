from typing import Optional

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.supplier import Supplier
from app.schemas.supplier import SupplierCreate, SupplierUpdate


class CRUDSupplier(CRUDBase[Supplier, SupplierCreate, SupplierUpdate]):
    def get_by_name(self, db: Session, *, name: str) -> Optional[Supplier]:
        return db.query(self.model).filter(self.model.name == name).first()


supplier = CRUDSupplier(Supplier)
