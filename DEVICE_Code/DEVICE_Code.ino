#include "4G.h"
#include "Realtime.h"
#include "PublishMQTT.h"
#include <ArduinoJson.h>

const char* DEVICE_ID = "3333";
const char* MQTT_TOPIC = "vehicle/data";

const char* WARNING_CODES[] = {"P0100", "P0130", "P0171", "P0455", "P0420"};
const int WARNING_COUNT = sizeof(WARNING_CODES) / sizeof(WARNING_CODES[0]);

unsigned int last_rpm = 1500;
float last_temp = 70.0;

float estimateSpeed(int rpm) {
  if (rpm < 3000) return 20;
  else if (rpm < 4000) return (rpm - 3000) * 0.03 + 30;
  else if (rpm < 5000) return (rpm - 4000) * 0.035 + 50;
  else if (rpm < 6000) return (rpm - 5000) * 0.04 + 70;
  else return 30;
}

void setup() {
  Serial.begin(115200);
  delay(1000);

  setup4G();         // GPRS 4G
  syncSIMClock();    // Lấy timestamp thực
  connectMQTT();     // MQTT
}

void loop() {
  StaticJsonDocument<1024> doc;

  JsonArray ts_arr  = doc["timestamp"].to<JsonArray>();
  JsonArray rpm_arr = doc["rpm"].to<JsonArray>();
  JsonArray speed_arr = doc["speed"].to<JsonArray>();
  JsonArray brake_arr = doc["brake"].to<JsonArray>();
  JsonArray throttle_arr = doc["throttle"].to<JsonArray>();
  JsonArray temp_arr = doc["temp"].to<JsonArray>();
  JsonArray lat_arr = doc["latitude"].to<JsonArray>();
  JsonArray lon_arr = doc["longitude"].to<JsonArray>();

  doc["device_id"] = DEVICE_ID;

  for (int i = 0; i < 5; i++) {
    unsigned long t = get_Realtime();
    int brake = random(0, 100) < 5 ? 1 : 0;
    int rpm = constrain(last_rpm + random(-200, 300) * (brake ? -1 : 1), 800, 6000);
    float speed = estimateSpeed(rpm);
    float throttle = random(20, 200) / 100.0;
    last_temp += (speed > 0) ? 0.02 : -0.01;
    float lat = 10.762622 + random(-500, 500) / 1000000.0;
    float lon = 106.660172 + random(-500, 500) / 1000000.0;

    ts_arr.add(t);
    rpm_arr.add(rpm);
    speed_arr.add(speed);
    brake_arr.add(brake);
    throttle_arr.add(throttle);
    temp_arr.add(last_temp);
    lat_arr.add(lat);
    lon_arr.add(lon);

    last_rpm = rpm;
    delay(1000);  // 1s mỗi mẫu
  }

  // Xác suất 10% có lỗi
  doc["error"] = (random(0, 100) < 10) ? WARNING_CODES[random(0, WARNING_COUNT)] : "";

  // Gửi lên MQTT
  char payload[1024];
  serializeJson(doc, payload);
  send_Data(MQTT_TOPIC, payload);
  Serial.println("✅ Đã gửi 5 mẫu MQTT");
}
