import { useEffect, useState } from "react";
import API_BASE_URL from "./config";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import "./UserPage.css";

function UserPage() {
  const { user, hasPermission, logAction } = useAuth();
  const { toast, confirm } = useToast();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [showDocModal, setShowDocModal] = useState(false);
  const [currentNic, setCurrentNic] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Load users
  const loadUsers = () => {
    fetch(`${API_BASE_URL}/getUsers?search=${search}&page=${page}&limit=${limit}`, {
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          setUsers(data.data);
          setTotalPages(data.pagination.totalPages);
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
  const deleteUser = async (nic) => {
    if (user?.role !== 'admin') {
      toast("Only admins can delete cases.", "warning");
      return;
    }
    const confirmed = await confirm("This will permanently delete this case record.", "Delete Case?", "danger");
    if (!confirmed) return;

    fetch(`${API_BASE_URL}/deleteUser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({ nic }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          logAction("Delete Case", `Deleted case with number: ${nic}`);
          toast("Case record deleted successfully.", "success");
        } else {
          toast(data.message || "Failed to delete record.", "error");
        }
        loadUsers();
      });
  };

  // Update status
  const updateStatus = async (nic, status) => {
    if (!hasPermission('cases')) {
      toast("You do not have permission to update status.", "warning");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/updateStatus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ nic, status }),
      });
      const data = await res.json();
      if (data.status === "success") {
        logAction("Update Status", `Changed status for case ${nic} to "${status}"`);
        toast(`Status updated to "${status}"`, "success");
        loadUsers();
      } else {
        toast("Failed to update status.", "error");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openDocModal = (nic) => {
    setCurrentNic(nic);
    setShowDocModal(true);
    fetchDocuments(nic);
  };

  const fetchDocuments = (nic) => {
    fetch(`${API_BASE_URL}/getDocuments/${nic}`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setDocuments(data));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast("Only PDF files are allowed.", "error");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('nic', currentNic);

    try {
      const res = await fetch(`${API_BASE_URL}/uploadDocument`, {
        method: "POST",
        credentials: "include",
        body: formData
      });
      const data = await res.json();
      if (data.status === 'success') {
        toast("Document uploaded successfully.", "success");
        fetchDocuments(currentNic);
      } else {
        toast(data.message || "Upload failed.", "error");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const deleteDocument = (id, path) => {
    fetch(`${API_BASE_URL}/deleteDocument`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id, path })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          toast("Document deleted.", "success");
          fetchDocuments(currentNic);
        }
      });
  };

  useEffect(() => {
    loadUsers();
  }, [search, page]);

  const getRowColor = (status) => {
    switch (status) {
      case "concluded": return "#d4edda";
      case "ongoing": return "#fff3cd";
      case "other": return "#e2e3e5";
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

        {/* Table */}
        <div className="table-container">
          <table className="styled-table" data-aos="fade-up">
            <thead>
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
                <th>Documents</th>
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
                    <button className="btn-small" onClick={() => openDocModal(u.nic)}>
                      Docs ({documents.filter(d => d.user_nic === u.nic).length || "View"})
                    </button>
                  </td>

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

        {showDocModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Documents for Case {currentNic}</h3>
              <div className="doc-list">
                {documents.map(doc => (
                  <div key={doc.id} className="doc-item">
                    <span>{doc.file_name}</span>
                    <div className="doc-actions">
                      <a href={`${API_BASE_URL.replace('/api', '')}${doc.file_path}`} target="_blank" rel="noreferrer" className="btn-small">View</a>
                      <button className="btn-small delete" onClick={() => deleteDocument(doc.id, doc.file_path)}>Delete</button>
                    </div>
                  </div>
                ))}
                {documents.length === 0 && <p>No documents uploaded yet.</p>}
              </div>
              <div className="upload-area">
                <input type="file" accept=".pdf" onChange={handleFileUpload} disabled={uploading} />
                {uploading && <span>Uploading...</span>}
              </div>
              <button className="btn1" onClick={() => setShowDocModal(false)}>Close</button>
            </div>
          </div>
        )}

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
    </div>
  );
}

export default UserPage;
