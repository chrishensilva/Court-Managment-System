import "./Form.css";
import API_BASE_URL from "./config";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

function AddLawyer() {
  const { hasPermission, logAction } = useAuth();
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!hasPermission('addlawyer')) {
      toast("You do not have permission to add lawyers.", "warning");
      return;
    }

    const formData = new FormData(e.target);
    const dataObj = Object.fromEntries(formData.entries());

    fetch(`${API_BASE_URL}/addLawyer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify(dataObj),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          logAction("Insert Lawyer", `Added lawyer: ${dataObj.name} (NIC: ${dataObj.nic})`);
          toast(data.message || "Lawyer added successfully", "success");
          e.target.reset();
        } else {
          toast("Error: " + data.message, "error");
        }
      })
      .catch(() => {
        toast("Server error. Please try again.", "error");
      });
  };

  return (
    <div className="container" id="addlawyer">
      <form onSubmit={handleSubmit}>
        <h2>Insert New Lawyer Details</h2>

        <label htmlFor="name">Name</label>
        <input type="text" className="field" name="name" required />

        <label htmlFor="nic">NIC Number</label>
        <input type="text" className="field" name="nic" required />

        <label htmlFor="email">Email</label>
        <input type="email" className="field" name="email" required />

        <label htmlFor="number">Contact Number</label>
        <input type="text" className="field" name="number" />

        <label htmlFor="note">Notes</label>
        <textarea className="field" name="note"></textarea>

        <div className="btnset">
          <input type="submit" className="submit" value="Submit" />
        </div>
      </form>
    </div>
  );
}

export default AddLawyer;
