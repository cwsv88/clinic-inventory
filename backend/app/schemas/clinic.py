from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field

from .inventory_item import InventoryItemReadMinimal


class ClinicBase(BaseModel):
    name: str
    address: Optional[str] = None
    phone_number: Optional[str] = None


class ClinicCreate(ClinicBase):
    pass


class ClinicUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    phone_number: Optional[str] = None


class ClinicRead(ClinicBase):
    id: int
    created_at: datetime
    inventory_items: List[InventoryItemReadMinimal] = Field(default_factory=list)

    model_config = {
        "from_attributes": True,
    }


class ClinicReadMinimal(ClinicBase):
    id: int

    model_config = {
        "from_attributes": True,
    }
