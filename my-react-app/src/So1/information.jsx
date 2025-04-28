import { useState, useEffect } from "react";
import "./information.css";

function Information() {
    const [vehicles, setVehicles] = useState([]);
    const [expandedRow, setExpandedRow] = useState(null); // Theo dõi dòng nào đang mở

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await fetch("http://localhost:8000/customers/");
                if (!response.ok) {
                    throw new Error("Lỗi khi lấy dữ liệu!");
                }
                const data = await response.json();
                setVehicles(data);
            } catch (error) {
                console.error("Lỗi API:", error);
            }
        };

        fetchVehicles();
    }, []);

    const toggleDetails = (id) => {
        setExpandedRow(expandedRow === id ? null : id); // Đóng nếu đang mở, mở nếu đang đóng
    };

    return (
        <div className="infor">
            <table>
                <thead>
                    <tr>
                        <th>Dòng xe</th>
                        <th>Biển số xe</th>
                        <th>Tên người thuê</th>
                        <th>Ngày giao</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {vehicles.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={{ textAlign: "center" }}>Không có xe nào được thuê!</td>
                        </tr>
                    ) : (
                        vehicles.map((vehicle) => (
                            <>
                                <tr key={vehicle.id}>
                                    <td>{vehicle.Vehicle_name}</td>
                                    <td>{vehicle.License_plate}</td>
                                    <td>{vehicle.Renter_name}</td>
                                    <td>{vehicle.Return_day}</td>
                                    <td>
                                        <button onClick={() => toggleDetails(vehicle.id)}>
                                            {expandedRow === vehicle.id ? "Ẩn" : "Chi tiết"}
                                        </button>
                                    </td>
                                </tr>
                                {expandedRow === vehicle.id && (
                                    <tr className="details-row">
                                        <td colSpan="5">
                                            <div><strong>Căn cước</strong><span>: {vehicle.CCCD}</span></div>
                                            <div><strong>Số điện thoại</strong><span>: {vehicle.Phone}</span></div>
                                            <div><strong>Ngày thuê</strong><span>: {vehicle.Start_day}</span></div>
                                            <div><strong>Loại thuê</strong><span>: {vehicle.Rental_type}</span></div>
                                            <div><strong>Trạng thái</strong><span>: {vehicle.Status}</span></div>
                                            <div><strong>Thanh toán</strong><span>: {vehicle.Payment_status}</span></div>
                                            <div><strong>Giá Thuê</strong><span>: {vehicle.Cost} VNĐ</span></div>
                                        </td>
                                    </tr>
                                )}
                            </>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Information;
