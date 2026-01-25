import "./Form.css";

function AddLawyer() {
  const handleSubmit = (e) => {
    e.preventDefault(); // 🚫 stop page reload

    const formData = new FormData(e.target);

    fetch("http://localhost/api/addLawyer.php", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          alert(data.message); // ✅ SUCCESS ALERT
          e.target.reset();
        } else {
          alert("Error: " + data.message);
        }
      })
      .catch(() => {
        alert("Server error");
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
