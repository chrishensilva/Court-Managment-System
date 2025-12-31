import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Criminal", value: 32 },
  { name: "Civil", value: 45 },
  { name: "Family", value: 18 },
  { name: "Corporate", value: 22 },
  { name: "Property", value: 28 },
];

const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#7c3aed"];

export default function CaseTypeChart() {
  return (
    <div className="graph-box">
      <h3>Case Type Distribution</h3>

      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            labelLine={false}
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={105}
            paddingAngle={3}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>

          <Tooltip />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            wrapperStyle={{
              fontSize: "13px",
              paddingTop: "10px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
