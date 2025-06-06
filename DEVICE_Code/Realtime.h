#ifndef _REALTIME_H_
#define _REALTIME_H_

#include <time.h>
#include <Arduino.h>

extern HardwareSerial simSerial;  // Đảm bảo simSerial đã khai báo ở 4G.h

unsigned long base_time = 0;
unsigned long last_millis = 0;

void syncSIMClock() {
  simSerial.println("AT+CCLK?");
  delay(300);

  String response = "";
  while (simSerial.available()) {
    response += simSerial.readStringUntil('\n');
  }

  int idx = response.indexOf("+CCLK:");
  if (idx == -1) {
    Serial.println("❌ Không lấy được thời gian từ SIM.");
    return;
  }

  String timeStr = response.substring(idx + 7, idx + 7 + 20);  // "24/06/06,12:30:45+28"
  timeStr.replace("\"", "");

  int year   = 2000 + timeStr.substring(0, 2).toInt();
  int month  = timeStr.substring(3, 5).toInt();
  int day    = timeStr.substring(6, 8).toInt();
  int hour   = timeStr.substring(9, 11).toInt();
  int minute = timeStr.substring(12, 14).toInt();
  int second = timeStr.substring(15, 17).toInt();

  struct tm t;
  t.tm_year = year - 1900;
  t.tm_mon  = month - 1;
  t.tm_mday = day;
  t.tm_hour = hour;
  t.tm_min  = minute;
  t.tm_sec  = second;
  t.tm_isdst = 0;

  base_time = mktime(&t);         // UNIX timestamp
  last_millis = millis();         // mốc millis tại thời điểm đồng bộ

  Serial.print("✅ Thời gian từ SIM (timestamp): ");
  Serial.println(base_time);
}

// ✅ Lấy timestamp thực tế tại thời điểm hiện tại
unsigned long get_Realtime() {
  return base_time + (millis() - last_millis) / 1000;
}

#endif
