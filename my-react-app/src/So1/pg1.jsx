import React, { useState } from "react";
import { FaHome } from "react-icons/fa";
import { BsFillInfoSquareFill } from "react-icons/bs";
import { MdOutlineMonitor } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import { AiFillFileAdd } from "react-icons/ai";
import "./pg1.css";

function Pg1({ onNavigate }) {
    const [activeMenu, setActiveMenu] = useState("");

    const handleMenuClick = (menu) => {
        setActiveMenu(menu);
        onNavigate(menu);
    };

    return (
        <div className="sidebar">
            <h2>Quản lý xe</h2>
            <ul>
                <li
                    className={activeMenu === "home" ? "active":""}
                    onClick={() => handleMenuClick("home")}
                >
                    <FaHome className="icons"></FaHome> Home  
                </li>
                <li 
                    className={activeMenu === "new" ? "active" : ""}
                    onClick={() => handleMenuClick("new")}
                >
                    <AiFillFileAdd className="icons"></AiFillFileAdd> New
                </li>
                <li 
                    className={activeMenu === "monitor" ? "active" : ""}
                    onClick={() => handleMenuClick("monitor")}
                >
                    <MdOutlineMonitor className="icons"></MdOutlineMonitor> Monitoring
                </li>
                <li 
                    className={activeMenu === "information" ? "active" : ""}
                    onClick={() => handleMenuClick("information")}
                >
                    <BsFillInfoSquareFill className="icons"></BsFillInfoSquareFill> Information
                </li>
                <li 
                    className={activeMenu === "setting" ? "active" : ""}
                    onClick={() => handleMenuClick("setting")}
                >
                    <IoSettings className="icons"></IoSettings> Setting
                </li>
            </ul>
        </div>
    );
}

export default Pg1;
