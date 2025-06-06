# mqtt_publisher.py
import json
import random
import time
import paho.mqtt.client as mqtt
import config as cf  # chứa MQTT_BROKER

MQTT_BROKER = cf.MQTT_BROKER
MQTT_PORT = 1883
MQTT_TOPIC = "vehicle/data"
DEVICE_ID = "3333"
WARNING_CODES = ["P0100", "P0130", "P0171", "P0455", "P0420"]

def estimate_speed_from_rpm(rpm):
    if rpm < 3000: return 20
    elif rpm < 4000: return (rpm - 3000) * 0.03 + 30
    elif rpm < 5000: return (rpm - 4000) * 0.035 + 50
    elif rpm < 6000: return (rpm - 5000) * 0.04 + 70
    else: return 30

def generate_sample(last_rpm, last_temp):
    brake = 1 if random.random() < 0.05 else 0
    rpm = max(800, min(last_rpm + random.randint(-200, 300) * (1 if brake == 0 else -1), 6000))
    speed = estimate_speed_from_rpm(rpm)
    temp = last_temp + (0.02 if speed > 0 else -0.01)
    return {
        "timestamp": int(time.time()),
        "rpm": rpm,
        "speed": round(speed, 2),
        "brake": brake,
        "throttle": round(random.uniform(0.2, 2.0), 2),
        "temp": round(temp, 2),
        "latitude": round(10.762622 + random.uniform(-0.0005, 0.0005), 6),
        "longitude": round(106.660172 + random.uniform(-0.0005, 0.0005), 6),
    }, rpm, temp

def publish_loop():
    client = mqtt.Client()
    client.connect(MQTT_BROKER, MQTT_PORT, 60)
    last_rpm, last_temp = 1500, 70.0

    while True:
        data = {
            "device_id": DEVICE_ID,
            "timestamp": [],
            "rpm": [],
            "speed": [],
            "brake": [],
            "throttle": [],
            "temp": [],
            "latitude": [],
            "longitude": [],
            "error": random.choice(WARNING_CODES) if random.random() < 0.1 else ""
        }

        for _ in range(5):
            sample, last_rpm, last_temp = generate_sample(last_rpm, last_temp)
            for key in ["timestamp", "rpm", "speed", "brake", "throttle", "temp", "latitude", "longitude"]:
                data[key].append(sample[key])
            time.sleep(1)

        client.publish(MQTT_TOPIC, json.dumps(data))
        print("✅ Đã gửi 5 mẫu MQTT")

publish_loop()
