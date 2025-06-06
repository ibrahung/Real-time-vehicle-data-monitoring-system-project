#ifndef _MODULE_4G_H_
#define _MODULE_4G_H_

#define TINY_GSM_MODEM_SIM7600
#define TINY_GSM_RX_BUFFER 1024

#include <TinyGsmClient.h>
#include <HardwareSerial.h>

#define MODEM_RST      4
#define MODEM_TX       16
#define MODEM_RX       17
#define MODEM_BAUD     115200

const char apn[] = "v-internet";  // APN của Viettel

HardwareSerial simSerial(1);
TinyGsm modem(simSerial);

void setup4G() {
  simSerial.begin(MODEM_BAUD, SERIAL_8N1, MODEM_RX, MODEM_TX);
  delay(3000);

  Serial.println("🚀 Khởi động modem...");
  modem.restart();

  Serial.println("📶 Đang kết nối mạng qua PPP...");
  if (!modem.gprsConnect(apn)) {
    Serial.println("❌ Kết nối thất bại! Kiểm tra SIM và anten.");
    while (1);
  }

  Serial.println("✅ Đã kết nối mạng qua 4G.");
}

#endif
