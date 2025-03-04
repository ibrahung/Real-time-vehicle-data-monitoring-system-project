import paho.mqtt.client as mqtt
import json
import random
import time

MQTT_BROKER = "anhpn.ddns.net"
MQTT_PORT = 1883
MQTT_TOPIC = "vehicle/data"

def publish_data():
    client = mqtt.Client()
    client.connect(MQTT_BROKER, MQTT_PORT, 60)

    while True:
        data = {
            "speed": random.randint(30, 120),
            "coolant_temp": random.randint(60, 100),
            "error_code": random.randint(0, 2)
        }
        json_data = json.dumps(data)
        print(f"Gửi dữ liệu: {json_data}")
        client.publish(MQTT_TOPIC, json_data)
        time.sleep(5)  # Gửi mỗi 5 giây

if __name__ == "__main__":
    publish_data()
