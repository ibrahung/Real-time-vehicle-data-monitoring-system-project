# mqtt_subscriber.py
import paho.mqtt.client as mqtt
import mysql.connector
import json
import config as cf  # chứa DB và MQTT

MQTT_BROKER = cf.MQTT_BROKER
MQTT_PORT = 1883
MQTT_TOPIC = "vehicle/data"

# Kết nối DB
db = mysql.connector.connect(
    host=cf.DB_HOST,
    user=cf.DB_USER,
    password=cf.DB_PASSWORD,
    database=cf.DB_NAME,
    port=3307
)
cursor = db.cursor()
print("✅ Đã kết nối MySQL")

def on_message(client, userdata, msg):
    try:
        data = json.loads(msg.payload.decode())
        device_id = str(data["device_id"])
        error = data.get("error", "")

        for i in range(5):
            sql = """
            INSERT INTO Car_Data (
                device_id, timestamp, rpm, speed,
                brake, throttle, temp, latitude,
                longitude, error
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            values = (
                device_id,
                int(data["timestamp"][i]),
                int(data["rpm"][i]),
                float(data["speed"][i]),
                int(data["brake"][i]),
                float(data["throttle"][i]),
                float(data["temp"][i]),
                float(data["latitude"][i]),
                float(data["longitude"][i]),
                error
            )
            cursor.execute(sql, values)
            print(f"✅ Ghi mẫu {i+1}/5: Speed={values[3]} RPM={values[2]}")

        db.commit()

    except Exception as e:
        print(f"❌ Lỗi subscriber: {e}")

client = mqtt.Client()
client.on_message = on_message
client.connect(MQTT_BROKER, MQTT_PORT, 60)
client.subscribe(MQTT_TOPIC)
print("📡 Đang lắng nghe MQTT...")
client.loop_forever()
