import { useEffect, useState } from "react";
import "./Table.css";
function Lawyers() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  // Load data
  const loadData = () => {
    fetch(`http://localhost/api/getLawyers.php?search=${search}`)
      .then((res) => res.json())
      .then((data) => setData(data));
  };

  useEffect(() => {
    loadData();
  }, []);

  // Delete lawyer
  const deleteLawyer = (nic) => {
    if (!window.confirm("Delete this lawyer?")) return;

    fetch(`http://localhost/api/deleteLawyer.php?nic=${nic}`)
      .then((res) => res.text())
      .then((msg) => {
        if (msg === "success") {
          loadData();
        }
      });
  };

  return (
    <div className="lawyers-page">
      <h2>Lawyers</h2>

      {/* Search */}
      <input
        className="searchbar"
        type="text"
        placeholder="Enter NIC"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button className="btn1" onClick={loadData}>
        Search
      </button>

      {/* Table */}
      <table className="styled-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>NIC</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Note</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.nic}>
              <td>{row.name}</td>
              <td>{row.nic}</td>
              <td>{row.email}</td>
              <td>{row.contact}</td>
              <td>{row.note}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => deleteLawyer(row.nic)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Lawyers;
