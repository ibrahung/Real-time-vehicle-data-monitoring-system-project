# routers/device.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import models, schemas, crud
from database import get_db

router = APIRouter(
    prefix="/device",
    tags=["Device"]
)

@router.post("/", status_code=status.HTTP_201_CREATED)
def add_device(device: schemas.DeviceDataCreate, db: Session = Depends(get_db)):
    db_device = crud.create_device(db, device)
    return db_device

@router.get("/get_device_id/{license_plate}")
def get_device_id(license_plate: str, db: Session = Depends(get_db)):
    device = crud.get_device_by_license(db, license_plate)
    if device is None:
        raise HTTPException(status_code=404, detail="Device not found")
    return {"ID_ESP32": device.ID_ESP32}
