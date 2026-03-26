import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Form.css";
import API_BASE_URL from "./config";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

function AddUser({ onSuccess }) {
  const [lawyers, setLawyers] = useState([]);
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
    number: "",
    address: "",
    lawyer1: "",
    lawyer2: "",
    lawyer3: "",
    last_date: "",
    next_date: "",
    note: "",
    casetype: "",
    status: "ongoing",
  });

  // Fetch lawyers list
  useEffect(() => {
    fetch(`${API_BASE_URL}/getLawyers`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setLawyers(data.data || []))
      .catch((err) => console.error(err));
  }, []);

  // Pre-fill form when in edit mode
  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name || "",
        nic: editData.nic || "",
        email: editData.email || "",
        number: editData.number || "",
        address: editData.address || "",
        lawyer1: editData.lawyer1 || "",
        lawyer2: editData.lawyer2 || "",
        lawyer3: editData.lawyer3 || "",
        last_date: editData.last_date || "",
        next_date: editData.next_date || "",
        note: editData.note || "",
        casetype: editData.casetype || "",
        status: editData.status || "ongoing",
      });
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hasPermission('adduser')) {
      toast("You do not have permission to manage cases.", "warning");
      return;
    }

    const endpoint = isEditing ? "/updateUser" : "/addUser";
    const action = isEditing ? "Update Case" : "Insert Case";
    const successMsg = isEditing ? "Case updated successfully!" : "Case record added successfully!";

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (data.status === "success") {
      logAction(action, `${action}: ${form.name} (Number: ${form.nic})`);
      toast(successMsg, "success");
      if (isEditing) {
        navigate("/clients");
      } else {
        setForm({
          name: "", nic: "", email: "", number: "", address: "",
          lawyer1: "", lawyer2: "", lawyer3: "",
          last_date: "", next_date: "", note: "", casetype: "", status: "ongoing",
        });
        onSuccess && onSuccess();
      }
    } else {
      toast("Error: " + (data.message || "Failed to save case"), "error");
    }
  };

  return (
    <div className="container" id="adduser">
      <form onSubmit={handleSubmit}>
        <h2>{isEditing ? "Edit Case Record" : "Insert New User Record"}</h2>

        {isEditing && (
          <div style={{ marginBottom: "12px", padding: "8px 12px", background: "#fff3cd", borderRadius: "6px", fontSize: "13px", color: "#856404" }}>
            ✏️ Editing case: <strong>{editData.name}</strong> ({editData.nic})
          </div>
        )}

        <label htmlFor="name">Name</label>
        <input type="text" className="field" name="name" value={form.name} onChange={handleChange} required />

        <label htmlFor="nic">Case Number</label>
        <input
          type="text"
          className="field"
          name="nic"
          value={form.nic}
          onChange={handleChange}
          required
          readOnly={isEditing}
          style={isEditing ? { opacity: 0.6, cursor: "not-allowed" } : {}}
          title={isEditing ? "Case number cannot be changed" : ""}
        />

        <label htmlFor="email">Email</label>
        <input type="email" className="field" name="email" value={form.email} onChange={handleChange} required />

        <label htmlFor="number">Contact Number</label>
        <input type="text" className="field" name="number" value={form.number} onChange={handleChange} />

        <label htmlFor="address">Client Address</label>
        <input type="text" className="field" name="address" value={form.address} onChange={handleChange} required />

        <label>Lawyer 1</label>
        <select className="field2" name="lawyer1" value={form.lawyer1} onChange={handleChange}>
          <option value="">Select Lawyer</option>
          {lawyers.map((l) => (
            <option key={l.nic} value={l.name}>{l.name}</option>
          ))}
        </select>

        <label>Lawyer 2</label>
        <select className="field2" name="lawyer2" value={form.lawyer2} onChange={handleChange}>
          <option value="">Select Lawyer</option>
          {lawyers.map((l) => (
            <option key={l.nic} value={l.name}>{l.name}</option>
          ))}
        </select>

        <label>Lawyer 3</label>
        <select className="field2" name="lawyer3" value={form.lawyer3} onChange={handleChange}>
          <option value="">Select Lawyer</option>
          {lawyers.map((l) => (
            <option key={l.nic} value={l.name}>{l.name}</option>
          ))}
        </select>

        <label>Last Court Date</label>
        <input type="date" className="field" name="last_date" value={form.last_date} onChange={handleChange} required />

        <label>Next Court Date</label>
        <input type="date" className="field" name="next_date" value={form.next_date} onChange={handleChange} required />

        <label>Notes</label>
        <textarea className="field" name="note" value={form.note} onChange={handleChange}></textarea>

        <label>Case Type</label>
        <select className="field2" name="casetype" value={form.casetype} onChange={handleChange} required>
          <option value="">Select Court Type</option>
          <option value="Supreme Court">Supreme Court</option>
          <option value="Court of Appeal">Court of Appeal</option>
          <option value="Civil HC">Civil HC</option>
          <option value="Commercial HC">Commercial HC</option>
          <option value="District Court">District Court</option>
          <option value="Magistrate Court">Magistrate Court</option>
          <option value="Labour Tribunal">Labour Tribunal</option>
          <option value="Other">Other</option>
        </select>

        <div className="btnset">
          {isEditing && (
            <button type="button" className="submit" style={{ background: "#6c757d", marginRight: "10px" }} onClick={() => navigate("/clients")}>
              Cancel
            </button>
          )}
          <input type="submit" className="submit" value={isEditing ? "Update Case" : "Submit"} />
        </div>
      </form>
    </div>
  );
}

export default AddUser;
