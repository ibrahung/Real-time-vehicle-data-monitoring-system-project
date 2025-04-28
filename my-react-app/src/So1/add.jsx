import { useState } from "react";
import "./add.css"

function AddVehicle({ onNavigate }) {
    const [vehicle, setVehicle] = useState({
        license_plate: "",
        esp32_id: ""
    });

    const handleChange = (e) => {
        setVehicle({ ...vehicle, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!vehicle.license_plate || !vehicle.esp32_id) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/device/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ID_ESP32: vehicle.esp32_id,
                    License_Plate: vehicle.license_plate
                }),
            });

            if (response.ok) {
                alert("Xe đã được thêm thành công!");
                setVehicle({ license_plate: "", esp32_id: "" });
            } else {
                alert("Thêm xe thất bại! Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Lỗi kết nối:", error);
            alert("Không thể kết nối đến server!");
        }
    };

    return (
        <div className="add-vehicle-container">
            <input type="text" name="license_plate" placeholder="Biển số xe" value={vehicle.license_plate} onChange={handleChange} />
            <input type="text" name="esp32_id" placeholder="Mã ESP32" value={vehicle.esp32_id} onChange={handleChange} />
            <button onClick={handleSubmit}>Add Device</button>
        </div>
    );
}

export default AddVehicle;
