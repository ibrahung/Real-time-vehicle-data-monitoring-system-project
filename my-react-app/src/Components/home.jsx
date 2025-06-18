import { useState, useEffect } from "react";
import "../Styles/home.css";
import { Line } from "react-chartjs-2";
import { IoMdAdd } from "react-icons/io";
import { IoIosNotifications } from "react-icons/io";

import { FaSignal, FaSearch, FaCar } from "react-icons/fa";

function Home({ onNavigate }) {
  const [carList, setCarList] = useState([]); 
  const [selectedPlate, setSelectedPlate] = useState("");
  const [SpeedData, setSpeedData] = useState([]); 
  const windowSize = 300;
  const [currentTimeRange, setCurrentTimeRange] = useState({ start: 0, end: windowSize });
  const [onlineCount,setOnlineCount] = useState({online: 0, offline: 0})
  const [errors, setErrors] = useState([]);

  //  1. Gọi API lấy danh sách xe (biển số)
  useEffect(() => {
    async function fetchCarList() {
      try {
        const response = await fetch("http://localhost:8000/car/list");
        const data = await response.json();
        setCarList(data);

        if (data.length>0){
          setSelectedPlate(data[0].license_plate);
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách xe:", error);
      }
    }
    fetchCarList();
  }, []);

  //  2. Gọi API khi chọn biển số
  const fetchSpeedByPlate = async (plate) => {
    try {
      const response = await fetch(
        `http://localhost:8000/car/speed-data-by-plate?plate=${plate}`
      );
      const data = await response.json();
      const lastThirtyMinutes = data.slice(-1800);
      setSpeedData(lastThirtyMinutes);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu theo biển số:", err);
    }
  };
  // 3. Reset lại thanh trượt khi chọn lại biển số
  useEffect(() => {
    if (!selectedPlate) return;
    fetchSpeedByPlate(selectedPlate); // Gọi 1 lần khi chọn mới
    setCurrentTimeRange({ start: 0, end: windowSize }); // Chỉ reset slider tại đây
  }, [selectedPlate]);

  // 4. Reset đồ thị mỗi 10s
  useEffect(() => {
  if (!selectedPlate) return;

  const interval = setInterval(() => {
    fetchSpeedByPlate(selectedPlate); // Không reset slider ở đây!
     console.log("🟡 SpeedData mới:", SpeedData[SpeedData.length - 1]);
  }, 10000);

    return () => clearInterval(interval);
  }, [selectedPlate]);

  // 5. Dữ liệu cho biểu đồ
  const chartData = {  /*map() sẽ chuyển đổi time thành chuỗi giờ phút giây */
    labels: SpeedData.slice(currentTimeRange.start, currentTimeRange.end).map((data) => {
  return data.time.split(" ")[1]; 
  }),
    datasets: [
      {
        label: "Tốc độ xe",
        data: SpeedData.slice(currentTimeRange.start, currentTimeRange.end).map((data) => data.speed),
        borderColor: "#FF6A00",
        borderWidth: 2,
        fill: false,
      },
    ],
  };
  // 6. Đếm xe onl, off
  useEffect(() =>{
    const fetchOnlineCount = async() => {
      const res = await fetch("http://localhost:8000/car/online-list");
      const data = await res.json();
      setOnlineCount(data);
    }
    fetchOnlineCount();
    const interval = setInterval(fetchOnlineCount,60000);
    return() => clearInterval(interval);
  },[]);

  // 7. Cảnh báo lỗi
    useEffect(() => {
        const fetchErrors = async () => {
            try {
                const res = await fetch("http://localhost:8000/error-list");
                const data = await res.json();
                setErrors(data);
            } catch (err) {
                console.error("Lỗi khi gọi API lỗi:", err);
            }
        };

        fetchErrors();
        const interval = setInterval(fetchErrors, 10000); // Gọi lại mỗi 10 giây

        return () => clearInterval(interval);
    }, []);

  return (
    <div id="Home">
      <button className="add-button" onClick={() => onNavigate("add")}>
        <IoMdAdd size={20} /> Add Device
      </button>
      <button className="notice-button">
        <IoIosNotifications />
      </button>
      <h2 className="h2-home">
        👋 Welcome back
      </h2>

      <div className="search">
        <FaSearch className="input-icon" />
        <input type="text" placeholder=" Search" />
      </div>

      {/* Dropdown chọn biển số xe */}
      <div className="plate-select-container">
        <select
          className="plate-select-dropdown"
          value={selectedPlate}
          onChange={(e) => setSelectedPlate(e.target.value)}
        >
          <option value="">-- Chọn xe nào --</option>
          {carList.map((car) => (
            <option key={car.device_id} value={car.license_plate}>
              {car.license_plate}
            </option>
          ))}
        </select>
      </div>
      <div className="real-map">
        {SpeedData.length > 0 && (
          <div className="mini-dashboard">
            <h3>🚗 Dữ liệu thời gian thực</h3>
            <p>
              <span className="label">Tốc độ:</span>
              <span className="value">{SpeedData[SpeedData.length - 1].speed} km/h</span>
            </p>
            <p>
              <span className="label">RPM:</span>
              <span className="value">{SpeedData[SpeedData.length - 1].rpm} v/p</span>
            </p>
            <p>
              <span className="label">Nhiệt độ:</span>
              <span className="value">{SpeedData[SpeedData.length - 1].temp}°C</span>
            </p>
            <p>
              <span className="label">Tải:</span>
              <span className="value">{SpeedData[SpeedData.length - 1].load}%</span>
            </p>
            <p>
              <span className="label">Phanh:</span>
              <span className="value">
                {SpeedData[SpeedData.length - 1].brake ? "Có" : "Không"}
              </span>
            </p>
            <p>
              <span className="label">Lúc:</span>
              <span className="value">{SpeedData[SpeedData.length - 1].time}</span>
            </p>
          </div>
        )}
        <div className="status-summary">
          <h3>📡 Trạng thái hệ thống</h3>
          <p>
            <span className="label">🟢 Đang online:</span>
            <span className="value">{onlineCount.online}</span> 
          </p>
          <p>
            <span className="label">🔴 Mất kết nối:</span>
            <span className="value">{onlineCount.offline}</span> 
          </p>
        </div>
        {onlineCount.offline_plates && (
          <div className="offline-list">
            <h3>🟢 Xe đang hoạt động:</h3>
            <ul>
              {onlineCount.offline_plates.length === 0 ? (
                <li>Không có xe hoạt động</li>
              ) : (
                onlineCount.online_plates.map((plate, index) => (
                  <li key={index}>🚗 {plate}</li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>

      <div className="chart-home">
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                ticks: {
                  color: "rgba(255, 255, 255, 0.6)",
                  font: {
                    size: 14,
                    weight: "bold", 
                  }, 
                },
                title: {
                  display: true,
                  text: "Thời gian",
                  color: "white",
                  font: {
                    weight: "bold",
                    size: 16,
                  },
                },
              },
              y: {
                ticks: {
                  color: "rgba(255, 255, 255, 0.6)",
                  font: {
                    size: 14,
                    weight: "bold",
                  },
                },
                min: 0,
                max: 140,
                  title: {
                    display: true,
                    text: "Tốc độ (km/h)",
                    color: "white",
                    font: {
                      weight: "bold",
                      size: 16,
                    },
                  },
              },
            },
          }}
        />
      </div>

      <div className="slider-container">
        <input
          type="range"
          min={0}
          max={Math.max(0, SpeedData.length - windowSize)}
          value={currentTimeRange.start}
          onChange={(e) => {
            const newStart = parseInt(e.target.value);
            setCurrentTimeRange({
              start: newStart,
              end: newStart + windowSize,
            });
          }}
          className="slider"
        />
      </div>

      <div>
          <div className="error-banner">
                  <h3>🚨 Phát hiện lỗi động cơ</h3>
          </div>
          {errors.length > 0 && (
                  <ul>
                      {errors.map((err, index) => (
                          <li key={index}>
                              Xe <b>{err.license_plate}</b> (ID: {err.device_id}) báo lỗi <b>{err.error_code}</b> lúc {new Date(err.timestamp * 1000).toLocaleString("vi-VN")}
                          </li>
                      ))}
                  </ul>
            )}
        </div>

      <div className="perform">
        <h3>⏱️Tổng thời gian lái</h3>
      </div>
    </div>
  );
}

export default Home;
