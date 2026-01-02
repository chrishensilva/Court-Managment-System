import "./Form.css";

function AddUser({ onSuccess }) {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    await fetch("http://localhost/api/addUser.php", {
      method: "POST",
      body: formData,
    });

    e.target.reset();

    // ✅ only call if parent passed it
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h2>Insert New User Record</h2> <label for="name">Name</label>{" "}
        <input type="text" class="field" name="name"></input>{" "}
        <label for="nic">NIC Number</label>{" "}
        <input type="text" class="field" name="nic" required></input>{" "}
        <label for="email">Email</label>{" "}
        <input type="email" class="field" name="email" required></input>{" "}
        <label for="number">Contact Number</label>{" "}
        <input type="text" class="field" name="number"></input>{" "}
        <label for="ldate">Last Court Date</label>{" "}
        <input type="date" class="field" name="ldate" required></input>{" "}
        <label for="ndate">Next Court Date</label>{" "}
        <input type="date" class="field" name="ndate" required></input>{" "}
        <label for="Note">Crime Type</label>{" "}
        <select class="field2" name="note" required>
          {" "}
          <option value="">Select Case Type</option>{" "}
          <option value="criminal">Criminal</option>{" "}
          <option value="civil">Civil</option>{" "}
          <option value="family">Family</option>{" "}
          <option value="corporate">Corporate</option>{" "}
          <option value="property">Property</option>{" "}
        </select>{" "}
        <div class="btnset">
          {" "}
          <input type="submit" class="submit"></input>{" "}
        </div>
      </form>
    </div>
  );
}

export default AddUser;
