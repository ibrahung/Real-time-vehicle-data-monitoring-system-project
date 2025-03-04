import paho.mqtt.client as mqtt

MQTT_BROKER = "anhpn.ddns.net"
MQTT_PORT = 1883
MQTT_TOPIC = "vehicle/data"

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Kết nối MQTT thành công!")
        client.subscribe(MQTT_TOPIC)
    else:
        print(f"Lỗi kết nối MQTT, mã lỗi: {rc}")

def on_message(client, userdata, msg):
    print(f"Nhận dữ liệu từ {msg.topic}: {msg.payload.decode()}")

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message
client.connect(MQTT_BROKER, MQTT_PORT, 60)
client.loop_forever()
