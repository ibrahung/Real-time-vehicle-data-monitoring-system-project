# main.py

from fastapi import FastAPI
from routers import device, customer, car
import models
from database import engine
from fastapi.middleware.cors import CORSMiddleware

# Tạo các bảng trong database nếu chưa có
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(device.router)
app.include_router(customer.router)
app.include_router(car.router)

@app.get("/")
def read_root():
    return {"message": "Backend FastAPI is running!"}
