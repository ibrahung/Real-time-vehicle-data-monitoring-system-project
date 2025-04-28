import { useState } from "react";
import Sign from "./Sign/sign.jsx";
import Pg1 from "./So1/pg1.jsx";
import New from "./So1/new.jsx";
import Setting from "./So1/setting.jsx";
import Information from "./So1/information.jsx";
import Monitor from "./So1/monitor.jsx";
import AddVehicle from "./So1/add.jsx";
import Home from "./So1/home.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState("home"); 

  if (!isLoggedIn) {
    return <Sign onSuccess={() => setIsLoggedIn(true)} />;
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      <Pg1 onNavigate={setCurrentPage} />

      {/* Nội dung hiển thị bên phải */}
      <div style={{ flexGrow: 1, padding: "20px" }}>
        {currentPage === "home" && <Home onNavigate={setCurrentPage} />}
        {currentPage === "new" && <New />}
        {currentPage === "monitor" && <Monitor />}
        {currentPage === "information" && <Information />}
        {currentPage === "setting" && <Setting />}
        {currentPage === "add" && <AddVehicle />}
      </div>
    </div>
  );
}

export default App;
