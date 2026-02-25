import { useEffect, useState } from "react";
import TodoApp from "./TodoApp.jsx";
import CaseTypeChart from "./CaseTypeChart";
import client from "./assets/client.png";
import lawyer from "./assets/lawyer.png";
import caseicon from "./assets/case.png";
import API_BASE_URL from "./config";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';

function DashboardPage() {
  const [counts, setCounts] = useState({
    totalClients: 0,
    totalLawyers: 0,
    totalCases: 0,
  });

  const [hearings, setHearings] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/dashboard_counts`, {
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((data) => {
        setCounts(data);
      })
      .catch((err) => console.error("Error fetching dashboard counts:", err));

    fetch(`${API_BASE_URL}/getReportData`, {
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setHearings(data);
        }
      })
      .catch((err) => console.error("Error fetching hearings:", err));
  }, []);

  const getTileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      const items = hearings.filter(h => h.next_date === dateString);
      if (items.length > 0) {
        return (
          <div className="calendar-tile-content">
            <div className="dot"></div>
          </div>
        );
      }
    }
    return null;
  };


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
        <div className="chart-container">
          <CaseTypeChart />
        </div>

        <div className="calendar-container dash-card">
          <h3>Hearing Schedule</h3>
          <Calendar
            tileContent={getTileContent}
            className="custom-calendar"
          />
          <div className="upcoming-list">
            <h4>Upcoming Hearings</h4>
            <ul>
              {hearings
                .filter(h => new Date(h.next_date) >= new Date())
                .sort((a, b) => new Date(a.next_date) - new Date(b.next_date))
                .slice(0, 5)
                .map(h => (
                  <li key={h.nic}>
                    <strong>{h.next_date}</strong>: {h.name} ({h.nic})
                  </li>
                ))
              }
            </ul>
          </div>
        </div>

        <TodoApp />
      </div>
    </>
  );
}

export default DashboardPage;
