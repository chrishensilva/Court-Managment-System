import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { setLoggedIn } = useAuth();

  const correctUser = "admin";
  const correctPassword = "123";

  function handleSubmit(e) {
    e.preventDefault();

    if (username === correctUser && password === correctPassword) {
      setLoggedIn(true);
      navigate("/");
    } else {
      alert("Incorrect username or password");
    }
  }

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        <form onSubmit={handleSubmit}>
          <h3>Lawyer Managment System</h3>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br></br>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br></br>

          <button>Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
