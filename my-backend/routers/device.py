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

