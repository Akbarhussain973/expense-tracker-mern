import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;


function Dashboard() {
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ category: "", amount: "", type: "expense", description: "" });
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [stats, setStats] = useState({
    income: 0,
    expense: 0,
    balance: 0,
  });

  const navigate = useNavigate();

  const loadData = () => {
  Promise.all([
    fetch(`${API_URL}/categories`, {
      credentials: "include",
    }).then((res) => res.json()),

    fetch(`${API_URL}/transactions`, {
      credentials: "include",
    }).then((res) => res.json()),

    fetch(`${API_URL}/dashboard/stats`, {
      credentials: "include",
    }).then((res) => res.json()),
  ])
    .then(([categoriesData, expensesData, statsData]) => {
      setCategories(categoriesData);
      setExpenses(expensesData);
      setStats(statsData);
      setLoading(false);
    })
    .catch((err) => {
      console.error(err);
      setLoading(false);
    });
};

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogout = async () => {
  await fetch(`${API_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });
  navigate("/login");
};

const handleEdit = (exp) => {
    setEditingId(exp._id);
    setForm({
    category: exp.category._id,
    amount: exp.amount,
    type: exp.type,
    description: exp.description,
    });
};



  const handleAddCategory = async (e) => {
    e.preventDefault();

    const url = editingCategoryId
      ? `${API_URL}/categories/${editingCategoryId}`
      : `${API_URL}/categories`;

    const method = editingCategoryId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: categoryName,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save category");
      }

      setCategoryName("");
      setEditingCategoryId(null);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const url = editingId
    ? `${API_URL}/transactions/${editingId}`
    : `${API_URL}/transactions`;

    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to add expense");
        return;
      }

      setForm({ category: "", amount: "", type: "expense", description: "" });
      setEditingId(null);
      loadData(); // refresh the list
    } catch (err) {
      setError("Server unreachable, " + err);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategoryId(category._id);
    setCategoryName(category.name);
  };

  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this transaction?")) {
  return;
  }
  try {
    await fetch(`${API_URL}/transactions/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
       loadData(); // refresh list after delete
    }  catch (err) {
    setError("Failed to delete, " + err);
  }
};

const handleDeleteCategory = async (id) => {
  if (!window.confirm("Delete this category?")) {
  return;
  }
  try {
    const res = await fetch(`${API_URL}/categories/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Failed to delete category");
    }


    if (editingCategoryId === id) {
      setEditingCategoryId(null);
      setCategoryName("");
    }

    loadData();
  } catch (err) {
    setError(err.message);
  }
};

  if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-xl font-semibold text-gray-600 animate-pulse">
        Loading...
      </div>
    </div>
  );
}
  return (
    <div className="min-h-screen bg-gray-100 p-8">
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Expense Tracker
          </h1>
          <p className="text-gray-500">
            Manage your finances
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
    </div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
      Overview
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

      <div className="bg-white rounded-xl shadow-md p-6">
        <p className="text-gray-500 text-sm">Balance</p>
        <h3 className="text-3xl font-bold text-blue-600">
          ${stats.balance}
        </h3>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <p className="text-gray-500 text-sm">Income</p>
        <h3 className="text-3xl font-bold text-green-600">
          ${stats.income}
        </h3>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <p className="text-gray-500 text-sm">Expense</p>
        <h3 className="text-3xl font-bold text-red-600">
          ${stats.expense}
        </h3>
      </div>

    </div>

    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
  <h2 className="text-2xl font-semibold text-gray-700 mb-6">
    Categories
  </h2>

  <ul className="space-y-3 mb-6">
    {categories.map((cat) => (
      <li
        key={cat._id}
        className="flex items-center justify-between border rounded-lg p-3"
      >
        <span className="font-medium">{cat.name}</span>

        <div className="space-x-2">
          <button
            onClick={() => handleEditCategory(cat)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
          >
            Edit
          </button>

          <button
            onClick={() => handleDeleteCategory(cat._id)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      </li>
    ))}
  </ul>

    <form
      onSubmit={handleAddCategory}
      className="flex gap-3"
    >
      <input
        placeholder="Category name"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-lg"
      >
        {editingCategoryId ? "Update" : "Add"}
      </button>

      {editingCategoryId && (
        <button
          type="button"
          onClick={() => {
            setEditingCategoryId(null);
            setCategoryName("");
          }}
          className="bg-gray-400 hover:bg-gray-500 text-white px-5 rounded-lg"
        >
          Cancel
        </button>
      )}
    </form>
  </div>
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
  <h2 className="text-2xl font-semibold text-gray-700 mb-6">
    {editingId ? "Edit Transaction" : "Add Transaction"}
  </h2>

  {error && (
    <p className="text-red-500 mb-4">{error}</p>
  )}

  <form
    onSubmit={handleSubmit}
    className="grid grid-cols-1 md:grid-cols-2 gap-4"
  >
    <select
      name="category"
      value={form.category}
      onChange={handleChange}
      className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    >
      <option value="">Select category</option>

      {categories.map((cat) => (
        <option
          key={cat._id}
          value={cat._id}
        >
          {cat.name}
        </option>
      ))}
    </select>

    <input
      type="number"
      name="amount"
      placeholder="Amount"
      value={form.amount}
      onChange={handleChange}
      className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />

    <select
      name="type"
      value={form.type}
      onChange={handleChange}
      className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="expense">Expense</option>
      <option value="income">Income</option>
    </select>

    <input
      name="description"
      placeholder="Description"
      value={form.description}
      onChange={handleChange}
      className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <div className="md:col-span-2 flex gap-3">
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
      >
        {editingId ? "Update" : "Add"}
      </button>

      {editingId && (
        <button
          type="button"
          onClick={() => {
            setEditingId(null);
            setForm({
              category: "",
              amount: "",
              type: "expense",
              description: "",
            });
          }}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
        >
          Cancel
        </button>
      )}
    </div>
  </form>
</div>

      <div className="bg-white rounded-xl shadow-md p-6">
  <h2 className="text-2xl font-semibold text-gray-700 mb-6">
    Transactions
  </h2>

  <div className="overflow-x-auto">
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-100">
          <th className="text-left p-3">Category</th>
          <th className="text-left p-3">Amount</th>
          <th className="text-left p-3">Type</th>
          <th className="text-left p-3">Description</th>
          <th className="text-left p-3">Actions</th>
        </tr>
      </thead>

    <tbody>
      {expenses.length === 0 ? (
        <tr>
          <td
            colSpan="5"
            className="text-center py-8 text-gray-500"
          >
            No transactions yet.
          </td>
        </tr>
      ) : (
        expenses.map((exp) => (
          <tr
            key={exp._id}
            className="border-b hover:bg-gray-50"
          >
            <td className="p-3">
              {exp.category?.name || "Uncategorized"}
            </td>

            <td className="p-3 font-semibold">
              ${exp.amount}
            </td>

            <td className="p-3">
              <span
                className={`px-3 py-1 rounded-full text-sm text-white ${
                  exp.type === "income"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              >
                {exp.type}
              </span>
            </td>

            <td className="p-3">
              {exp.description}
            </td>

            <td className="p-3 space-x-2">
              <button
                onClick={() => handleEdit(exp)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(exp._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </td>
          </tr>
        ))
      )}
    </tbody>
    </table>
  </div>
</div>
    </div>
    </div>
  );
}

export default Dashboard;