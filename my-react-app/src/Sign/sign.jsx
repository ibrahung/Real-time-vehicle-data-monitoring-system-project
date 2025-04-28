import { useState } from "react";
import "./sign.css";

function Sign({ onSuccess }) {
    const [isSignIn, setIsSignIn] = useState(true);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isSignIn) {
            alert("Đăng nhập thành công");
            onSuccess();
        }
        else {
            alert("Đăng ký thành công");
            setIsSignIn(true);
        }
    };

    return (
        <div className="container">
            <div className="form-box">
                <div className="button-group">
                    <button className={isSignIn ? "active" : ""} onClick={() => setIsSignIn(true)}>Sign In</button>
                    <button className={!isSignIn ? "active" : ""} onClick={() => setIsSignIn(false)}>Sign Up</button>
                </div>
                <form onSubmit={handleSubmit}> 
                    <h2>{isSignIn ? "Đăng Nhập" : "Đăng Ký"}</h2>
                    {!isSignIn && <input className="Sign-input" type="text" placeholder="Tên đầy đủ" required />}
                    <input className="Sign-input" type="email" placeholder="Email" required />
                    <input className="Sign-input" type="password" placeholder="Mật khẩu" required />
                    <button className="Sign-button"type="submit">{isSignIn ? "Đăng Nhập" : "Đăng Ký"}</button>
                </form>
            </div>
        </div>
    );
}

export default Sign;
