# models.py

from sqlalchemy import Column, Integer, String, Float, DateTime
from database import Base  # Import Base từ database.py

class Device_Data(Base):
    __tablename__ = "Device_Data"

    ID_ESP32 = Column(String(100), primary_key=True)
    License_Plate = Column(String(100), nullable=False)

class Customer_Data(Base):
    __tablename__ = "Customer_Data"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    Renter_name = Column(String(100))
    CCCD = Column(String(20))
    Vehicle_name = Column(String(100))
    License_plate = Column(String(100))
    Phone = Column(String(20))
    Start_day = Column(DateTime)
    Return_day = Column(DateTime)
    Rental_type = Column(String(100))
    Cost = Column(String(100))
    Payment_status = Column(String(100))
    Status = Column(String(100))

class Car_Data(Base):
    __tablename__ = "Car_Data"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    Device_ID = Column(String(100))
    Time_Stamp = Column(Integer)
    Car_Status = Column(String(10))
    RPM = Column(Integer)
    Speed = Column(Integer)
    Acc = Column(Integer)
    Brake_Status = Column(Integer)
    Temp = Column(Integer)
    Latitude = Column(Float)
    Longitude = Column(Float)
