import React, { useState } from "react";
import "../Styles/monitor.css";

const Monitor = () => {
  const handleOpenGrafana = () => {
    window.open("http://anhpn.ddns.net:8085/dashboards", "_blank");
  };

  return (
    <div className="monitor-page">
      <div className="monitor-header">
        <h2>🔍 Giám sát thời gian thực</h2>
        <p>Nhấn nút bên dưới để truy cập hệ thống dashboard.</p>
        <button className="open-grafana-button" onClick={handleOpenGrafana}>
          Truy cập Grafana Dashboard
        </button>
      </div>
    </div>
  );
};

export default Monitor;
