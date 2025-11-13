from app.crud.base import CRUDBase
from app.models.clinic import Clinic
from app.schemas.clinic import ClinicCreate, ClinicUpdate


class CRUDClinic(CRUDBase[Clinic, ClinicCreate, ClinicUpdate]):
    pass


clinic = CRUDClinic(Clinic)
