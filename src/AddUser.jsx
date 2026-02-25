import { useEffect, useState } from "react";
import "./Form.css";
import API_BASE_URL from "./config";
import { useAuth } from "./AuthContext";

function AddUser({ onSuccess }) {
  const [lawyers, setLawyers] = useState([]);
  const { hasPermission, logAction } = useAuth();

  // Fetch lawyers list
  useEffect(() => {
    fetch(`${API_BASE_URL}/getLawyers`)
      .then((res) => res.json())
      .then((data) => setLawyers(data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hasPermission('adduser')) {
      alert("You do not have permission to add cases.");
      return;
    }

    const formData = new FormData(e.target);
    const dataObj = Object.fromEntries(formData.entries());

    const res = await fetch(`${API_BASE_URL}/addUser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataObj),
    });

    const data = await res.json();
    if (data.status === "success") {
      logAction("Insert Case", `Added case: ${dataObj.name} (Number: ${dataObj.nic})`);
    }

    e.target.reset();
    onSuccess && onSuccess();
  };


  return (
    <div className="container" id="adduser">
      <form onSubmit={handleSubmit}>
        <h2>Insert New User Record</h2>

        <label htmlFor="name">Name</label>
        <input type="text" className="field" name="name" required />

        <label htmlFor="nic">Case Number</label>
        <input type="text" className="field" name="nic" required />

        <label htmlFor="email">Email</label>
        <input type="email" className="field" name="email" required />

        <label htmlFor="number">Contact Number</label>
        <input type="text" className="field" name="number" />

        <label htmlFor="address">Client Address</label>
        <input type="text" className="field" name="address" required />

        <label>Lawyer 1</label>
        <select className="field2" name="lawyer1">
          <option value="">Select Lawyer</option>
          {lawyers.map((l) => (
            <option key={l.id} value={l.name}>
              {l.name}
            </option>
          ))}
        </select>

        <label>Lawyer 2</label>
        <select className="field2" name="lawyer2">
          <option value="">Select Lawyer</option>
          {lawyers.map((l) => (
            <option key={l.id} value={l.name}>
              {l.name}
            </option>
          ))}
        </select>

        <label>Lawyer 3</label>
        <select className="field2" name="lawyer3">
          <option value="">Select Lawyer</option>
          {lawyers.map((l) => (
            <option key={l.id} value={l.name}>
              {l.name}
            </option>
          ))}
        </select>

        <label>Last Court Date</label>
        <input type="date" className="field" name="ldate" required />

        <label>Next Court Date</label>
        <input type="date" className="field" name="ndate" required />

        <label>Notes</label>
        <textarea className="field" name="note"></textarea>

        <label>Case Type</label>
        <select className="field2" name="casetype" required>
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
          <input type="submit" className="submit" />
        </div>
      </form>
    </div>
  );
}

export default AddUser;
