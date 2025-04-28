import { useState, useEffect } from "react";
import "./home.css"
import {Chart as ChartJS} from "chart.js/auto";
import { Bar , Doughnut, Line} from "react-chartjs-2";
import sourceData from "./sourceData.json"
import { IoMdAdd } from "react-icons/io";
import { IoIosNotifications } from "react-icons/io";
import { BsFillFuelPumpDieselFill } from "react-icons/bs";
import { FaSignal } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { FaCar } from "react-icons/fa";

function Home({onNavigate}) {
    const [vehicles, setVehicles] = useState([]);
    const [totalIncome, setTotalIncome] = useState(0); 
    const [currentTimeRange, setCurrentTimeRange] = useState({ start: 0, end: 10 });

    return(
        <div id="Home">
            <button className = "add-button" onClick={() => onNavigate("add")}>
                <IoMdAdd size={20}></IoMdAdd>  Add Device
            </button>
            <button className = "notice-button">
                <IoIosNotifications></IoIosNotifications>
            </button>
            <h2 className="h2-home" >Welcome Đình Duy   <FaCar></FaCar></h2>
            <div className="search">
                <FaSearch className="input-icon"/>
                <input type ="text" placeholder=" Search" ></input>
            </div>
            <div className="real-map">
                <h2>Real Time Map</h2>
                <img className="img-location"src = "https://img.freepik.com/premium-photo/futuristic-gps-navigation-map-with-glowing-location-pins-4k-photo-background_661472-664.jpg"></img>
                <h3 className="badge">ID:1001</h3>
                <span><BsFillFuelPumpDieselFill></BsFillFuelPumpDieselFill> Energy:85%</span>
                <span><FaSignal></FaSignal> Status: Strong</span>
                <h3 className="badge">ID:1002</h3>
                <span><BsFillFuelPumpDieselFill></BsFillFuelPumpDieselFill> Energy:10%</span>
                <span><FaSignal></FaSignal> Status: Weak</span>
                <h3 className="badge">ID:1003</h3>
                <span><BsFillFuelPumpDieselFill></BsFillFuelPumpDieselFill> Energy:50%%</span>
                <span><FaSignal></FaSignal> Status: Nomal</span>
            </div>
            <div className="chart-home">
                <Line 
                    data={{
                    labels: sourceData.slice(currentTimeRange.start, currentTimeRange.end).map((data) => data.label),
                    datasets: [
                        {
                        label: "Speed",
                        data: sourceData.slice(currentTimeRange.start, currentTimeRange.end).map((data) => data.speed),
                        borderColor: "#ed5909",
                        borderWidth: 2,
                        fill: false,
                        },
                    ],
                    }}
                    options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                        ticks: {
                            color: "rgba(255, 255, 255, 0.6)",
                            font: {
                            size: 14,
                            weight: "bold",
                            },
                        },
                        },
                        y: {
                        ticks: {
                            color: "rgba(255, 255, 255, 0.6)",
                            font: {
                            size: 14,
                            weight: "bold",
                            },
                        },
                        min:0,
                        max:120,
                        },
                    },
                    }}
                />
            </div>

                {/* Thêm slider ở dưới */}
            <div className="slider-container">
                <input
                    type="range"
                    min={0}
                    max={sourceData.length - 10}
                    value={currentTimeRange.start}
                    onChange={(e) => {
                    const newStart = parseInt(e.target.value);
                    setCurrentTimeRange({
                        start: newStart,
                        end: newStart + 10,
                    });
                    }}
                    className="slider"
                />
            </div>

            <div className="income">
                <h3>Monthly Income</h3>
                <span> VNĐ</span>
            </div>

            <div className="perform">
                <h3>Perform</h3>
            </div>
        </div>
    );
}

export default Home;