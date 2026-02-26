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
  const { setAuth, hasPermission, user } = useAuth();
  const [active, setActive] = useState("/");

  function handleLogout() {
    setAuth(null);
    navigate("/login");
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
          <h3 className={active === "/" ? "active" : ""} onClick={() => handleNavigate("/")}>
            <img src={dash} alt="Dashboard Icon" className="sidebar-icon" />
            Dashboard
          </h3>
        )}
        {hasPermission('lawyers') && (
          <h3 className={active === "/lawyers" ? "active" : ""} onClick={() => handleNavigate("/lawyers")}>
            <img src={lawyericon} alt="Lawyers Icon" className="sidebar-icon" />
            Lawyers
          </h3>
        )}
        {hasPermission('cases') && (
          <h3 className={active === "/clients" ? "active" : ""} onClick={() => handleNavigate("/clients")}>
            <img src={sidebarcase} alt="Cases Icon" className="sidebar-icon" />
            Cases
          </h3>
        )}
        {hasPermission('assign') && (
          <h3 className={active === "/cases" ? "active" : ""} onClick={() => handleNavigate("/cases")}>
            <img src={assign} alt="Assign Icon" className="sidebar-icon" />
            Assign Cases
          </h3>
        )}
        {hasPermission('addlawyer') && (
          <h3 className={active === "/addlawyer" ? "active" : ""} onClick={() => handleNavigate("/addlawyer")}>
            <img src={newlawyer} alt="Add Lawyer Icon" className="sidebar-icon" />
            Add Lawyer
          </h3>
        )}
        {hasPermission('adduser') && (
          <h3 className={active === "/adduser" ? "active" : ""} onClick={() => handleNavigate("/adduser")}>
            <img src={newuser} alt="Add Client Icon" className="sidebar-icon" />
            Add New Case
          </h3>
        )}
        {hasPermission('report') && (
          <h3 className={active === "/report" ? "active" : ""} onClick={() => handleNavigate("/report")}>
            <img src={assign} alt="Report Icon" className="sidebar-icon" />
            Generate Report
          </h3>
        )}
        {user?.role === 'admin' && (
          <>
            <h3 className={active === "/addeditor" ? "active" : ""} onClick={() => handleNavigate("/addeditor")}>
              <img src={newuser} alt="Add Editor Icon" className="sidebar-icon" />
              Add Editor
            </h3>
            <h3 className={active === "/logs" ? "active" : ""} onClick={() => handleNavigate("/logs")}>
              <img src={dash} alt="Logs Icon" className="sidebar-icon" />
              Activity Logs
            </h3>
          </>
        )}
        <h3 className={active === "/account" ? "active" : ""} onClick={() => handleNavigate("/account")}>
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
