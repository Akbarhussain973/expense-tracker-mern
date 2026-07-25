import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function BudgetCard({ expense }) {
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
          placeholder="Enter budget"
        />

        <button
          onClick={saveBudget}
          className="bg-blue-600 text-white px-5 rounded-lg"
        >
          Save
        </button>
      </div>

      <div className="mt-5 space-y-2">
        <p>Budget: ${savedBudget}</p>
        <p>Spent: ${expense}</p>
        <p>Remaining: ${remaining}</p>

        {savedBudget > 0 && (
          <p
            className={
              remaining < 0
                ? "text-red-500 font-semibold"
                : remaining < savedBudget * 0.2
                ? "text-yellow-500 font-semibold"
                : "text-green-500 font-semibold"
            }
          >
            {remaining < 0
              ? "Budget exceeded!"
              : remaining < savedBudget * 0.2
              ? "You're close to your budget."
              : "You're within your budget."}
          </p>
        )}
      </div>
    </div>
  );
}

export default BudgetCard;