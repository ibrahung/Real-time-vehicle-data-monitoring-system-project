#ifndef _PUBLISH_MQTT_H_
#define _PUBLISH_MQTT_H_

#include <TinyGsmClient.h>
#include <PubSubClient.h>

// Dùng lại modem từ 4G.h
extern TinyGsm modem;

TinyGsmClient mqttClient(modem);
PubSubClient mqtt(mqttClient);

// MQTT server info
const char* mqtt_server = "anhpn.ddns.net";
const int mqtt_port = 1883;
const char* mqtt_client_id = "esp32_sim_client";

void connectMQTT() {
  mqtt.setServer(mqtt_server, mqtt_port);

  while (!mqtt.connected()) {
    Serial.print("🔌 Đang kết nối MQTT...");
    if (mqtt.connect(mqtt_client_id)) {
      Serial.println("✅ Kết nối MQTT thành công.");
    } else {
      Serial.print("❌ Thất bại, lỗi code: ");
      Serial.println(mqtt.state());
      delay(2000);
    }
  }
}

// ✅ Hàm duy nhất để gửi dữ liệu từ file .ino
void send_Data(const String& topic, const String& payload) {
  if (!mqtt.connected()) {
    connectMQTT();
  }

  mqtt.publish(topic.c_str(), payload.c_str());
  Serial.print("📤 Đã gửi lên topic ");
  Serial.print(topic);
  Serial.print(": ");
  Serial.println(payload);
}

#endif
