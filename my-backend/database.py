# database.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Thông tin kết nối database
DATABASE_URL = "mysql+pymysql://hung_2025:hung_2025@anhpn.ddns.net:3307/CAR_MORNITORING"

# Khởi tạo engine và session
engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Khởi tạo Base ORM
Base = declarative_base()

# Function để lấy session database (dùng trong các API)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
