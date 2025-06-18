# routers/car.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import crud
from database import get_db

router = APIRouter(
    prefix="/car",
    tags=["Car"]
)


@router.get("/speed-data-by-plate")
def get_speed_by_plate(plate: str, db: Session = Depends(get_db)):
    return crud.get_speed_data_by_plate(db, plate)
    
@router.get("/list")
def get_car_list(db: Session = Depends(get_db)):
    return crud.get_car_list(db)

@router.get("/online-list")
def get_online_cars(db: Session = Depends(get_db)):
    return crud.get_online_cars(db)
    
@router.get("/error-list")
def get_error_list(db: Session = Depends(get_db)):
    return crud.get_error_list(db)
    
    