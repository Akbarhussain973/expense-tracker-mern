import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function BudgetCard({ income, expense }) {
  const [budget, setBudget] = useState("");
  const [savedBudget, setSavedBudget] = useState(0);

  useEffect(() => {
    fetch(`${API_URL}/budget`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setSavedBudget(data.amount);
          setBudget(data.amount);
        }
      });
  }, []);

  const saveBudget = async () => {
    const res = await fetch(`${API_URL}/budget`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Number(budget),
      }),
    });

    const data = await res.json();
    setSavedBudget(data.amount);
  };

  const remaining = savedBudget - expense;
  const balance = income - expense;

  const budgetPercentage =
    savedBudget > 0 ? Math.min((expense / savedBudget) * 100, 100) : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4 dark:text-white">
        Monthly Budget
      </h2>

      <div className="flex gap-3">
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="border rounded-lg px-3 py-2 flex-1"
          placeholder="Enter monthly budget"
        />

        <button
          onClick={saveBudget}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-lg"
        >
          Save
        </button>
      </div>

      <div className="mt-6 space-y-2 text-gray-700 dark:text-gray-200">
        <p>Income: ${income.toFixed(2)}</p>
        <p>Monthly Budget: ${savedBudget.toFixed(2)}</p>
        <p>Spent: ${expense.toFixed(2)}</p>
        <p>Budget Remaining: ${remaining.toFixed(2)}</p>
        <p>Balance: ${balance.toFixed(2)}</p>
      </div>

      {savedBudget > 0 && (
        <div className="mt-5">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${
                budgetPercentage >= 100
                  ? "bg-red-500"
                  : budgetPercentage >= 80
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
              style={{ width: `${budgetPercentage}%` }}
            />
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {budgetPercentage.toFixed(0)}% of budget used
          </p>
        </div>
      )}

      <div className="mt-5 space-y-2">
        {income === 0 && (
          <p className="text-yellow-500 font-semibold">
            ⚠️ No income recorded. Add an income transaction to track your financial health.
          </p>
        )}

        {income > 0 && savedBudget > income && (
          <p className="text-yellow-500 font-semibold">
            ⚠️ Your monthly budget exceeds your income.
          </p>
        )}

        {balance < 0 && (
          <p className="text-red-500 font-semibold">
            🚨 You're spending more than you earn.
          </p>
        )}

        {balance >= 0 && remaining >= 0 && (
          <p className="text-green-500 font-semibold">
            ✅ You're within your budget.
          </p>
        )}

        {remaining < 0 && (
          <p className="text-red-500 font-semibold">
            🚨 Budget exceeded.
          </p>
        )}
      </div>
    </div>
  );
}

export default BudgetCard;
