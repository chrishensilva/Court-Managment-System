import { useEffect, useState } from "react";
import API_BASE_URL from "./config";
import { useAuth } from "./AuthContext";

function UserPage() {
  const { user, hasPermission, logAction } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("");

  // Load users
  const loadUsers = () => {
    fetch(`${API_BASE_URL}/getUsers?search=${search}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          setUsers([]);
        }
      })
      .catch((err) => {
        console.error(err);
        setUsers([]);
      });
  };

  // Delete user
  const deleteUser = (nic) => {
    if (user?.role !== 'admin') {
      alert("Only admins can delete cases.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    fetch(`${API_BASE_URL}/deleteUser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nic }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          logAction("Delete Case", `Deleted case with number: ${nic}`);
        }
        setMessage(data.message || "Record deleted");
        setMsgType(data.status === "success" ? "success" : "error");
        loadUsers();
      });
  };

  // Update status
  const updateStatus = async (nic, status) => {
    if (!hasPermission('cases')) {
      alert("You do not have permission to update status.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/updateStatus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nic, status }),
      });
      const data = await res.json();
      if (data.status === "success") {
        logAction("Update Status", `Changed status for case ${nic} to "${status}"`);
        loadUsers();
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [search]);

  const getRowColor = (status) => {
    switch (status) {
      case "concluded": return "#d4edda"; // Light Green
      case "ongoing": return "#fff3cd"; // Light Orange/Yellow
      case "other": return "#e2e3e5"; // Light Gray
      default: return "";
    }
  };

  return (
    <div className="main-container fade-in">
      <div className="showdata">
        {/* Header */}
        <div className="btnset1" data-aos="fade-down">
          <h2>Cases</h2>

          <div className="search-form">
            <input
              type="search"
              className="searchbar"
              placeholder="Enter case number"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn1" onClick={loadUsers}>
              Search{" "}
            </button>
          </div>
        </div>

        {/* Delete Message */}
        {message && (
          <div className={`message-box ${msgType}`}>
            <span dangerouslySetInnerHTML={{ __html: message }} />
            <button className="close-btn" onClick={() => setMessage("")}>
              &times;
            </button>
          </div>
        )}

        {/* Table */}
        <div className="table-container">
          <table className="styled-table" data-aos="fade-up">
            <thead>
              {/* ... (headers remain the same) */}
              <tr>
                <th>Name</th>
                <th>Case Number</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Address</th>
                <th>Lawyers</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Court Type</th>
                <th>Last Court Date</th>
                <th>Next Court Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {Array.isArray(users) && users.map((u, index) => (
                <tr key={u.nic} data-aos="fade-up" data-aos-delay={index * 80} style={{ backgroundColor: getRowColor(u.status) }}>
                  <td>{u.name}</td>
                  <td>{u.nic}</td>
                  <td>{u.email}</td>
                  <td>{u.number}</td>
                  <td>{u.address || "-"}</td>

                  <td>
                    {[u.lawyer1, u.lawyer2, u.lawyer3]
                      .filter(Boolean)
                      .join(", ") || "-"}
                  </td>

                  <td>
                    <select
                      value={u.status || "ongoing"}
                      onChange={(e) => updateStatus(u.nic, e.target.value)}
                      disabled={!hasPermission('cases')}
                      style={{ backgroundColor: 'transparent', border: '1px solid #ccc', borderRadius: '4px' }}
                    >
                      <option value="ongoing">Ongoing</option>
                      <option value="concluded">Concluded</option>
                      <option value="other">Other</option>
                    </select>
                  </td>

                  <td>{u.note || "-"}</td>
                  <td>{u.casetype}</td>
                  <td>{u.last_date}</td>
                  <td>{u.next_date}</td>

                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => deleteUser(u.nic)}
                      style={{ opacity: user?.role === 'admin' ? 1 : 0.5, cursor: user?.role === 'admin' ? 'pointer' : 'not-allowed' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && <p className="no-data">No records found.</p>}
      </div>
    </div>
  );
}

export default UserPage;
