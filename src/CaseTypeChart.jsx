import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import API_BASE_URL from "./config";

const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#7c3aed"];

export default function CaseTypeChart({ refresh }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/getCaseStats`)
      .then((res) => res.json())
      .then((result) => setData(result))
      .catch((err) => console.error(err));
  }, [refresh]); // 👈 re-fetch when refresh changes


  return (
    <div className="graph-box">
      <h3>Court Type Distribution</h3>

      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={105}
            paddingAngle={3}
          >
            {Array.isArray(data) && data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip />
          <Legend verticalAlign="bottom" iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
