import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import "./Dashboard.css";
import icon from "./assets/icon.png";

function DashboardLayout() {
  return (
    <div className="dashboard-container">
      <div className="top-nav">
        <img src={icon} alt="App Icon" className="app-icon" />
        <h2>Case Management System</h2>
      </div>

      <div className="body-wrapper">
        <Sidebar />

        <div className="main-body">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
