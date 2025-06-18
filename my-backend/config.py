# MQTT Configuration
MQTT_BROKER = "anhpn.ddns.net"  # Địa chỉ broker MQTT
MQTT_PORT = 1883  # Cổng kết nối (thường là 1883 cho không mã hóa, 8883 cho TLS)
#MQTT_USERNAME = "your_username"  # Tên đăng nhập (nếu có)
#MQTT_PASSWORD = "your_password"  # Mật khẩu (nếu có)
MQTT_TOPIC_SUBSCRIBE = "sensor/data"  # Topic để lắng nghe dữ liệu
MQTT_TOPIC_PUBLISH = "device/command"  # Topic để gửi dữ liệu
#MQTT_KEEPALIVE = 60  # Thời gian giữ kết nối (seconds)
#MQTT_TLS = False  # True nếu sử dụng TLS/SSL


####################################

# Database Configuration (MySQL / PostgreSQL)
DB_HOST = "anhpn.ddns.net"  # Hoặc IP của database server
DB_PORT = 3307  # MySQL: 3306, PostgreSQL: 5432
DB_NAME = "CAR_MORNITORING"  # Tên database
DB_USER = "hung_2025"  # Username đăng nhập
DB_PASSWORD = "hung_2025"  # Mật khẩu đăng nhập


  