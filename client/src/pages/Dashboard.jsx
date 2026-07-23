import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


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
    fetch("http://localhost:3000/categories", {
      credentials: "include",
    }).then((res) => res.json()),

    fetch("http://localhost:3000/transactions", {
      credentials: "include",
    }).then((res) => res.json()),

    fetch("http://localhost:3000/dashboard/stats", {
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
  await fetch("http://localhost:3000/logout", {
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
      ? `http://localhost:3000/categories/${editingCategoryId}`
      : "http://localhost:3000/categories";

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
    ? `http://localhost:3000/transactions/${editingId}`
    : "http://localhost:3000/transactions";

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
  try {
    await fetch(`http://localhost:3000/transactions/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
       loadData(); // refresh list after delete
    }  catch (err) {
    setError("Failed to delete, " + err);
  }
};

const handleDeleteCategory = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/categories/${id}`, {
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

  if (loading) return <p>Loading...</p>;
  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
      <h3>Overview</h3>

    <p>Balance: ${stats.balance}</p>
    <p>Income: ${stats.income}</p>
    <p>Expense: ${stats.expense}</p>

    <h3>Add Category</h3>
    <h3>Categories</h3>

    <ul>
      {categories.map((cat) => (
        <li key={cat._id}>
          {cat.name}

        <button onClick={() => handleEditCategory(cat)}>
          Edit
        </button>
        <button onClick={() => handleDeleteCategory(cat._id)}>
        Delete
        </button>
        </li>
      ))}
    </ul>
    <form onSubmit={handleAddCategory}>
    <input
      placeholder="New category"
      value={categoryName}
      onChange={(e) => setCategoryName(e.target.value)}
      required
    />

    <button type="submit">
      {editingCategoryId ? "Update Category" : "Add Category"}
    </button>

    {editingCategoryId && (
      <button
        type="button"
        onClick={() => {
          setEditingCategoryId(null);
          setCategoryName("");
        }}
      >
        Cancel
      </button>
    )}
    </form>
      <h3>Add Transaction</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
        <input name="amount" type="number" placeholder="Amount" value={form.amount} onChange={handleChange} required />
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <button type="submit">{editingId ? "Update" : "Add"}</button>
        {editingId && (
        <button type="button" onClick={() => { setEditingId(null); setForm({ category: "", amount: "", type: "expense", description: "" }); }}>
        Cancel
        </button>
)}
      </form>

      <h3>Transactions</h3>
      <ul>
        {expenses.map((exp) => (
          <li key={exp._id}>
            {exp.category?.name || "Uncategorized"} — ${exp.amount} ({exp.type}) — {exp.description}
             <button onClick={() => handleEdit(exp)}>Edit</button>
             <button onClick={() => handleDelete(exp._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;