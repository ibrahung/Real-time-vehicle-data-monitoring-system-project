# models.py

from sqlalchemy import Column, Integer, String, Float, DateTime
from database import Base  # Import Base từ database.py


class User_Data(Base):
    __tablename__ = "User_Data" 

    Username = Column(String(50), primary_key=True, index=True)
    Password = Column(String(100), nullable=False)
    Name = Column(String(100))
    Phone = Column(String(20))

class Device_Data(Base):
    __tablename__ = "Device_Data"

    Device_ID = Column(String(50), primary_key=True)
    License_Plate = Column(String(50), nullable=False)
    Install_Date = Column(DateTime)
    Username =  Column(String(50))

class Customer_Data(Base):
    __tablename__ = "Customer_Data"

    Device_ID = Column(String(50), primary_key=True)
    License_plate = Column(String(50))
    Renter_name = Column(String(100))
    Start_day = Column(DateTime)
    Phone = Column(String(10))
    CCCD = Column(String(20))
    Return_day = Column(DateTime)
    Rental_type = Column(String(100))
    Cost = Column(String(100))
    Payment_status = Column(String(100))
    Status = Column(String(100))
    Vehicle_name = Column(String(100))

class Car_Data(Base):
    __tablename__ = "Car_Data"

    Device_ID = Column(String(100), primary_key=True)
    TimeStamp = Column(Integer, primary_key=True)

    RPM = Column(Integer)
    Speed = Column(Float)
    Throttle = Column(Float)
    Brake = Column(Integer)
    Temp = Column(Float)
    Latitude = Column(Float)
    Longitude = Column(Float)
    ERROR = Column(String(100))
    Engine_Load = Column(Float)
    
class History(Base):
    __tablename__ = "History"

    Device_ID = Column(String(50), primary_key=True)
    Renter_name = Column(String(100))
    CCCD = Column(String(20))
    Vehicle_name = Column(String(100))
    License_plate = Column(String(50))
    Phone = Column(String(20))
    Start_day = Column(DateTime)
    Return_day = Column(DateTime)
    Rental_type = Column(String(100))
    Cost = Column(String(100))
    Payment_status = Column(String(100))
    Status = Column(String(100))
    

