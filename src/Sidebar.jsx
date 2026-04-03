import "./Sidebar.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useState } from "react";
import dash from "./assets/Dash/dashboard.png";
import lawyericon from "./assets/Dash/lawyer.png";
import sidebarcase from "./assets/Dash/case.png";
import assign from "./assets/Dash/assign.png";
import newlawyer from "./assets/Dash/newlawyer.png";
import newuser from "./assets/Dash/newclient.png";

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { logout, hasPermission, user } = useAuth();
  const [active, setActive] = useState("/app");

  function handleLogout() {
    logout();
    navigate("/"); // Return to marketing home after logout
    onClose();
  }

  function handleNavigate(path) {
    setActive(path);
    navigate(path);
    onClose();
  }

  return (
    <div className={`sidebar-body ${isOpen ? "open" : ""}`}>
      <button className="sidebar-close" onClick={onClose} aria-label="Close Menu">
        &times;
      </button>
      <div className="sidebar-links">
        {hasPermission('dashboard') && (
          <h3 className={active === "/app" ? "active" : ""} onClick={() => handleNavigate("/app")}>
            <img src={dash} alt="Dashboard Icon" className="sidebar-icon" />
            Dashboard
          </h3>
        )}
        {hasPermission('lawyers') && (
          <h3 className={active === "/app/lawyers" ? "active" : ""} onClick={() => handleNavigate("/app/lawyers")}>
            <img src={lawyericon} alt="Lawyers Icon" className="sidebar-icon" />
            Lawyers
          </h3>
        )}
        {hasPermission('cases') && (
          <h3 className={active === "/app/clients" ? "active" : ""} onClick={() => handleNavigate("/app/clients")}>
            <img src={sidebarcase} alt="Cases Icon" className="sidebar-icon" />
            Cases
          </h3>
        )}
        {hasPermission('assign') && (
          <h3 className={active === "/app/cases" ? "active" : ""} onClick={() => handleNavigate("/app/cases")}>
            <img src={assign} alt="Assign Icon" className="sidebar-icon" />
            Assign Cases
          </h3>
        )}
        {hasPermission('addlawyer') && (
          <h3 className={active === "/app/addlawyer" ? "active" : ""} onClick={() => handleNavigate("/app/addlawyer")}>
            <img src={newlawyer} alt="Add Lawyer Icon" className="sidebar-icon" />
            Add Lawyer
          </h3>
        )}
        {hasPermission('adduser') && (
          <h3 className={active === "/app/adduser" ? "active" : ""} onClick={() => handleNavigate("/app/adduser")}>
            <img src={newuser} alt="Add Client Icon" className="sidebar-icon" />
            Add New Case
          </h3>
        )}
        {hasPermission('report') && (
          <h3 className={active === "/app/report" ? "active" : ""} onClick={() => handleNavigate("/app/report")}>
            <img src={assign} alt="Report Icon" className="sidebar-icon" />
            Generate Report
          </h3>
        )}
        {user?.role === 'admin' && (
          <>
            <h3 className={active === "/app/addeditor" ? "active" : ""} onClick={() => handleNavigate("/app/addeditor")}>
              <img src={newuser} alt="Add Editor Icon" className="sidebar-icon" />
              Add Editor
            </h3>
            <h3 className={active === "/app/logs" ? "active" : ""} onClick={() => handleNavigate("/app/logs")}>
              <img src={dash} alt="Logs Icon" className="sidebar-icon" />
              Activity Logs
            </h3>
          </>
        )}
        <h3 className={active === "/app/account" ? "active" : ""} onClick={() => handleNavigate("/app/account")}>
          <img src={dash} alt="Account Icon" className="sidebar-icon" />
          My Account
        </h3>
      </div>

      <div className="sidebar-logout">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <footer>
        <p>All rights reserved ©2026 ChrishenSilva</p>
      </footer>
    </div>
  );
}

export default Sidebar;
