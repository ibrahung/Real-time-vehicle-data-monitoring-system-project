import "../Styles/setting.css"
import { useState,useEffect } from "react";

function Setting() {
    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);

    const fetchHistory = async () => {
        try {
            const res = await fetch("http://localhost:8000/customers/history");
            if (!res.ok) throw new Error("Lỗi khi lấy lịch sử thuê xe!");
            const data = await res.json();
            setHistory(data);
            setShowHistory(true); // Sau khi fetch xong thì hiển thị bảng
        } catch (err) {
            console.error(err);
            alert("Không thể tải dữ liệu lịch sử!");
        }
    };

    return (
        <div>
            {!showHistory && (  // Nếu chưa nhấn thì mới hiển thị các nút
                <div id="group-button">
                    <button>Cài đặt tài khoản</button>
                    <button className="historybutton" onClick={fetchHistory}>Lịch sử thuê xe</button>
                    <button>Cài đặt thông báo</button>
                    <button>Cài đặt giao diện</button>
                    <button>Hỗ trợ</button>
                </div>
            )}

            {showHistory && (
                <div className="history-box">
                    <h3>Lịch sử thuê xe</h3>
                    {history.length === 0 ? (
                        <p style={{ textAlign: "center", color: "#ed5909" }}>Chưa có lịch sử nào!</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Biển số</th>
                                    <th>Tên người thuê</th>
                                    <th>Ngày thuê</th>
                                    <th>Ngày trả</th>
                                    <th>Số điện thoại</th>
                                    <th>Giá</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((item) => (
                                    <tr key={item.Device_ID}>
                                        <td>{item.License_plate}</td>
                                        <td>{item.Renter_name}</td>
                                        <td>{new Date(item.Start_day).toLocaleString()}</td>
                                        <td>{new Date(item.Return_day).toLocaleString()}</td>
                                        <td>{item.Phone}</td>
                                        <td>{item.Cost} VNĐ</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}

export default Setting;
