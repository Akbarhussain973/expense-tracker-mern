import { useEffect, useState } from "react";


function Dashboard() {
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ category: "", amount: "", type: "expense", description: "" });
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  const loadData = () => {
    Promise.all([
      fetch("http://localhost:3000/categories", { credentials: "include" }).then((res) => res.json()),
      fetch("http://localhost:3000/transactions", { credentials: "include" }).then((res) => res.json()),
    ]).then(([categoriesData, expensesData]) => {
      setCategories(categoriesData);
      setExpenses(expensesData);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Dashboard</h2>

      <h3>Add Expense</h3>
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

      <h3>Expenses</h3>
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