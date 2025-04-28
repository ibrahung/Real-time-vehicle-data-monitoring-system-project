import "./new.css";
import { useState } from "react";

function New() {
    const [vehicle, setVehicle] = useState({
        renter_name: "",
        cccd: "",
        vehicle_name: "",
        license_plate: "",
        phone: "",
        start_day: "",
        return_day: "",
        rental_type: "Day",
        cost: "",
        payment_status: "Not yet paid",
        status: "Renting",
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
                    <label>Vehicle Name</label>
                    <input type="text" name="vehicle_name" value={vehicle.vehicle_name} placeholder="Ví dụ: Honda CR-V" required onChange={handleChange} />

                    <label>License plate</label>
                    <input type="text" name="license_plate" value={vehicle.license_plate} placeholder="Ví dụ: 51H-342876" required onChange={handleChange} />

                    <label>Customer's name</label>
                    <input type="text" name="renter_name" value={vehicle.renter_name} placeholder="Lucas Graham" required onChange={handleChange} />

                    <label>Identification card</label>
                    <input type="text" name="cccd" value={vehicle.cccd} placeholder="123456789012" required onChange={handleChange} />

                    <label>Phone number</label>
                    <input type="tel" name="phone" value={vehicle.phone} required onChange={handleChange} />
                </div>

                <div className="form-column">
                    <label>Retal day</label>
                    <input type="datetime-local" name="start_day" value={vehicle.start_day} required onChange={handleChange} />

                    <label>Back day</label>
                    <input type="datetime-local" name="return_day" value={vehicle.return_day} required onChange={handleChange} />

                    <label>Rental cost</label>
                    <select name="rental_type" value={vehicle.rental_type} onChange={handleChange}>
                        <option value="Day">Day</option>
                        <option value="Week">Week</option>
                        <option value="Month">Month</option>
                    </select>

                    <label>Status</label>
                    <select name="status" value={vehicle.status} onChange={handleChange}>
                        <option value="Renting">Renting</option>
                        <option value="Returned"> Returned</option>
                    </select>

                    <label>Payment</label>
                    <select name="payment_status" value={vehicle.payment_status} onChange={handleChange}>
                        <option value="Not yet paid">Not yet paid</option>
                        <option value="Paid">Paid</option>
                    </select>

                    <label>Cost</label>
                    <input type="number" name="cost" value={vehicle.cost} placeholder="Thousand Dong (VNĐ)" required onChange={handleChange} />
                </div>
            </div>

            <button id="Save" onClick={handleSubmit}>Save</button>
        </div>
    );
}

export default New;
