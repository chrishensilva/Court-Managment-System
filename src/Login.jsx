import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import API_BASE_URL from "./config";
import "./login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const { toast } = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (data.status === "success") {
        setAuth(data.user);
        navigate("/");
      } else {
        toast(data.message || "Incorrect username or password", "error");
      }
    } catch (err) {
      console.error(err);
      toast("Login failed. Please check server connection.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        <form onSubmit={handleSubmit}>
          <h3>Case Management System</h3>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <br></br>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br></br>

          <button disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
