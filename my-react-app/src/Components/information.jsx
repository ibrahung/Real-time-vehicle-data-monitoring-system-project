import { useState, useEffect } from "react";
import "../Styles/information.css";

function Information() {
    const [vehicles, setVehicles] = useState([]);
    const [expandedRow, setExpandedRow] = useState(null);
    const [editRow, setEditRow] = useState(null);
    const [formData, setFormData] = useState({});

    const fetchVehicles = async () => {
        try {
            const response = await fetch("http://localhost:8000/customers/");
            if (!response.ok) throw new Error("Lỗi khi lấy dữ liệu!");
            const data = await response.json();
            setVehicles(data);
        } catch (error) {
            console.error("Lỗi API:", error);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const handleSave = async (device_id) => {
        try {
            const res = await fetch(`http://localhost:8000/customers/update/${device_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error("Lỗi khi cập nhật!");
            alert("Cập nhật thành công!");
            setEditRow(null);
            setExpandedRow(null);
            fetchVehicles();
        } catch (err) {
            console.error(err);
            alert("Cập nhật thất bại!");
        }
    };

    const handleEditclick = (vehicle) => {
        setEditRow(vehicle.Device_ID);
        setFormData({ ...vehicle });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleArchive = async (device_id) => {
        if (!window.confirm("Bạn có chắc muốn chuyển vào lịch sử?")) return;
        try {
            const res = await fetch(`http://localhost:8000/customers/archive/${device_id}`, {
                method: "POST",
            });
            if (!res.ok) throw new Error("Lỗi khi chuyển vào lịch sử!");
            alert("Đã chuyển khách hàng vào lịch sử!");
            fetchVehicles();
        } catch (err) {
            console.error(err);
            alert("Chuyển vào lịch sử thất bại!");
        }
    };

    const handleDelete = async (device_id) => {
        if (!window.confirm("Bạn có chắc muốn xóa khách hàng này?")) return;
        try {
            const res = await fetch(`http://localhost:8000/customers/delete/${device_id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Lỗi khi xóa!");
            alert("Đã xóa khách hàng!");
            fetchVehicles();
        } catch (err) {
            console.error(err);
            alert("Xóa thất bại!");
        }
    };

    const toggleDetails = (device_id) => {
        setExpandedRow(expandedRow === device_id ? null : device_id);
    };

    return (
        <div className="infor">
            <table>
                <thead>
                    <tr>
                        <th>Dòng xe</th>
                        <th>Biển số xe</th>
                        <th>Tên người thuê</th>
                        <th>Ngày trả</th>
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
                                <tr key={vehicle.Device_ID}>
                                    <td>{vehicle.Vehicle_name}</td>
                                    <td>{vehicle.License_plate}</td>
                                    <td>{vehicle.Renter_name}</td>
                                    <td>{vehicle.Return_day}</td>
                                    <td>
                                        <button className="morebutton" onClick={() => toggleDetails(vehicle.Device_ID)}>
                                            {expandedRow === vehicle.Device_ID ? "Ẩn" : "Chi tiết"}
                                        </button>
                                    </td>
                                </tr>
                                {expandedRow === vehicle.Device_ID && (
                                    <tr className="details-row">
                                        <td colSpan="5">
                                            {editRow === vehicle.Device_ID ? (
                                                <>
                                                    <div><strong>Tên xe</strong>: <input name="Vehicle_name" value={formData.Vehicle_name} onChange={handleChange} /></div>
                                                    <div><strong>Biển số xe</strong>: <input name="License_plate" value={formData.License_plate} onChange={handleChange} /></div>
                                                    <div><strong>Căn cước</strong>: <input name="CCCD" value={formData.CCCD} onChange={handleChange} /></div>
                                                    <div><strong>Tên người thuê</strong>: <input name="Renter_name" value={formData.Renter_name} onChange={handleChange} /></div>
                                                    <div><strong>Số điện thoại</strong>: <input name="Phone" value={formData.Phone} onChange={handleChange} /></div>
                                                    <div><strong>Ngày thuê</strong>: <input type="datetime-local" name="Start_day" value={formData.Start_day} onChange={handleChange} /></div>
                                                    <div><strong>Ngày trả</strong>: <input type="datetime-local" name="Return_day" value={formData.Return_day} onChange={handleChange} /></div>
                                                    <div><strong>Kiểu thuê</strong>: 
                                                        <select name="Rental_type" value={formData.Rental_type} onChange={handleChange}>
                                                            <option value="Thuê ngày">Thuê ngày</option>
                                                            <option value="Thuê tuần">Thuê tuần</option>
                                                            <option value="Thuê tháng">Thuê tháng</option>
                                                        </select>
                                                    </div>
                                                    <div><strong>Trạng thái</strong>: 
                                                        <select name="Status" value={formData.Status} onChange={handleChange}>
                                                            <option value="Đang thuê">Đang thuê</option>
                                                            <option value="Đã trả">Đã trả</option>
                                                        </select>
                                                    </div>
                                                    <div><strong>Thanh toán</strong>: 
                                                        <select name="Payment_status" value={formData.Payment_status} onChange={handleChange}>
                                                            <option value="Đã thanh toán">Đã thanh toán</option>
                                                            <option value="Chưa thanh toán">Chưa thanh toán</option>
                                                        </select>
                                                    </div>
                                                    <div><strong>Giá</strong>: <input name="Cost" value={formData.Cost} onChange={handleChange} /></div>
                                                    <button className="canclebutton" onClick={() => setEditRow(null)}>Hủy</button>
                                                    <button className="savebutton" onClick={() => handleSave(vehicle.Device_ID)}>Lưu</button>
                                                </>
                                            ) : (
                                                <>
                                                    <div><strong>Căn cước</strong>: {vehicle.CCCD}</div>
                                                    <div><strong>Số điện thoại</strong>: {vehicle.Phone}</div>
                                                    <div><strong>Ngày thuê</strong>: {vehicle.Start_day}</div>
                                                    <div><strong>Loại thuê</strong>: {vehicle.Rental_type}</div>
                                                    <div><strong>Trạng thái</strong>: {vehicle.Status}</div>
                                                    <div><strong>Thanh toán</strong>: {vehicle.Payment_status}</div>
                                                    <div><strong>Giá Thuê</strong>: {vehicle.Cost} VNĐ</div>
                                                    <button className="fixbutton" onClick={() => handleEditclick(vehicle)}>Sửa</button>
                                                    <button className="deletebutton" onClick={() => handleDelete(vehicle.Device_ID)} style={{ marginLeft: "10px" }}>Xóa</button>
                                                    <button className="archivebutton" onClick={() => handleArchive(vehicle.Device_ID)} style={{ marginLeft: "10px" }}>Xong</button>
                                                </>
                                            )}
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
