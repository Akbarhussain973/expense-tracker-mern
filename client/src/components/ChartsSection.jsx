import { useMemo } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = ["#22c55e", "#ef4444"];

function ChartsSection({ expenses }) {
  // -----------------------------
  // Pie Chart Data
  // -----------------------------
  const pieData = useMemo(() => {
    const income = expenses
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + Number(item.amount), 0);

    const expense = expenses
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + Number(item.amount), 0);

    return [
      { name: "Income", value: income },
      { name: "Expense", value: expense },
    ];
  }, [expenses]);

  // -----------------------------
  // Monthly Bar Chart Data
  // -----------------------------
  const monthlyData = useMemo(() => {
    const months = {};

    expenses.forEach((item) => {
      const month = new Date(item.date).toLocaleString("default", {
        month: "short",
      });

      if (!months[month]) {
        months[month] = {
          month,
          income: 0,
          expense: 0,
        };
      }

      if (item.type === "income") {
        months[month].income += Number(item.amount);
      } else {
        months[month].expense += Number(item.amount);
      }
    });

    return Object.values(months);
  }, [expenses]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Pie Chart */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Income vs Expense
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

      {/* Bar Chart */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Monthly Summary
        </h2>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="income"
                fill="#22c55e"
                radius={[6, 6, 0, 0]}
              />

              <Bar
                dataKey="expense"
                fill="#ef4444"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default ChartsSection;