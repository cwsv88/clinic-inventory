from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from .supplier import SupplierReadMinimal


class InventoryItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    quantity: int
    unit_price: Optional[float] = None
    clinic_id: int
    supplier_id: Optional[int] = None


class InventoryItemCreate(InventoryItemBase):
    pass


class InventoryItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    quantity: Optional[int] = None
    unit_price: Optional[float] = None
    supplier_id: Optional[int] = None


class InventoryItemRead(InventoryItemBase):
    id: int
    created_at: datetime
    supplier: Optional[SupplierReadMinimal] = None

    model_config = {
        "from_attributes": True,
    }


class InventoryItemReadMinimal(BaseModel):
    id: int
    name: str
    quantity: int

    model_config = {
        "from_attributes": True,
    }
