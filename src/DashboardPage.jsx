import TodoApp from "./TodoApp.jsx";

function DashboardPage() {
  return (
    <>
      <div className="card-row">
        <div className="dash-card blue">
          <h3>53</h3>
          <p>Total Clients</p>
        </div>

        <div className="dash-card green">
          <h3>18%</h3>
          <p>Total Lawyers</p>
        </div>

        <div className="dash-card yellow">
          <h3>44</h3>
          <p>Total Cases</p>
        </div>

        <div className="dash-card red">
          <h3>65</h3>
          <p>Unpaid Invoices</p>
        </div>
      </div>

      <div className="bottom-section">
        {/*<div className="graph-box">
          <h3>Sales</h3>
          <div className="graph-placeholder">GRAPH HERE</div>
        </div>*/}

        {/*<div className="todo-box">
          <h3>To Do List</h3>
          <ul>
            <li>Design a nice theme</li>
            <li>Make the theme responsive</li>
            <li>Let theme shine like a star</li>
            <li>Check your messages</li>
          </ul>
        </div>*/}
        <TodoApp />
      </div>
    </>
  );
}

export default DashboardPage;
