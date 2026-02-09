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

function Sidebar() {
  const navigate = useNavigate();
  const { setLoggedIn } = useAuth();
  const [active, setActive] = useState("/");

  function handleLogout() {
    setLoggedIn(false);
    localStorage.removeItem("loggedIn");
    navigate("/login");
  }

  function handleNavigate(path) {
    setActive(path);
    navigate(path);
  }

  return (
    <div className="sidebar-body">
      <div className="sidebar-links">
        <h3
          className={active === "/" ? "active" : ""}
          onClick={() => handleNavigate("/")}
        >
          <img src={dash} alt="Dashboard Icon" className="sidebar-icon" />
          Dashboard
        </h3>
        <h3
          className={active === "/lawyers" ? "active" : ""}
          onClick={() => handleNavigate("/lawyers")}
        >
          <img src={lawyericon} alt="Lawyers Icon" className="sidebar-icon" />
          Lawyers
        </h3>
        <h3
          className={active === "/clients" ? "active" : ""}
          onClick={() => handleNavigate("/clients")}
        >
          <img src={sidebarcase} alt="Cases Icon" className="sidebar-icon" />
          Cases
        </h3>
        <h3
          className={active === "/cases" ? "active" : ""}
          onClick={() => handleNavigate("/cases")}
        >
          <img src={assign} alt="Assign Icon" className="sidebar-icon" />
          Assign Cases
        </h3>
        <h3
          className={active === "/addlawyer" ? "active" : ""}
          onClick={() => handleNavigate("/addlawyer")}
        >
          <img src={newlawyer} alt="Add Lawyer Icon" className="sidebar-icon" />
          Add Lawyer
        </h3>
        <h3
          className={active === "/adduser" ? "active" : ""}
          onClick={() => handleNavigate("/adduser")}
        >
          <img src={newuser} alt="Add Client Icon" className="sidebar-icon" />
          Add New Case
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
