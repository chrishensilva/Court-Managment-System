import "./Form.css";

function AddLawyer() {
  return (
    <>
      <div className="container">
        <form method="POST" action="http://localhost/api/addLawyer.php">
          <h2>Insert New Lawyer Details</h2>

          <label htmlFor="name">Name</label>
          <input type="text" className="field" name="name" />

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
    </>
  );
}

export default AddLawyer;
