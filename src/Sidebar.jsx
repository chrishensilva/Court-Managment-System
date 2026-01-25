import "./Sidebar.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useState } from "react";

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
          Dashboard
        </h3>
        <h3
          className={active === "/lawyers" ? "active" : ""}
          onClick={() => handleNavigate("/lawyers")}
        >
          Lawyers
        </h3>
        <h3
          className={active === "/clients" ? "active" : ""}
          onClick={() => handleNavigate("/clients")}
        >
          Clients
        </h3>
        <h3
          className={active === "/cases" ? "active" : ""}
          onClick={() => handleNavigate("/cases")}
        >
          Cases
        </h3>
        <h3
          className={active === "/addlawyer" ? "active" : ""}
          onClick={() => handleNavigate("/addlawyer")}
        >
          Add New Lawyer
        </h3>
        <h3
          className={active === "/adduser" ? "active" : ""}
          onClick={() => handleNavigate("/adduser")}
        >
          Add New Case
        </h3>
      </div>

      <div className="sidebar-logout">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <footer>
        <p>All rights reserved ©2025 ChrishenSilva</p>
      </footer>
    </div>
  );
}

export default Sidebar;
