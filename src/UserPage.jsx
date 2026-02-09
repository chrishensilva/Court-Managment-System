import { useEffect, useState } from "react";

function UserPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("");

  // Load users
  const loadUsers = () => {
    fetch(`http://localhost/api/getUsers.php?search=${search}`)
      .then((res) => res.json())
      .then((data) => setUsers(data));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Delete user
  const deleteUser = (nic) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    fetch(`http://localhost/api/deleteUser.php?nic=${nic}`)
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);
        setMsgType(data.status === "success" ? "success" : "error");
        loadUsers();
      });
  };

  return (
    <div className="main-container" data-aos="fade-in">
      <div className="showdata">
        {/* Header */}
        <div className="btnset1" data-aos="fade-down">
          <h2>Cases</h2>

          <div className="search-form">
            <input
              type="search"
              className="searchbar"
              placeholder="Enter NIC"
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
        <table className="styled-table" data-aos="fade-up">
          <thead>
            <tr>
              <th>Name</th>
              <th>NIC</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Address</th>
              <th>Lawyers</th>
              <th>Notes</th>
              <th>Crime Type</th>
              <th>Last Court Date</th>
              <th>Next Court Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u, index) => (
              <tr key={u.nic} data-aos="fade-up" data-aos-delay={index * 80}>
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

                <td>{u.note || "-"}</td>
                <td>{u.casetype}</td>
                <td>{u.last_date}</td>
                <td>{u.next_date}</td>

                <td>
                  <button
                    className="delete-btn"
                    onClick={() => deleteUser(u.nic)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && <p className="no-data">No records found.</p>}
      </div>
    </div>
  );
}

export default UserPage;
