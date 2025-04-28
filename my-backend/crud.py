# crud.py

from sqlalchemy.orm import Session
import models, schemas

# ---------------------- Device_Data ----------------------

def create_device(db: Session, device: schemas.DeviceDataCreate):
    db_device = models.Device_Data(
        ID_ESP32 = device.ID_ESP32,
        License_Plate = device.License_Plate
    )
    db.add(db_device)
    db.commit()
    db.refresh(db_device)
    return db_device

def get_device_by_license(db: Session, license_plate: str):
    return db.query(models.Device_Data).filter(models.Device_Data.License_Plate == license_plate).first()

# ---------------------- Customer_Data ----------------------

def create_customer(db: Session, customer: schemas.CustomerCreate):
    db_customer = models.Customer_Data(
        Renter_name=customer.renter_name,
        CCCD=customer.cccd,
        Vehicle_name=customer.vehicle_name,
        License_plate=customer.license_plate,
        Phone=customer.phone,
        Start_day=customer.start_day,
        Return_day=customer.return_day,
        Rental_type=customer.rental_type,
        Cost=customer.cost,
        Payment_status=customer.payment_status,
        Status=customer.status
    )
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

# ---------------------- Car_Data ----------------------

def create_car_data(db: Session, car_data: schemas.CarDataCreate):
    db_car_data = models.Car_Data(
        Device_ID=car_data.Device_ID,
        Time_Stamp=car_data.Time_Stamp,
        Car_Status=car_data.Car_Status,
        RPM=car_data.RPM,
        Speed=car_data.Speed,
        Acc=car_data.Acc,
        Brake_Status=car_data.Brake_Status,
        Temp=car_data.Temp,
        Latitude=car_data.Latitude,
        Longitude=car_data.Longitude
    )
    db.add(db_car_data)
    db.commit()
    db.refresh(db_car_data)
    return db_car_data
