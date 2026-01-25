import { useEffect, useState } from "react";
import "./Form.css";

function AddUser({ onSuccess }) {
  const [lawyers, setLawyers] = useState([]);

  // Fetch lawyers list
  useEffect(() => {
    fetch("http://localhost/api/getLawyers.php")
      .then((res) => res.json())
      .then((data) => setLawyers(data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    await fetch("http://localhost/api/addUser.php", {
      method: "POST",
      body: formData,
    });

    e.target.reset();
    onSuccess && onSuccess();
  };

  return (
    <div className="container" id="adduser">
      <form onSubmit={handleSubmit}>
        <h2>Insert New User Record</h2>

        <label htmlFor="name">Name</label>
        <input type="text" className="field" name="name" required />

        <label htmlFor="nic">NIC Number</label>
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
          <option value="">Select Case Type</option>
          <option value="criminal">Criminal</option>
          <option value="civil">Civil</option>
          <option value="family">Family</option>
          <option value="corporate">Corporate</option>
          <option value="property">Property</option>
        </select>

        <div className="btnset">
          <input type="submit" className="submit" />
        </div>
      </form>
    </div>
  );
}

export default AddUser;
