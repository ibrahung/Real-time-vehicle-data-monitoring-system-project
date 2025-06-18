import { useState } from "react";
import Sign from "./Sign/sign.jsx";
import Navbar from "./Components/navbar.jsx";
import New from "./Components/new.jsx";
import Setting from "./Components/setting.jsx";
import Information from "./Components/information.jsx";
import Monitor from "./Components/monitor.jsx";
import AddVehicle from "./Components/add.jsx";
import Home from "./Components/home.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState("home"); 

  if (!isLoggedIn) {
    return <Sign onSuccess={() => setIsLoggedIn(true)} />;
  }
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Navbar onNavigate={setCurrentPage} />
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
