from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter(
    prefix="/customers", 
    tags=["Customers"]
)
@router.post("/", status_code=status.HTTP_201_CREATED)
def create_customer(customer: schemas.CustomerCreate, db: Session = Depends(get_db)):
    new_customer = models.Customer_Data(
        Renter_name=customer.renter_name,
        CCCD=customer.cccd,
        Vehicle_name=customer.vehicle_name,
        License_plate=customer.license_plate,
        Phone=customer.phone,
        Start_day=customer.start_day,
        Return_day=customer.return_day,
        Rental_type=customer.rental_type,
        Cost=str(customer.cost),
        Payment_status=customer.payment_status,
        Status=customer.status,
    )
    db.add(new_customer)
    db.commit()
    return {
        "message": "Customer created successfully!"
    }
@router.get("/", response_model=list[schemas.CustomerOut])
def get_all_customers(db: Session = Depends(get_db)):
    customers = db.query(models.Customer_Data).all()
    return customers