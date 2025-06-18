import { useState } from "react";
import "./sign.css";

function Sign({ onSuccess }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("http://localhost:8000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password, phone, name }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("username", data.username);
                localStorage.setItem("role", data.role);
                alert("Đăng nhập thành công");
                onSuccess();
            } else {
                setError(data.detail || "Sai thông tin đăng nhập");
            }
        } catch (err) {
            setError("Không thể kết nối đến server.");
        }
    };

    return (
        <div className="container">
            <div className="form-box">
                <form onSubmit={handleSubmit}>
                    <h2>Đăng Nhập</h2>

                    <input
                        className="Sign-input"
                        type="text"
                        placeholder="Tên đăng nhập"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        className="Sign-input"
                        type="password"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input
                        className="Sign-input"
                        type="text"
                        placeholder="Số điện thoại"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                    <input
                        className="Sign-input"
                        type="text"
                        placeholder="Tên chủ"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <button className="Sign-button" type="submit">
                        Đăng Nhập
                    </button>
                </form>
                {error && <p className="error-text">{error}</p>}
            </div>
        </div>
    );
}

export default Sign;
