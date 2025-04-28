# routers/car.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import models, schemas, crud
from database import get_db

router = APIRouter(
    prefix="/car",
    tags=["Car"]
)

@router.post("/add")
def add_car_data(car_data: schemas.CarDataCreate, db: Session = Depends(get_db)):
    db_car_data = crud.create_car_data(db, car_data)
    return db_car_data
