#include <mcp_can.h>
#include <mcp_can_dfs.h>
#include <SPI.h>

// Thiết lập các chân SPI trên ESP32
#define SPI_CS_PIN 5
MCP_CAN CAN(SPI_CS_PIN);  // Đối tượng MCP2515

// Định nghĩa UART cho module SIM
#define SIM_SERIAL Serial2  // UART2 cho module SIM
#define SIM_TX 17           // GPIO17 TX của ESP32 kết nối RX của module SIM
#define SIM_RX 16           // GPIO16 RX của ESP32 kết nối TX của module SIM

// Định nghĩa PID
#define PID_ENGINE_SPEED  0x0C
#define PID_VEHICLE_SPEED 0x0D
#define PID_COOLANT_TEMP  0x05
#define CAN_ID_PID        0x7DF  // Broadcast request

// Biến toàn cục
#define MAX_PACKETS 10  // Số gói dữ liệu tối đa
float dataBuffer[MAX_PACKETS][3]; // Mảng lưu trữ tốc độ và nhiệt độ
unsigned long lastReadTime = 0;   // Thời gian lần đọc cuối cùng
float previousSpeed = 0.0;        // Vận tốc trước đó
float speedThreshold = 20.0;      // Ngưỡng thay đổi vận tốc
int i = 0;

void set_mask_filt() {
    CAN.init_Mask(0, 0, 0x7FC);
    CAN.init_Mask(1, 0, 0x7FC);

    CAN.init_Filt(0, 0, 0x7E8);  
    CAN.init_Filt(1, 0, 0x7E8);
    CAN.init_Filt(2, 0, 0x7E8);
    CAN.init_Filt(3, 0, 0x7E8);
    CAN.init_Filt(4, 0, 0x7E8);
    CAN.init_Filt(5, 0, 0x7E8);
}
// Thiết lập giao tiếp SPI
void setup() {
  Serial.begin(115200);
  SPI.begin(18, 19, 23, SPI_CS_PIN); // SCK, MISO, MOSI, CS
  while (CAN_OK != CAN.begin(MCP_ANY, CAN_500KBPS, MCP_8MHZ)) {
    Serial.println("CAN BUS Shield init fail");
    delay(100);
  }
    Serial.println("CAN BUS Shield init ok!");
    set_mask_filt();
    
    SIM_SERIAL.begin(9600, SERIAL_8N1, SIM_RX, SIM_TX);
}

void sendPid(unsigned char __pid) {
    unsigned char tmp[8] = {0x02, 0x01, __pid, 0, 0, 0, 0, 0};
    Serial.print("SEND PID: 0x");
    Serial.println(__pid, HEX);
    CAN.sendMsgBuf(CAN_ID_PID, 0, 8, tmp); // 0 là standard 11 bit, 1 là extended 29 bit
}

void sendCollectedData() {
    String payload = "";
    for (int j = 0; j < i; j++) {
      payload += String(dataBuffer[j][0]) + "," +  
                 String(dataBuffer[j][1]) + "," +  
                 String(dataBuffer[j][2]) + "\n";   
    }
    // Gửi dữ liệu qua module SIM
    SIM_SERIAL.println("AT+HTTPINIT");
    delay(100);
    SIM_SERIAL.println("AT+HTTPPARA=\"URL\",\"http://your-server.com/api\"");
    delay(100);
    SIM_SERIAL.print("AT+HTTPDATA=");
    SIM_SERIAL.print(payload.length());
    SIM_SERIAL.println(",10000");
    delay(100);
    SIM_SERIAL.println(payload);  // Gửi dữ liệu
    delay(100);
    SIM_SERIAL.println("AT+HTTPACTION=1");
    delay(5000);  // Chờ phản hồi từ server
    SIM_SERIAL.println("AT+HTTPTERM");

    i = 0;
}

void taskCanRecv() {
  while (CAN.checkReceive() == CAN_MSGAVAIL) {  
    unsigned char len = 0;
    unsigned char buf[8];
    long unsigned int rxId;
    if (CAN.readMsgBuf(&rxId, &len, buf) == CAN_OK) {  
      if (buf[1] == 0x41) {  // 0x41 là mã phản hồi từ ECU
        if (buf[2] == PID_VEHICLE_SPEED) {
          dataBuffer[i][0] = buf[3];
        } 
        else if (buf[2] == PID_COOLANT_TEMP) {
          dataBuffer[i][1] = buf[3] - 40;
        }
        else if (buf[2] == PID_ENGINE_SPEED) {
          dataBuffer[i][2] = ((buf[3] * 256) + buf[4]) / 4;
        }
      }
    }
  }
}
void loop() {
    // Kiểm tra thời gian và gọi taskCanRecv mỗi giây
    if (millis() - lastReadTime >= 1000) {
        lastReadTime = millis();
        sendPid(PID_VEHICLE_SPEED);
        delay(50);
        sendPid(PID_COOLANT_TEMP);
        delay(50);
        sendPid(PID_ENGINE_SPEED);
        delay(50);
        taskCanRecv();

        if (i>0 && abs(dataBuffer[i][0] - previousSpeed) >= speedThreshold ){
          sendCollectedData();
        }
        else{
          previousSpeed = dataBuffer[i][0];
          i++;
          if (i == MAX_PACKETS){
            sendCollectedData();
          }
        }
    }
}
// một lưu ý bài này chưa khắc phục được việc server có nhận thành công hay chưa
// nếu server chưa nhận được dữ liệu mà code tiếp tục chạy thì buffer sẽ bị ghi đè lên dẫn đến mất old data