import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Form.css";
import API_BASE_URL from "./config";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

function AddLawyer() {
  const { hasPermission, logAction } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  // If navigated here with editData state, switch to edit mode
  const editData = location.state?.editData || null;
  const isEditing = !!editData;

  const [form, setForm] = useState({
    name: "",
    nic: "",
    email: "",
    contact: "",
    note: "",
  });

  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name || "",
        nic: editData.nic || "",
        email: editData.email || "",
        contact: editData.contact || "",
        note: editData.note || "",
      });
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!hasPermission('addlawyer')) {
      toast("You do not have permission to manage lawyers.", "warning");
      return;
    }

    const endpoint = isEditing ? "/updateLawyer" : "/addLawyer";
    const action = isEditing ? "Update Lawyer" : "Insert Lawyer";
    const successMsg = isEditing ? "Lawyer updated successfully!" : "Lawyer added successfully!";

    fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      credentials: "include",
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          logAction(action, `${action}: ${form.name} (NIC: ${form.nic})`);
          toast(successMsg, "success");
          if (isEditing) {
            navigate("/lawyers");
          } else {
            setForm({ name: "", nic: "", email: "", contact: "", note: "" });
          }
        } else {
          toast("Error: " + (data.message || "Operation failed"), "error");
        }
      })
      .catch(() => {
        toast("Server error. Please try again.", "error");
      });
  };

  return (
    <div className="container" id="addlawyer">
      <form onSubmit={handleSubmit}>
        <h2>{isEditing ? "Edit Lawyer Details" : "Insert New Lawyer Details"}</h2>

        {isEditing && (
          <div style={{ marginBottom: "12px", padding: "8px 12px", background: "#fff3cd", borderRadius: "6px", fontSize: "13px", color: "#856404" }}>
            ✏️ Editing lawyer: <strong>{editData.name}</strong>
          </div>
        )}

        <label htmlFor="name">Name</label>
        <input type="text" className="field" name="name" value={form.name} onChange={handleChange} required />

        <label htmlFor="nic">NIC Number</label>
        <input
          type="text"
          className="field"
          name="nic"
          value={form.nic}
          onChange={handleChange}
          required
          readOnly={isEditing}
          style={isEditing ? { opacity: 0.6, cursor: "not-allowed" } : {}}
          title={isEditing ? "NIC cannot be changed" : ""}
        />

        <label htmlFor="email">Email</label>
        <input type="email" className="field" name="email" value={form.email} onChange={handleChange} required />

        <label htmlFor="contact">Contact Number</label>
        <input type="text" className="field" name="contact" value={form.contact} onChange={handleChange} />

        <label htmlFor="note">Notes</label>
        <textarea className="field" name="note" value={form.note} onChange={handleChange}></textarea>

        <div className="btnset">
          {isEditing && (
            <button type="button" className="submit" style={{ background: "#6c757d", marginRight: "10px" }} onClick={() => navigate("/lawyers")}>
              Cancel
            </button>
          )}
          <input type="submit" className="submit" value={isEditing ? "Update Lawyer" : "Submit"} />
        </div>
      </form>
    </div>
  );
}

export default AddLawyer;
