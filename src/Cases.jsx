import { useEffect, useState } from "react";

function Cases() {
  const [users, setUsers] = useState([]);
  const [lawyers, setLawyers] = useState([]);

  // Load lawyers
  const loadLawyers = async () => {
    const res = await fetch("http://localhost/api/getLawyers.php");
    const data = await res.json();
    setLawyers(data);
  };

  // Load users with cases
  const loadUsers = async () => {
    const res = await fetch("http://localhost/api/getUserCases.php");
    const data = await res.json();
    setUsers(data);
  };

  // Assign lawyer
  const assignLawyer = async (nic, lawyer) => {
    const sendEmail = window.confirm("Send email to lawyer?");

    try {
      const res = await fetch("http://localhost/api/assignLawyer.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nic, lawyer, sendEmail }),
      });

      const text = await res.text();
      console.log("RAW RESPONSE:", text);

      const data = JSON.parse(text);

      if (data.status === "success") {
        alert(data.message || "Lawyer assigned successfully");
        loadUsers();
      } else {
        alert("Assign lawyer failed: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Assign lawyer failed:", err);
      alert("Assign lawyer failed. Check console.");
    }
  };

  useEffect(() => {
    loadLawyers();
    loadUsers();
  }, []);

  return (
    <div className="main-container">
      <h2>Assign Lawyers to Cases</h2>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>NIC</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Last Court Date</th>
            <th>Next Court Date</th>
            <th>Note</th>
            <th>Assign Lawyer</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.nic}>
              <td>{u.name}</td>
              <td>{u.nic}</td>
              <td>{u.email}</td>
              <td>{u.number}</td>
              <td>{u.last_date}</td>
              <td>{u.next_date}</td>
              <td>{u.note}</td>
              <td>
                <select
                  defaultValue={u.lawyer_name || ""}
                  onChange={(e) => assignLawyer(u.nic, e.target.value)}
                >
                  <option value="">Select</option>
                  {lawyers.map((l) => (
                    <option key={l.name} value={l.name}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Cases;
