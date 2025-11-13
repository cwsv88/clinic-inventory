from typing import Optional

from pydantic import BaseModel, EmailStr


class SupplierBase(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None


class SupplierCreate(SupplierBase):
    pass


class SupplierUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None


class SupplierRead(SupplierBase):
    id: int

    model_config = {
        "from_attributes": True,
    }


class SupplierReadMinimal(SupplierBase):
    id: int

    model_config = {
        "from_attributes": True,
    }
