import { useEffect, useState } from "react";
import TodoApp from "./TodoApp.jsx";
import CaseTypeChart from "./CaseTypeChart";
import client from "./assets/client.png";
import lawyer from "./assets/lawyer.png";
import caseicon from "./assets/case.png";
import API_BASE_URL from "./config";

function DashboardPage() {
  const [counts, setCounts] = useState({
    totalClients: 0,
    totalLawyers: 0,
    totalCases: 0,
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/dashboard_counts`)
      .then((res) => res.json())
      .then((data) => {
        setCounts(data);
      })
      .catch((err) => console.error("Error fetching dashboard counts:", err));
  }, []);


  return (
    <>
      <div className="card-row">
        <div className="dash-card blue">
          <h3>{counts.totalClients}</h3>
          <p>Available Clients</p>
          <img src={client} alt="Client Icon" className="card-icon" />
        </div>

        <div className="dash-card green">
          <h3>{counts.totalLawyers}</h3>
          <p>Available Lawyers</p>
          <img src={lawyer} alt="Lawyer Icon" className="card-icon" />
        </div>

        <div className="dash-card yellow">
          <h3>{counts.totalCases}</h3>
          <p>Available Cases</p>
          <img src={caseicon} alt="Case Icon" className="card-icon" />
        </div>

        <div className="dash-card red">
          <h3>--</h3>
          <p>Unpaid Invoices</p>
        </div>
      </div>

      <div className="bottom-section">
        <CaseTypeChart />
        <TodoApp />
      </div>
    </>
  );
}

export default DashboardPage;
