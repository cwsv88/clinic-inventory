from __future__ import annotations

from typing import List

from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Supplier(Base):
    __tablename__ = "suppliers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    phone_number: Mapped[str | None] = mapped_column(String(30), nullable=True)

    inventory_items: Mapped[List["InventoryItem"]] = relationship(
        "InventoryItem", back_populates="supplier"
    )

    def __repr__(self) -> str:  # pragma: no cover - repr for debugging only
        return f"Supplier(id={self.id!r}, name={self.name!r})"
