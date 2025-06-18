import "../Styles/new.css";
import { useState } from "react";

function New() {
    const [vehicle, setVehicle] = useState({
        license_plate: "",
        renter_name: "",
        start_day: "",
        phone: "",
        cccd: "",
        return_day: "",
        rental_type: "Thuê ngày",
        cost: "",
        payment_status: "Chưa thanh toán",
        status: "Đang thuê",
        vehicle_name: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVehicle((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        for (const key in vehicle) {
            if (vehicle[key] === "") {
                alert(`Vui lòng nhập đầy đủ thông tin: ${key}`);
                return;
            }
        }
        try {
            const response = await fetch("http://localhost:8000/customers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(vehicle),
            });

            if (response.ok) {
                alert("Dữ liệu đã được lưu!");
                setVehicle({
                    renter_name: "",
                    cccd: "",
                    vehicle_name: "",
                    license_plate: "",
                    phone: "",
                    start_day: "",
                    return_day: "",
                    rental_type: "",
                    cost: "",
                    payment_status: "",
                    status: "",
                });
            } else {
                alert("Lưu dữ liệu thất bại!");
            }
        } catch (error) {
            alert("Lỗi kết nối đến server!");
            console.error("Lỗi:", error);
        }
    };
    return (
        <div className="new-container">
            <div className="form-row">
                <div className="form-column">
                    <label>Tên xe</label>
                    <input type="text" name="vehicle_name" value={vehicle.vehicle_name} placeholder="Ví dụ: Honda CR-V" required onChange={handleChange} />

                    <label>Biển số xe</label>
                    <input type="text" name="license_plate" value={vehicle.license_plate} placeholder="Ví dụ: 51H-342876" required onChange={handleChange} />

                    <label>Tên khách hàng</label>
                    <input type="text" name="renter_name" value={vehicle.renter_name} placeholder="Lucas Graham" required onChange={handleChange} />

                    <label>Căn cước công dân</label>
                    <input type="text" name="cccd" value={vehicle.cccd} placeholder="123456789012" required onChange={handleChange} />

                    <label>Số điện thoại</label>
                    <input type="tel" name="phone" value={vehicle.phone} required onChange={handleChange} />
                </div>

                <div className="form-column">
                    <label>Ngày thuê</label>
                    <input type="datetime-local" name="start_day" value={vehicle.start_day} required onChange={handleChange} />

                    <label>Ngày trả</label>
                    <input type="datetime-local" name="return_day" value={vehicle.return_day} required onChange={handleChange} />

                    <label>Kiểu thuê</label>
                    <select name="rental_type" value={vehicle.rental_type} onChange={handleChange}>
                        <option value="Thuê ngày">Thuê ngày</option>
                        <option value="Thuê tuần">Thuê tuần</option>
                        <option value="Thuê tháng">Thuê tháng</option>
                    </select>

                    <label>Trạng thái</label>
                    <select name="status" value={vehicle.status} onChange={handleChange}>
                        <option value="Đang thuê">Đang thuê</option>
                        <option value="Đã trả"> Đã trả</option>
                    </select>

                    <label>Trạng thái thanh toán</label>
                    <select name="payment_status" value={vehicle.payment_status} onChange={handleChange}>
                        <option value="Chưa thanh toán">Chưa thanh toán</option>
                        <option value="Đã thanh toán">Đã trả</option>
                    </select>

                    <label>Giá tiền</label>
                    <input type="number" name="cost" value={vehicle.cost} placeholder="Thousand Dong (VNĐ)" required onChange={handleChange} />
                </div>
            </div>

            <button id="Save" onClick={handleSubmit}>Save</button>
        </div>
    );
}

export default New;
