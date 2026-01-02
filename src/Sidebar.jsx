import "./Sidebar.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function Sidebar() {
  const navigate = useNavigate();
  const { setLoggedIn } = useAuth();

  function handleLogout() {
    setLoggedIn(false);
    localStorage.removeItem("loggedIn");
    navigate("/login");
  }

  return (
    <div className="sidebar-body">
      <div className="sidebar-links">
        <h3 onClick={() => navigate("/")}>Dashboard</h3>
        <h3 onClick={() => navigate("/lawyers")}>Lawyers</h3>
        <h3 onClick={() => navigate("/clients")}>Clients</h3>
        <h3 onClick={() => navigate("/cases")}>Cases</h3>
        <h3 onClick={() => navigate("/addlawyer")}>Add New Lawyer</h3>
        <h3 onClick={() => navigate("/adduser")}>Add New Client</h3>
      </div>

      {/* Logout Button */}
      <div className="sidebar-logout">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <footer>
        <p>All rights reserved©2025 ChrishenSilva</p>
      </footer>
    </div>
  );
}

export default Sidebar;
