import React from "react";
import "./monitor.css"

const Monitor = () => {
  const openGrafana = () => {
    window.open("http://anhpn.ddns.net:8085/dashboards", "_blank");
  };

  return (
    <div className="Grafana">
      <button 
        onClick={openGrafana} 
        className="input">
        Mở Grafana
      </button>
    </div>
  );
};

export default Monitor;
