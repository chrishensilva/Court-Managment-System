import { useEffect, useState } from "react";
import LoadingModal from "./LoadingModal";
import API_BASE_URL from "./config";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

function Cases() {
  const [users, setUsers] = useState([]);
  const [lawyers, setLawyers] = useState([]);
  const { user, hasPermission, logAction } = useAuth();
  const { toast, confirm } = useToast();
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loadingSubMessage, setLoadingSubMessage] = useState("");

  // Load lawyers
  const loadLawyers = async () => {
    const res = await fetch(`${API_BASE_URL}/getLawyers?limit=100`, {
      credentials: 'include'
    });
    const result = await res.json();
    if (result && Array.isArray(result.data)) {
      setLawyers(result.data);
    } else {
      setLawyers([]);
    }
  };

  // Load users with cases
  const loadUsers = async () => {
    const res = await fetch(`${API_BASE_URL}/getUserCases`, {
      credentials: 'include'
    });
    const data = await res.json();
    if (Array.isArray(data)) {
      setUsers(data);
    } else {
      setUsers([]);
    }
  };

  // Assign lawyer
  const assignLawyer = async (nic, lawyer) => {
    if (!hasPermission('assign')) {
      toast("You do not have permission to assign lawyers.", "warning");
      return;
    }
    if (!lawyer) return;

    const sendEmail = await confirm(
      "Do you want to send an email notification to the assigned lawyer?",
      "Send Email Notification?",
      "primary"
    );

    // If user cancelled the dialog, abort the assignment entirely
    if (sendEmail === false) return;

    setLoading(true);
    setLoadingMessage("Assigning Lawyer");
    setLoadingSubMessage(sendEmail ? "Sending email notification..." : "Updating case assignment...");

    try {
      const res = await fetch(`${API_BASE_URL}/assignLawyer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ nic, lawyer, sendEmail }),
      });

      const text = await res.text();
      console.log("RAW RESPONSE:", text);
      const data = JSON.parse(text);

      setLoading(false);

      if (data.status === "success") {
        logAction("Assign Lawyer", `Assigned ${lawyer} to case ${nic}`);
        toast(data.message || "Lawyer assigned successfully", "success");
        loadUsers();
      } else {
        toast("Assign lawyer failed: " + (data.message || "Unknown error"), "error");
      }
    } catch (err) {
      console.error("Assign lawyer failed:", err);
      setLoading(false);
      toast("Assign lawyer failed. Check console.", "error");
    }
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
        logAction("Update Status", `Updated status of case ${nic} to ${status}`);
        toast(`Status updated to "${status}"`, "success");
        loadUsers();
      } else {
        toast("Failed to update status", "error");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadLawyers();
    loadUsers();
  }, []);

  const getRowColor = (status) => {
    switch (status) {
      case "concluded": return "#d4edda";
      case "ongoing": return "#fff3cd";
      case "other": return "#e2e3e5";
      default: return "";
    }
  };

  return (
    <>
      {loading && (
        <LoadingModal
          message={loadingMessage}
          subMessage={loadingSubMessage}
        />
      )}

      <div className="main-container fade-in">
        <h2>Assign Lawyers to Cases</h2>
        <div className="table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Case Number</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Address</th>
                <th>Last Court Date</th>
                <th>Next Court Date</th>
                <th>Court Type</th>
                <th>Lawyers</th>
                <th>Status</th>
                <th>Note</th>
                <th>Assign Lawyer</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(users) && users.map((u) => (
                <tr key={u.nic} style={{ backgroundColor: getRowColor(u.status) }}>
                  <td>{u.name}</td>
                  <td>{u.nic}</td>
                  <td>{u.email}</td>
                  <td>{u.number}</td>
                  <td>{u.address}</td>
                  <td>{u.last_date}</td>
                  <td>{u.next_date}</td>
                  <td>{u.casetype}</td>
                  <td>{u.lawyer1}</td>
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
                  <td>{u.note}</td>
                  <td>
                    <select
                      defaultValue={u.assigned_lawyer || ""}
                      onChange={(e) => assignLawyer(u.nic, e.target.value)}
                      disabled={!hasPermission('assign')}
                    >
                      <option value="">Select</option>
                      {Array.isArray(lawyers) && lawyers.map((l) => (
                        <option key={l.nic} value={l.name}>
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
      </div>
    </>
  );
}

export default Cases;
