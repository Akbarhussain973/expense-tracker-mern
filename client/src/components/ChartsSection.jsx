import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#22c55e", "#ef4444"];

function ChartsSection({ expenses }) {
  const pieData = useMemo(() => {
    const income = expenses
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + item.amount, 0);

    const expense = expenses
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + item.amount, 0);

    return [
      { name: "Income", value: income },
      { name: "Expense", value: expense },
    ];
  }, [expenses]);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        Financial Overview
      </h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={110}
              label
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ChartsSection;