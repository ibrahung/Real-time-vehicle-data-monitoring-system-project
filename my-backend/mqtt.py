import paho.mqtt.client as mqtt
import json
from database import SessionLocal
import models

# Thông tin BROKER MQTT
MQTT_BROKER = "anhpn.ddns.net"
MQTT_PORT = 1883
MQTT_TOPIC = "vehicle/data"

# 📥 Hàm xử lý khi nhận dữ liệu từ ESP32
def on_message(client, userdata, msg):
    print("on_message duoc goi!")  

    try:
        payload = msg.payload.decode()
        print("Payload raw:", payload)

        data = json.loads(payload)
        print(" Nhan JSON:", data)

        # Kiểm tra các key bắt buộc
        required_keys = ["Device_ID", "TimeStamp", "RPM", "Speed", "Throttle", "Brake", "Temp", "Latitude", "Longitude", "ERROR"]
        for key in required_keys:
            if key not in data:
                print(f" Thieu truong {key} trong JSON")
                return

        db = SessionLocal()
        new_data = models.Car_Data(
            Device_ID = data["Device_ID"],
            TimeStamp = data["TimeStamp"],
            RPM = data["RPM"],
            Speed = data["Speed"],
            Throttle = data["Throttle"],
            Brake = data["Brake"],
            Temp = data["Temp"],
            Latitude = data["Latitude"],
            Longitude = data["Longitude"]
        )
        db.add(new_data)
        db.commit()
        db.close()
        print("Da luu")

    except Exception as e:
        print(" Loi xu ly:", e)

# 🚀 Khởi tạo MQTT client
client = mqtt.Client()
client.on_message = on_message

client.connect(MQTT_BROKER, MQTT_PORT)
client.subscribe(MQTT_TOPIC)
print(f" Subscribed {MQTT_TOPIC} trên {MQTT_BROKER}")
client.loop_forever()
