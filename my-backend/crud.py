# crud.py
from fastapi import Depends, status,HTTPException
from sqlalchemy.orm import Session
import models, schemas
from datetime import datetime, timezone, timedelta
# ---------------------- Device_Data ----------------------

def create_device(db: Session, device: schemas.DeviceDataCreate):
    db_device = models.Device_Data(
        Device_ID = device.device_id,
        License_Plate = device.license_plate,
        Install_Date = device.install_date,
        Username = device.username
    )
    db.add(db_device)
    db.commit()
    db.refresh(db_device)
    return db_device

# ---------------------- Customer_Data ----------------------

def create_customer(db: Session, customer: schemas.CustomerCreate):
    device = db.query(models.Device_Data)\
               .filter(models.Device_Data.License_Plate == customer.license_plate)\
               .first()
    if not device:
        raise HTTPException(status_code=404, detail="Không tìm thấy thiết bị với biển số này")

    new_customer = models.Customer_Data(
        Device_ID = device.Device_ID,  
        License_plate = customer.license_plate,
        Renter_name = customer.renter_name,
        Start_day = customer.start_day,
        Phone = customer.phone,
        CCCD = customer.cccd,
        Return_day = customer.return_day,
        Rental_type = customer.rental_type,
        Cost = customer.cost,
        Payment_status = customer.payment_status,
        Status = customer.status,
        Vehicle_name = customer.vehicle_name,
    )

    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)

    return new_customer

def  update_customer(db:Session,customer_id: int, data: schemas.CustomerUpdate):
    # 1. Tìm khách theo id
    customer = db.query(models.Customer_Data).filter(models.Customer_Data.Device_ID == customer_id).first()
    if not customer: 
        return None
    
     # 2. Lấy dữ liệu được gửi từ frontend, chỉ lấy các trường có giá trị
    update_data = data.dict(exclude_unset=True)

    # 3. Gán từng trường vào bản ghi cũ
    for key, value in update_data.items():
        setattr(customer, key, value)

    # 4. Lưu lại vào database
    db.commit()
    db.refresh(customer)

    return customer

def delete_customer(db: Session, customer_id: int):
    customer = db.query(models.Customer_Data).filter(models.Customer_Data.Device_ID == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Khách hàng không tồn tại")
    
    db.delete(customer)
    db.commit()
    return {"message": "Đã xóa thành công"}

def archive_customer(db: Session, customer_id: int):
    customer = db.query(models.Customer_Data)\
                 .filter(models.Customer_Data.Device_ID == customer_id)\
                 .first()
    if not customer:
        raise HTTPException(status_code=404, detail="Không tìm thấy khách hàng")
    
    history = models.History(
        Device_ID = customer.Device_ID,
        Renter_name = customer.Renter_name,
        CCCD = customer.CCCD,
        Vehicle_name = customer.Vehicle_name,
        License_plate = customer.License_plate,
        Phone = customer.Phone,
        Start_day = customer.Start_day,
        Return_day = customer.Return_day,
        Rental_type = customer.Rental_type,
        Cost = customer.Cost,
        Payment_status = customer.Payment_status,
        Status = customer.Status
    )

    db.add(history)
    db.delete(customer)
    db.commit()

    return {"message": "Đã chuyển khách thuê vào lịch sử"}

def get_all_rental_history(db: Session):
    return db.query(models.History).all()

# ---------------------- Car_Data ----------------------

def get_speed_data_by_plate(db: Session, plate: str):
    device = db.query(models.Device_Data)\
               .filter(models.Device_Data.License_Plate == plate)\
               .first()
    if not device:
        return []

    car_data = db.query(models.Car_Data)\
                 .filter(models.Car_Data.Device_ID == device.Device_ID)\
                 .all()

    return [
        { 
            "time": datetime.utcfromtimestamp(data.TimeStamp).strftime('%Y-%m-%d %H:%M:%S'),
            "speed": data.Speed,
            "rpm": data.RPM,
            "temp": data.Temp,
            "brake": data.Brake,
            "load": data.Engine_Load
        }
        for data in car_data
    ]
    
def get_car_list(db: Session):
    devices = db.query(models.Device_Data).all()
    return [
    {
        "license_plate": device.License_Plate
    }
    for device in devices
]
    
def get_online_cars(db: Session):
    devices = db.query(models.Device_Data).all()

    now = datetime.now(timezone.utc).timestamp() + 7 * 3600
    threshold = 300

    online, offline = 0, 0
    online_plates, offline_plates = [], []
    for device in devices:
        latest = (
            db.query(models.Car_Data)
            .filter(models.Car_Data.Device_ID == device.Device_ID)
            .order_by(models.Car_Data.TimeStamp.desc())
            .first()
        )

        if latest:
            delta = abs(now - latest.TimeStamp)
            print(f"[DEBUG] {device.Device_ID} | now = {datetime.fromtimestamp(now)} | latest = {datetime.fromtimestamp(latest.TimeStamp)} | delta = {delta:.1f}s")

            if 0 <= delta <= threshold:
                online += 1
                online_plates.append(device.License_Plate)
            else:
                offline += 1
                offline_plates.append(device.License_Plate)
        else:
            offline += 1
            offline_plates.append(device.License_Plate)

    return {
        "online": online,
        "offline": offline,
        "online_plates": online_plates,
        "offline_plates": offline_plates
    }
    
def get_error_list(db: Session):
    devices = db.query(models.Device_Data).all()

    error_list = []

    for device in devices:
        latest_error = (
            db.query(models.Car_Data)
            .filter(
                models.Car_Data.Device_ID == device.Device_ID,
                models.Car_Data.ERROR.isnot(None),
                models.Car_Data.ERROR != 0
            )
            .order_by(models.Car_Data.TimeStamp.desc())
            .first()
        )

        if latest_error:
            error_list.append({
                "license_plate": device.License_Plate,
                "device_id": device.Device_ID,
                "timestamp": latest_error.TimeStamp,
                "error_code": latest_error.ERROR
            })

    return error_list

#---------------------------User_Data----------------
def login(db: Session, username: str, password: str):
    user = db.query(models.User_Data).filter(
        models.User_Data.Username == username,
        models.User_Data.Password == password  # Lưu ý: nên hash sau này
    ).first()
    return user