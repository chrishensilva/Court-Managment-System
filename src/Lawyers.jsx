import { useEffect, useState } from "react";
import "./Table.css";
import API_BASE_URL from "./config";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

function Lawyers() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const { user, logAction } = useAuth();
  const { toast, confirm } = useToast();

  // Load data
  const loadData = () => {
    fetch(`${API_BASE_URL}/getLawyers?search=${search}&page=${page}&limit=${limit}`, {
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          setData(data.data);
          setTotalPages(data.pagination.totalPages);
        } else {
          setData([]);
        }
      })
      .catch((err) => {
        console.error(err);
        setData([]);
      });
  };

  useEffect(() => {
    loadData();
  }, [page]); // Reload when page changes

  // Delete lawyer
  const deleteLawyer = async (nic) => {
    if (user?.role !== 'admin') {
      toast("Only admins can delete lawyers.", "warning");
      return;
    }
    const confirmed = await confirm("This will permanently delete this lawyer record.", "Delete Lawyer?", "danger");
    if (!confirmed) return;

    fetch(`${API_BASE_URL}/deleteLawyer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({ nic }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          logAction("Delete Lawyer", `Deleted lawyer with NIC: ${nic}`);
          toast("Lawyer deleted successfully.", "success");
          loadData();
        } else {
          toast("Failed to delete lawyer.", "error");
        }
      });
  };

  return (
    <div className="lawyers-page fade-in">
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
      <div className="table-container">
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
            {Array.isArray(data) && data.map((row) => (
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

      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="btn1"
          >
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="btn1"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Lawyers;
