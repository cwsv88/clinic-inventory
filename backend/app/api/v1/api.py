from fastapi import APIRouter

from app.api.v1 import clinics, inventory, users

api_router = APIRouter()
api_router.include_router(clinics.router)
api_router.include_router(inventory.router)
api_router.include_router(users.router)
