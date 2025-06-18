import { useState } from "react";
import "../Styles/add.css"

function AddVehicle({ onNavigate }) {
    const [vehicle, setVehicle] = useState({
        License_plate: "",
        Device_ID: "",
        Install_Date: "",
        Username: ""
    });

    const handleChange = (e) => {
        setVehicle({ ...vehicle, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!vehicle.License_plate || !vehicle.Device_ID|| !vehicle.Install_Date|| !vehicle.Username) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/device/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    device_id: vehicle.Device_ID,
                    license_plate: vehicle.License_plate,
                    install_date: vehicle.Install_Date,
                    username: vehicle.Username
                }),
            });

            if (response.ok) {
                alert("Xe đã được thêm thành công!");
                setVehicle({License_plate: "",
                            Device_ID: "",
                            Install_Date: "",
                            Username: "" });
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
            <input type="text" name="License_plate" placeholder="Biển số xe" value={vehicle.License_plate} onChange={handleChange} />
            <input type="text" name="Device_ID" placeholder="ID ESP32" value={vehicle.Device_ID} onChange={handleChange} />
            <input type="datetime-local" name="Install_Date" value={vehicle.Install_Date} onChange={handleChange} />
            <input type="text" name="Username" placeholder="Tên chủ sở hữu" value={vehicle.Username} onChange={handleChange} />
            <button onClick={handleSubmit}>Add Device</button>
        </div>
    );
}

export default AddVehicle;
