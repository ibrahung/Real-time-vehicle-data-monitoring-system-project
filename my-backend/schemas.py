# schemas.py

from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime

# Schemas cho Device_Data
class DeviceDataCreate(BaseModel):
    device_id: str
    license_plate: str
    install_date: datetime
    username:str
    
    model_config = ConfigDict(from_attributes=True)

# Schemas cho Customer_Data
class CustomerCreate(BaseModel):
    renter_name: str
    cccd: str
    vehicle_name: str
    license_plate: str
    phone: str
    start_day: datetime
    return_day: datetime
    rental_type: str
    cost: str
    payment_status: str
    status: str

class CustomerOut(BaseModel):
    Device_ID: str
    License_plate: str
    Renter_name: str
    Start_day: datetime
    Phone: str
    CCCD: str
    Return_day: datetime
    Rental_type: str
    Cost: str
    Payment_status: str
    Status: str
    Vehicle_name: str

    class Config:
        orm_mode = True 
        
class CustomerUpdate(BaseModel):
    Renter_name: str | None = None
    Phone: str | None = None
    CCCD: str | None = None
    License_plate: str | None = None
    Vehicle_name: str | None = None
    Start_day: str | None = None
    Return_day: str | None = None
    Rental_type: str | None = None
    Status: str | None = None
    Payment_status: str | None = None
    Cost: float | None = None
    
class RentalHistoryCreate(BaseModel):
    Renter_name: str
    CCCD: str
    Vehicle_name: str
    License_plate: str
    Phone: str
    Start_day: datetime
    Return_day: datetime
    Rental_type: str
    Cost: str
    Payment_status: str
    Status: str

# Schemas cho Car_Data
class CarDataCreate(BaseModel):
    Device_ID: str
    TimeStamp: int
    RPM: int
    Speed: int
    Throttle: int
    Brake: int
    Temp: int
    Latitude: float
    Longitude: float
    ERROR: str
    

#Schemas cho User_Data
class LoginRequest(BaseModel):
    username: str
    password: str
    phone: str
    name: str