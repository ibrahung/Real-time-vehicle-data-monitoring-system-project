# schemas.py

from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime

# Schemas cho Device_Data
class DeviceDataCreate(BaseModel):
    License_Plate: str
    ID_ESP32: str

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
    
    model_config = ConfigDict(from_attributes=True)

class CustomerOut(BaseModel):
    id: int
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

    class Config:
        orm_mode = True 

# Schemas cho Car_Data
class CarDataCreate(BaseModel):
    Device_ID: str
    Time_Stamp: int
    Car_Status: str
    RPM: int
    Speed: int
    Acc: int
    Brake_Status: int
    Temp: int
    Latitude: float
    Longitude: float
