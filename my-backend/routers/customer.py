from fastapi import APIRouter, Depends, status,HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas,crud

router = APIRouter(
    prefix="/customers", 
    tags=["Customers"]
)
@router.post("/", status_code=status.HTTP_201_CREATED)
def create_customer(customer: schemas.CustomerCreate, db: Session = Depends(get_db)):
    new_customer = crud.create_customer(db, customer)
    return {"message": " Thêm khách thuê thành công!"}
@router.get("/", response_model=list[schemas.CustomerOut])
def get_all_customers(db: Session = Depends(get_db)):
    customers = db.query(models.Customer_Data).all()
    return customers

@router.put("/update/{customer_id}")
def update_customer(customer_id: int, data: schemas.CustomerUpdate, db: Session = Depends(get_db)):
    updated = crud.update_customer(db, customer_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Khách hàng không tồn tại")
    return {"message": "Cập nhật thành công", "updated_data": updated}

@router.delete("/delete/{customer_id}")
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    return crud.delete_customer(db, customer_id)

@router.post("/archive/{customer_id}")
def archive_customer(customer_id: int, db: Session = Depends(get_db)):
    try:
        return crud.archive_customer(db, customer_id)
    except Exception as e:
        print("Lỗi:", e)
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/history")
def get_rental_history(db: Session = Depends(get_db)):
    return crud.get_all_rental_history(db)