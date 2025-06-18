from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
import crud, schemas
from database import get_db
from pydantic import BaseModel

router = APIRouter()



@router.post("/login")
def login(data: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = crud.login(db, data.username, data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Thông tin đăng nhập không đúng")
    
    return {
        "username": user.Username,
        "role": "user"
    }
